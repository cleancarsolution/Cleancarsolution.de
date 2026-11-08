import path from 'node:path';
import { z } from 'zod';
import { site } from '@ccs/shared';

const flag = z
  .enum(['true', 'false', '1', '0'])
  .transform((value) => value === 'true' || value === '1');

const list = z.string().transform((value) =>
  value
    .split(',')
    .map((entry) => entry.trim().replace(/\/+$/, ''))
    .filter(Boolean),
);

const EnvSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  HOST: z.string().default('0.0.0.0'),
  PORT: z.coerce.number().int().min(1).max(65_535).default(4000),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),

  /** Erlaubte Browser-Origins (kommagetrennt). In der Entwicklung zusätzlich jeder localhost-Port. */
  CORS_ORIGIN: list.default(['http://localhost:3000']),
  /** Hinter Reverse-Proxy/Load-Balancer auf `true` setzen (korrekte Client-IP für das Rate-Limit). */
  TRUST_PROXY: flag.default(false),

  /** Ablage der Anfragen (JSONL). Standard: ./data relativ zum Arbeitsverzeichnis (apps/api). */
  DATA_DIR: z.string().default(path.resolve(process.cwd(), 'data')),

  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(120),
  RATE_LIMIT_WINDOW: z.string().default('1 minute'),
  INQUIRY_RATE_LIMIT_MAX: z.coerce.number().int().positive().default(5),
  INQUIRY_RATE_LIMIT_WINDOW: z.string().default('10 minutes'),

  /** Ohne SMTP_HOST werden Benachrichtigungen nur protokolliert. */
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65_535).default(587),
  SMTP_SECURE: flag.default(false),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  MAIL_FROM: z.string().default(`Clean Car Solution Website <${site.email}>`),
  MAIL_TO: z.string().default(site.email),

  /** Salz für den IP-Hash (es wird nie die rohe IP gespeichert). In Produktion unbedingt setzen. */
  IP_HASH_SALT: z.string().min(8).default('ccs-development-salt'),
});

export type Env = z.output<typeof EnvSchema>;

export const DEFAULT_IP_HASH_SALT = 'ccs-development-salt';

/** Liest und validiert die Umgebung; leere Werte (`KEY=`) gelten als nicht gesetzt. */
export function loadEnv(source: Record<string, string | undefined> = process.env): Env {
  const cleaned = Object.fromEntries(Object.entries(source).filter(([, value]) => value !== undefined && value !== ''));
  const result = EnvSchema.safeParse(cleaned);
  if (!result.success) {
    const issues = result.error.issues.map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`).join('\n');
    throw new Error(`Ungültige Umgebungsvariablen:\n${issues}`);
  }
  return result.data;
}
