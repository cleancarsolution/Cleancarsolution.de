import type { ApiErrorCode, InquiryFieldErrors, InquiryInput, InquiryResponse } from '@ccs/shared';

/** Browser-Client für die Terminanfrage – Route Handler derselben Domain (`app/api/inquiries`, Versand per Resend). */
export const INQUIRY_ENDPOINT = '/api/inquiries';

/** Nach dieser Zeit wird eine Anfrage abgebrochen. */
export const API_TIMEOUT_MS = 10_000;

/** Warum eine Anfrage die API nicht (vollständig) erreicht hat. */
export type ApiRequestErrorKind = 'network' | 'timeout' | 'aborted';

const REQUEST_ERROR_MESSAGES: Record<ApiRequestErrorKind, string> = {
  network: 'Die API ist nicht erreichbar.',
  timeout: 'Die API hat nicht rechtzeitig geantwortet.',
  aborted: 'Die Anfrage wurde abgebrochen.',
};

/** Verbindungsfehler: offline, Server nicht erreichbar, Zeitüberschreitung oder Abbruch. */
export class ApiRequestError extends Error {
  readonly kind: ApiRequestErrorKind;

  constructor(kind: ApiRequestErrorKind, options?: { cause?: unknown }) {
    super(REQUEST_ERROR_MESSAGES[kind], options);
    this.name = 'ApiRequestError';
    this.kind = kind;
  }
}

export function isApiRequestError(error: unknown): error is ApiRequestError {
  return error instanceof ApiRequestError;
}

/** Antwort der API plus HTTP-Status und – bei 429 – die empfohlene Wartezeit in Sekunden. */
export type InquiryResult = InquiryResponse & { status: number; retryAfter?: number };

export interface RequestOptions {
  /** Externer Abbruch, z. B. beim Unmount. */
  signal?: AbortSignal;
  timeoutMs?: number;
}

/**
 * Sendet eine Terminanfrage: `POST /api/inquiries` (JSON).
 * - 201 → `{ ok: true, id, receivedAt }`
 * - 422 → `{ ok: false, error: 'validation_error', fieldErrors }`
 * - 429 → `{ ok: false, error: 'rate_limited' }` (auch wenn der Server einen fremden Fehler-Body liefert)
 * Verbindungsfehler & Zeitüberschreitung werfen einen `ApiRequestError`.
 */
export async function submitInquiry(input: InquiryInput, options: RequestOptions = {}): Promise<InquiryResult> {
  return withTimeout(options, async (signal) => {
    const response = await fetch(INQUIRY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(input),
      signal,
      mode: 'same-origin',
      credentials: 'omit',
      cache: 'no-store',
    });
    const body = await readJson(response);
    return normalizeInquiryResponse(response, body);
  });
}

/* ── Interna ─────────────────────────────────────────────────────────────── */

async function withTimeout<T>(
  { signal, timeoutMs = API_TIMEOUT_MS }: RequestOptions,
  run: (signal: AbortSignal) => Promise<T>,
): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const forwardAbort = () => controller.abort();

  if (signal?.aborted) controller.abort();
  else signal?.addEventListener('abort', forwardAbort, { once: true });

  try {
    return await run(controller.signal);
  } catch (error) {
    if (timedOut) throw new ApiRequestError('timeout', { cause: error });
    if (signal?.aborted) throw new ApiRequestError('aborted', { cause: error });
    throw new ApiRequestError('network', { cause: error });
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', forwardAbort);
  }
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return null;
  }
}

const API_ERROR_CODES = [
  'validation_error',
  'rate_limited',
  'bad_request',
  'not_found',
  'internal_error',
] as const satisfies readonly ApiErrorCode[];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isApiErrorCode(value: unknown): value is ApiErrorCode {
  return typeof value === 'string' && (API_ERROR_CODES as readonly string[]).includes(value);
}

function errorCodeFor(status: number, body: unknown): ApiErrorCode {
  if (isRecord(body) && isApiErrorCode(body.error)) return body.error;
  if (status === 422) return 'validation_error';
  if (status === 429) return 'rate_limited';
  if (status === 400) return 'bad_request';
  if (status === 404) return 'not_found';
  return 'internal_error';
}

/** Übernimmt nur wohlgeformte Feldfehler (`{ feld: string[] }`). */
function readFieldErrors(value: unknown): InquiryFieldErrors | undefined {
  if (!isRecord(value)) return undefined;
  const entries = Object.entries(value).flatMap(([field, messages]) => {
    if (!Array.isArray(messages)) return [];
    const texts = messages.filter((message): message is string => typeof message === 'string');
    return texts.length ? [[field, texts] as const] : [];
  });
  return entries.length ? (Object.fromEntries(entries) as InquiryFieldErrors) : undefined;
}

function readRetryAfter(response: Response): number | undefined {
  const header = response.headers.get('retry-after');
  if (!header) return undefined;
  const seconds = Number(header);
  if (Number.isFinite(seconds) && seconds >= 0) return Math.ceil(seconds);
  const date = Date.parse(header);
  return Number.isNaN(date) ? undefined : Math.max(0, Math.ceil((date - Date.now()) / 1000));
}

function normalizeInquiryResponse(response: Response, body: unknown): InquiryResult {
  const { status } = response;

  if (response.ok) {
    const record = isRecord(body) ? body : {};
    return {
      ok: true,
      id: typeof record.id === 'string' ? record.id : '',
      receivedAt: typeof record.receivedAt === 'string' ? record.receivedAt : new Date().toISOString(),
      status,
    };
  }

  const error = errorCodeFor(status, body);
  const record = isRecord(body) ? body : {};
  const fieldErrors = readFieldErrors(record.fieldErrors);
  const retryAfter = error === 'rate_limited' ? readRetryAfter(response) : undefined;

  return {
    ok: false,
    error,
    message: typeof record.message === 'string' ? record.message : `HTTP ${status}`,
    status,
    ...(fieldErrors ? { fieldErrors } : {}),
    ...(retryAfter !== undefined ? { retryAfter } : {}),
  };
}
