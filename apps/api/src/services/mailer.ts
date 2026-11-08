import nodemailer, { type Transporter } from 'nodemailer';
import type { FastifyBaseLogger } from 'fastify';
import { CONSULTATION_OPTION, getService, isServiceSlug, site } from '@ccs/shared';
import type { Env } from '../config/env';
import type { InquiryRecord } from './inquiry-store';

export interface Mailer {
  sendInquiryNotification(record: InquiryRecord): Promise<void>;
}

export function serviceLabel(value: string | undefined): string {
  if (!value) return 'Keine Angabe';
  if (value === CONSULTATION_OPTION) return 'Beratung / noch unsicher';
  return isServiceSlug(value) ? getService(value).name : value;
}

const preferredDateFormat = new Intl.DateTimeFormat('de-DE', { dateStyle: 'full', timeZone: 'UTC' });
const receivedFormat = new Intl.DateTimeFormat('de-DE', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Europe/Berlin' });

function formatPreferredDate(iso: string | undefined): string {
  return iso ? preferredDateFormat.format(new Date(`${iso}T00:00:00Z`)) : 'Keine Angabe';
}

const HTML_ESCAPES: Record<string, string> = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);

/** Betreff, Klartext und schlichtes HTML für die Benachrichtigung an den Betrieb. */
export function buildInquiryEmail(record: InquiryRecord) {
  const service = serviceLabel(record.service);
  const rows: Array<[string, string]> = [
    ['Name', record.name],
    ['E-Mail', record.email],
    ['Telefon', record.phone ?? '–'],
    ['Fahrzeug', record.vehicle ?? '–'],
    ['Leistung', service],
    ['Wunschtermin', formatPreferredDate(record.preferredDate)],
    ['Eingang', receivedFormat.format(new Date(record.receivedAt))],
    ['Anfrage-ID', record.id],
  ];
  const message = record.message ?? '–';

  const subject = `Neue Terminanfrage: ${service} – ${record.name}`;
  const text = [
    `Neue Terminanfrage über ${site.url}`,
    '',
    ...rows.map(([label, value]) => `${label}: ${value}`),
    '',
    'Nachricht:',
    message,
    '',
    `Antworten Sie direkt auf diese E-Mail, um ${record.name} zu erreichen.`,
  ].join('\n');

  const cells = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding:10px 0;border-bottom:1px solid #e8ecf4;width:140px;font-size:13px;color:#4a5272;vertical-align:top">${escapeHtml(label)}</td><td style="padding:10px 0;border-bottom:1px solid #e8ecf4;font-size:15px;color:#0a1033">${escapeHtml(value)}</td></tr>`,
    )
    .join('');

  const html = `<!doctype html>
<html lang="de"><body style="margin:0;background:#f3f5f9;font-family:Arial,Helvetica,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:16px;overflow:hidden">
<tr><td style="background:#010d61;padding:28px 32px">
<div style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:#84d0fa">Neue Terminanfrage</div>
<div style="margin-top:8px;font-size:22px;font-weight:bold;color:#ffffff">${escapeHtml(service)}</div>
</td></tr>
<tr><td style="padding:24px 32px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${cells}</table>
<div style="margin-top:24px;font-size:13px;color:#4a5272">Nachricht</div>
<div style="margin-top:8px;font-size:15px;line-height:1.6;color:#0a1033;white-space:pre-wrap">${escapeHtml(message)}</div>
</td></tr>
<tr><td style="padding:20px 32px;background:#f3f5f9;font-size:12px;color:#4a5272">Antworten Sie direkt auf diese E-Mail, um ${escapeHtml(record.name)} zu erreichen.</td></tr>
</table></td></tr></table>
</body></html>`;

  return { subject, text, html };
}

/** Versand über SMTP (nur aktiv, wenn SMTP_HOST gesetzt ist). */
export class SmtpMailer implements Mailer {
  private readonly transporter: Transporter;
  private readonly from: string;
  private readonly to: string;

  constructor(env: Env) {
    this.from = env.MAIL_FROM;
    this.to = env.MAIL_TO;
    this.transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: env.SMTP_PORT,
      secure: env.SMTP_SECURE,
      auth: env.SMTP_USER ? { user: env.SMTP_USER, pass: env.SMTP_PASS ?? '' } : undefined,
    });
  }

  async sendInquiryNotification(record: InquiryRecord): Promise<void> {
    const { subject, text, html } = buildInquiryEmail(record);
    await this.transporter.sendMail({
      from: this.from,
      to: this.to,
      replyTo: { name: record.name, address: record.email },
      subject,
      text,
      html,
    });
  }
}

/** Fallback ohne SMTP: nur protokollieren (ohne personenbezogene Daten). */
export class LogMailer implements Mailer {
  private readonly log: FastifyBaseLogger;

  constructor(log: FastifyBaseLogger) {
    this.log = log;
  }

  async sendInquiryNotification(record: InquiryRecord): Promise<void> {
    this.log.info(
      { inquiryId: record.id, service: record.service ?? null },
      'SMTP nicht konfiguriert – Benachrichtigung nur protokolliert',
    );
  }
}
