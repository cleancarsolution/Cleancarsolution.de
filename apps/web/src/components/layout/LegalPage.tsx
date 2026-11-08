import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';

/** Schlichtes Layout für Rechtstexte (Impressum, Datenschutz). Ohne Inhalt steht nur die Überschrift. */
export function LegalPage({ eyebrow, title, children }: { eyebrow: string; title: string; children?: ReactNode }) {
  return (
    <section className="pt-40 pb-32">
      <Container className="max-w-3xl">
        <Eyebrow sparkle>{eyebrow}</Eyebrow>
        <h1 className="mt-6 text-display-md font-medium">{title}</h1>
        {children ? <div className="mt-10 space-y-5 text-lead text-fg-muted">{children}</div> : null}
      </Container>
    </section>
  );
}
