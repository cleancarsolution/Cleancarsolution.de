import { randomUUID } from 'node:crypto';
import { Resend } from 'resend';
import {
  buildInquiryEmail,
  site,
  validateInquiry,
  type ApiErrorCode,
  type ApiErrorResponse,
  type InquiryNotification,
  type InquirySuccessResponse,
} from '@ccs/shared';

/**
 * Terminanfrage → E-Mail an den Betrieb über Resend (auf Vercel eine Function in fra1).
 * Antwortet wie zuvor die API (apps/api): 201 · 400 · 413 · 422 · 429 · 500 – `lib/api.ts` versteht alle.
 * Gespeichert wird nichts: Die E-Mail ist der Datensatz, deshalb antwortet die Route erst nach dem Versand.
 */

const BODY_LIMIT_BYTES = 32 * 1024;
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60_000;

/** Zeitpunkte der letzten Anfragen je IP – nur im Speicher der laufenden Instanz, bremst einzelne Absender. */
const recentByIp = new Map<string, number[]>();

export async function POST(request: Request): Promise<Response> {
  const retryAfter = rateLimit(clientIp(request));
  if (retryAfter !== null) {
    return Response.json(apiError('rate_limited', 'Zu viele Anfragen in kurzer Zeit. Bitte versuchen Sie es später erneut.'), {
      status: 429,
      headers: { 'Retry-After': String(retryAfter) },
    });
  }

  const raw = await request.text();
  if (Buffer.byteLength(raw) > BODY_LIMIT_BYTES) {
    return Response.json(apiError('bad_request', 'Die Anfrage ist zu groß.'), { status: 413 });
  }
  const body = parseJson(raw);
  if (body === undefined) {
    return Response.json(apiError('bad_request', 'Die Anfrage konnte nicht gelesen werden.'), { status: 400 });
  }

  const id = randomUUID();
  const receivedAt = new Date().toISOString();

  // Honeypot gefüllt → wie Erfolg antworten, aber nichts versenden
  if (isHoneypotFilled(body)) return created(id, receivedAt);

  const result = validateInquiry(body);
  if (!result.success) {
    const response: ApiErrorResponse = {
      ...apiError('validation_error', 'Bitte prüfen Sie Ihre Eingaben.'),
      fieldErrors: result.fieldErrors,
    };
    return Response.json(response, { status: 422 });
  }

  if (!(await notify({ ...result.data, id, receivedAt }))) {
    return Response.json(
      apiError('internal_error', 'Es ist ein interner Fehler aufgetreten. Bitte versuchen Sie es später erneut.'),
      { status: 500 },
    );
  }
  return created(id, receivedAt);
}

/** Benachrichtigung an den Betrieb (Reply-To = Kunde). Protokolliert nur ID und Fehler, keine Kundendaten. */
async function notify(inquiry: InquiryNotification): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Lokal ohne Schlüssel bleibt das Formular testbar – in Produktion ist das ein Konfigurationsfehler
    if (process.env.NODE_ENV === 'development') {
      console.info(`[Anfrage ${inquiry.id}] RESEND_API_KEY fehlt – nur protokolliert, nicht versendet`);
      return true;
    }
    console.error(`[Anfrage ${inquiry.id}] RESEND_API_KEY fehlt – Anfrage konnte nicht versendet werden`);
    return false;
  }

  const { subject, text, html } = buildInquiryEmail(inquiry);
  const { error } = await new Resend(apiKey).emails.send({
    from: process.env.MAIL_FROM || `${site.name} Website <${site.email}>`,
    to: (process.env.MAIL_TO || site.email).split(',').map((address) => address.trim()),
    replyTo: inquiry.email,
    subject,
    text,
    html,
  });
  if (error) console.error(`[Anfrage ${inquiry.id}] Resend: ${error.name} – ${error.message}`);
  return !error;
}

function apiError(error: ApiErrorCode, message: string): ApiErrorResponse {
  return { ok: false, error, message };
}

function created(id: string, receivedAt: string): Response {
  const body: InquirySuccessResponse = { ok: true, id, receivedAt };
  return Response.json(body, { status: 201 });
}

function parseJson(raw: string): unknown {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
}

function isHoneypotFilled(body: unknown): boolean {
  if (typeof body !== 'object' || body === null) return false;
  const value = (body as Record<string, unknown>).website;
  return typeof value === 'string' && value.trim() !== '';
}

/** Auf Vercel setzt die Plattform `x-forwarded-for` selbst – der erste Eintrag ist der Besucher. */
function clientIp(request: Request): string {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unbekannt';
}

/** Gleitendes Fenster je IP: `null`, wenn die Anfrage durch darf, sonst die Wartezeit in Sekunden. */
function rateLimit(ip: string, now = Date.now()): number | null {
  const windowStart = now - RATE_LIMIT_WINDOW_MS;
  const hits = (recentByIp.get(ip) ?? []).filter((time) => time > windowStart);
  if (hits.length >= RATE_LIMIT_MAX) {
    recentByIp.set(ip, hits);
    return Math.ceil(((hits[0] ?? now) + RATE_LIMIT_WINDOW_MS - now) / 1000);
  }
  if (recentByIp.size > 10_000) recentByIp.clear();
  recentByIp.set(ip, [...hits, now]);
  return null;
}
