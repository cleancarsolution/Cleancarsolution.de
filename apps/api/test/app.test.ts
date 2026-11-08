import { mkdtemp, readFile, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { FastifyInstance } from 'fastify';
import { buildApp } from '../src/app';
import { loadEnv } from '../src/config/env';
import { JsonlInquiryStore } from '../src/services/inquiry-store';

const VALID = {
  name: 'Max Mustermann',
  email: 'max@example.com',
  phone: '0176 123 456',
  vehicle: 'Porsche 911',
  service: 'handwaesche',
  preferredDate: '2030-05-10',
  message: 'Bitte inklusive Innenraum.',
  consent: true,
  website: '',
};

const cleanups: Array<() => Promise<void>> = [];

async function setup(overrides: Record<string, string> = {}) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'ccs-api-'));
  const env = loadEnv({ NODE_ENV: 'test', DATA_DIR: dir, ...overrides });
  const mailer = { sendInquiryNotification: vi.fn().mockResolvedValue(undefined) };
  const store = new JsonlInquiryStore(dir);
  const app: FastifyInstance = await buildApp({ env, store, mailer, logger: false });
  cleanups.push(async () => {
    await app.close();
    await rm(dir, { recursive: true, force: true });
  });
  return { app, mailer, store };
}

async function storedLines(file: string): Promise<string[]> {
  try {
    return (await readFile(file, 'utf8')).trim().split('\n').filter(Boolean);
  } catch {
    return [];
  }
}

afterEach(async () => {
  while (cleanups.length) await cleanups.pop()?.();
});

describe('GET /health', () => {
  it('meldet den Status', async () => {
    const { app } = await setup();
    const res = await app.inject({ method: 'GET', url: '/health' });
    expect(res.statusCode).toBe(200);
    expect(res.json()).toMatchObject({ status: 'ok' });
  });
});

describe('GET /v1/services', () => {
  it('liefert alle sechs Leistungen mit Cache-Header', async () => {
    const { app } = await setup();
    const res = await app.inject({ method: 'GET', url: '/v1/services' });
    expect(res.statusCode).toBe(200);
    expect(res.json().services).toHaveLength(6);
    expect(res.headers['cache-control']).toContain('max-age=300');
  });
});

describe('POST /v1/inquiries', () => {
  it('speichert eine gültige Anfrage und benachrichtigt', async () => {
    const { app, mailer, store } = await setup();
    const res = await app.inject({ method: 'POST', url: '/v1/inquiries', payload: VALID });

    expect(res.statusCode).toBe(201);
    const body = res.json();
    expect(body).toMatchObject({ ok: true });
    expect(body.id).toMatch(/^[0-9a-f-]{36}$/);

    const lines = await storedLines(store.file);
    expect(lines).toHaveLength(1);
    const record = JSON.parse(lines[0] ?? '{}');
    expect(record).toMatchObject({ id: body.id, name: VALID.name, service: 'handwaesche', consent: true });
    expect(record.ipHash).toMatch(/^[0-9a-f]{32}$/);
    expect(record).not.toHaveProperty('website');
    expect(mailer.sendInquiryNotification).toHaveBeenCalledOnce();
  });

  it('normalisiert leere optionale Felder', async () => {
    const { app, store } = await setup();
    const res = await app.inject({
      method: 'POST',
      url: '/v1/inquiries',
      payload: { ...VALID, phone: '', vehicle: '', service: '', preferredDate: '', message: '' },
    });
    expect(res.statusCode).toBe(201);
    const record = JSON.parse((await storedLines(store.file))[0] ?? '{}');
    expect(record.phone).toBeUndefined();
    expect(record.service).toBeUndefined();
  });

  it('lehnt ungültige Daten mit Feldfehlern ab (422)', async () => {
    const { app, mailer, store } = await setup();
    const res = await app.inject({
      method: 'POST',
      url: '/v1/inquiries',
      payload: { name: '', email: 'keine-mail', consent: false },
    });
    expect(res.statusCode).toBe(422);
    const body = res.json();
    expect(body).toMatchObject({ ok: false, error: 'validation_error' });
    expect(body.fieldErrors.name?.length).toBeGreaterThan(0);
    expect(body.fieldErrors.email?.length).toBeGreaterThan(0);
    expect(body.fieldErrors.consent?.length).toBeGreaterThan(0);
    expect(await storedLines(store.file)).toHaveLength(0);
    expect(mailer.sendInquiryNotification).not.toHaveBeenCalled();
  });

  it('verwirft Honeypot-Treffer stillschweigend', async () => {
    const { app, mailer, store } = await setup();
    const res = await app.inject({ method: 'POST', url: '/v1/inquiries', payload: { ...VALID, website: 'https://spam.example' } });
    expect(res.statusCode).toBe(201);
    expect(res.json()).toMatchObject({ ok: true });
    expect(await storedLines(store.file)).toHaveLength(0);
    expect(mailer.sendInquiryNotification).not.toHaveBeenCalled();
  });

  it('antwortet auf kaputtes JSON mit 400', async () => {
    const { app } = await setup();
    const res = await app.inject({
      method: 'POST',
      url: '/v1/inquiries',
      headers: { 'content-type': 'application/json' },
      payload: '{"name":',
    });
    expect(res.statusCode).toBe(400);
    expect(res.json()).toMatchObject({ ok: false, error: 'bad_request' });
  });

  it('begrenzt Anfragen pro IP (429)', async () => {
    const { app } = await setup({ INQUIRY_RATE_LIMIT_MAX: '2' });
    for (let i = 0; i < 2; i++) {
      const ok = await app.inject({ method: 'POST', url: '/v1/inquiries', payload: VALID });
      expect(ok.statusCode).toBe(201);
    }
    const res = await app.inject({ method: 'POST', url: '/v1/inquiries', payload: VALID });
    expect(res.statusCode).toBe(429);
    expect(res.json()).toMatchObject({ ok: false, error: 'rate_limited' });
  });
});

describe('CORS', () => {
  const preflight = (app: FastifyInstance, origin: string) =>
    app.inject({
      method: 'OPTIONS',
      url: '/v1/inquiries',
      headers: { origin, 'access-control-request-method': 'POST', 'access-control-request-headers': 'content-type' },
    });

  it('erlaubt in der Entwicklung jeden localhost-Port', async () => {
    const { app } = await setup({ NODE_ENV: 'development', LOG_LEVEL: 'silent' });
    for (const origin of ['http://localhost:3000', 'http://localhost:3005']) {
      const res = await preflight(app, origin);
      expect(res.headers['access-control-allow-origin']).toBe(origin);
    }
  });

  it('erlaubt in Produktion nur konfigurierte Origins', async () => {
    const { app } = await setup({
      NODE_ENV: 'production',
      LOG_LEVEL: 'silent',
      CORS_ORIGIN: 'https://cleancarsolution.de',
      IP_HASH_SALT: 'test-salt-123',
    });
    const allowed = await preflight(app, 'https://cleancarsolution.de');
    expect(allowed.headers['access-control-allow-origin']).toBe('https://cleancarsolution.de');
    const blocked = await preflight(app, 'https://evil.example');
    expect(blocked.headers['access-control-allow-origin']).toBeUndefined();
    const localhost = await preflight(app, 'http://localhost:3000');
    expect(localhost.headers['access-control-allow-origin']).toBeUndefined();
  });
});

describe('Unbekannte Routen', () => {
  it('liefert 404 als JSON', async () => {
    const { app } = await setup();
    const res = await app.inject({ method: 'GET', url: '/gibt-es-nicht' });
    expect(res.statusCode).toBe(404);
    expect(res.json()).toMatchObject({ ok: false, error: 'not_found' });
  });
});
