import { createHash, randomUUID } from 'node:crypto';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import Fastify, { type FastifyError, type FastifyInstance, type FastifyServerOptions } from 'fastify';
import {
  API_ROUTES,
  services,
  validateInquiry,
  type ApiErrorCode,
  type ApiErrorResponse,
  type InquirySuccessResponse,
} from '@ccs/shared';
import type { Env } from './config/env';
import { JsonlInquiryStore, type InquiryRecord, type InquiryStore } from './services/inquiry-store';
import { LogMailer, SmtpMailer, type Mailer } from './services/mailer';

export const APP_VERSION = process.env.npm_package_version ?? '0.1.0';

export interface AppOptions {
  env: Env;
  store?: InquiryStore;
  mailer?: Mailer;
  /** Überschreibt die Logger-Konfiguration (z. B. `false` in Tests). */
  logger?: FastifyServerOptions['logger'];
}

const LOCALHOST_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;

function apiError(error: ApiErrorCode, message: string): ApiErrorResponse {
  return { ok: false, error, message };
}

function hasPinoPretty(): boolean {
  try {
    import.meta.resolve('pino-pretty');
    return true;
  } catch {
    return false;
  }
}

function loggerOptions(env: Env): FastifyServerOptions['logger'] {
  if (env.NODE_ENV === 'test') return false;
  const base = {
    level: env.LOG_LEVEL,
    redact: ['req.headers.authorization', 'req.headers.cookie'],
  };
  if (env.NODE_ENV === 'development' && hasPinoPretty()) {
    return { ...base, transport: { target: 'pino-pretty', options: { translateTime: 'HH:MM:ss', ignore: 'pid,hostname' } } };
  }
  return base;
}

function isHoneypotFilled(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) return false;
  const value = (body as Record<string, unknown>).website;
  return typeof value === 'string' && value.trim() !== '';
}

function hashIp(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex').slice(0, 32);
}

/** Baut die Fastify-Instanz. Speicher & Mailer sind für Tests injizierbar. */
export async function buildApp({ env, store, mailer, logger }: AppOptions): Promise<FastifyInstance> {
  const app = Fastify({
    logger: logger ?? loggerOptions(env),
    trustProxy: env.TRUST_PROXY,
    bodyLimit: 32 * 1024,
  });

  const inquiryStore = store ?? new JsonlInquiryStore(env.DATA_DIR);
  const notifier = mailer ?? (env.SMTP_HOST ? new SmtpMailer(env) : new LogMailer(app.log));
  const allowedOrigins = new Set(env.CORS_ORIGIN);

  await app.register(helmet, {
    // reine JSON-API, die per CORS von der Website abgefragt wird
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  });

  await app.register(cors, {
    origin: (origin, callback) => {
      // Server-zu-Server / curl ohne Origin-Header
      if (!origin) return callback(null, true);
      const allowed = allowedOrigins.has(origin) || (env.NODE_ENV !== 'production' && LOCALHOST_ORIGIN.test(origin));
      callback(null, allowed);
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept'],
    credentials: false,
    maxAge: 600,
  });

  await app.register(rateLimit, {
    global: true,
    max: env.RATE_LIMIT_MAX,
    timeWindow: env.RATE_LIMIT_WINDOW,
    errorResponseBuilder: (_request, context) => ({
      statusCode: context.statusCode,
      ok: false,
      error: 'rate_limited',
      message: `Zu viele Anfragen in kurzer Zeit. Bitte versuchen Sie es in ${context.after} erneut.`,
    }),
  });

  app.setErrorHandler((error: FastifyError, request, reply) => {
    const status = error.statusCode ?? 500;
    if (status === 429) {
      return reply.code(429).send(apiError('rate_limited', error.message || 'Zu viele Anfragen in kurzer Zeit.'));
    }
    if (status >= 400 && status < 500) {
      const message =
        status === 413
          ? 'Die Anfrage ist zu groß.'
          : status === 415
            ? 'Bitte senden Sie die Anfrage als JSON.'
            : 'Die Anfrage konnte nicht gelesen werden.';
      return reply.code(status).send(apiError(status === 404 ? 'not_found' : 'bad_request', message));
    }
    request.log.error({ err: error }, 'Unerwarteter Fehler');
    return reply
      .code(500)
      .send(apiError('internal_error', 'Es ist ein interner Fehler aufgetreten. Bitte versuchen Sie es später erneut.'));
  });

  app.setNotFoundHandler((_request, reply) => {
    reply.code(404).send(apiError('not_found', 'Diese Route existiert nicht.'));
  });

  /* ── Routen ─────────────────────────────────────────────────────────── */

  app.get(API_ROUTES.health, async () => ({
    status: 'ok',
    uptime: Math.round(process.uptime()),
    version: APP_VERSION,
    timestamp: new Date().toISOString(),
  }));

  app.get(API_ROUTES.services, async (_request, reply) => {
    reply.header('cache-control', 'public, max-age=300');
    return { services };
  });

  app.post(
    API_ROUTES.inquiries,
    { config: { rateLimit: { max: env.INQUIRY_RATE_LIMIT_MAX, timeWindow: env.INQUIRY_RATE_LIMIT_WINDOW } } },
    async (request, reply) => {
      // Honeypot gefüllt → wie Erfolg antworten, aber nichts speichern oder versenden
      if (isHoneypotFilled(request.body)) {
        request.log.info('Honeypot ausgelöst – Anfrage verworfen');
        const fake: InquirySuccessResponse = { ok: true, id: randomUUID(), receivedAt: new Date().toISOString() };
        return reply.code(201).send(fake);
      }

      const result = validateInquiry(request.body);
      if (!result.success) {
        const response: ApiErrorResponse = {
          ...apiError('validation_error', 'Bitte prüfen Sie Ihre Eingaben.'),
          fieldErrors: result.fieldErrors,
        };
        return reply.code(422).send(response);
      }

      const { website: _honeypot, ...inquiry } = result.data;
      const record: InquiryRecord = {
        id: randomUUID(),
        receivedAt: new Date().toISOString(),
        ...inquiry,
        ipHash: hashIp(request.ip, env.IP_HASH_SALT),
        userAgent: request.headers['user-agent']?.slice(0, 300),
      };

      await inquiryStore.save(record);
      request.log.info({ inquiryId: record.id, service: record.service ?? null }, 'Terminanfrage gespeichert');

      // Versand blockiert die Antwort nicht; Fehler werden protokolliert
      notifier.sendInquiryNotification(record).catch((err: unknown) => {
        request.log.error({ err, inquiryId: record.id }, 'E-Mail-Benachrichtigung fehlgeschlagen');
      });

      const response: InquirySuccessResponse = { ok: true, id: record.id, receivedAt: record.receivedAt };
      return reply.code(201).send(response);
    },
  );

  return app;
}
