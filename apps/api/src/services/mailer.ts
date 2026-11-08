import nodemailer, { type Transporter } from 'nodemailer';
import type { FastifyBaseLogger } from 'fastify';
import { buildInquiryEmail } from '@ccs/shared';
import type { Env } from '../config/env';
import type { InquiryRecord } from './inquiry-store';

export interface Mailer {
  sendInquiryNotification(record: InquiryRecord): Promise<void>;
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
