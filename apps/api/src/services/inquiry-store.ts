import { appendFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import type { Inquiry } from '@ccs/shared';

/** Gespeicherte Anfrage – ohne Honeypot, mit Metadaten. Die IP wird nur als gesalzener Hash abgelegt. */
export type InquiryRecord = Omit<Inquiry, 'website'> & {
  id: string;
  receivedAt: string;
  ipHash: string;
  userAgent?: string;
};

export interface InquiryStore {
  save(record: InquiryRecord): Promise<void>;
}

/**
 * Anfragen zeilenweise als JSON (JSONL) – robust, ohne Datenbank, leicht zu sichern/auszuwerten.
 * Schreibvorgänge werden serialisiert, damit sich parallele Anfragen nie überlagern.
 */
export class JsonlInquiryStore implements InquiryStore {
  readonly file: string;
  private queue: Promise<void> = Promise.resolve();
  private ready: Promise<unknown> | null = null;

  constructor(dataDir: string) {
    this.file = path.join(dataDir, 'inquiries.jsonl');
  }

  save(record: InquiryRecord): Promise<void> {
    this.ready ??= mkdir(path.dirname(this.file), { recursive: true });
    const write = this.queue.then(async () => {
      await this.ready;
      await appendFile(this.file, `${JSON.stringify(record)}\n`, { encoding: 'utf8', mode: 0o600 });
    });
    // Fehler einer Schreiboperation dürfen die Warteschlange nicht blockieren
    this.queue = write.catch(() => undefined);
    return write;
  }
}
