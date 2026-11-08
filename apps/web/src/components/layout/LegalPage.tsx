import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { cn } from '@/lib/cn';

/**
 * Schlichtes Layout für Rechtstexte (Impressum, Datenschutz). Ohne Inhalt steht nur die Überschrift.
 * Die Texte bleiben reines HTML (h2, h3, p, ul, a) – Fließtext, Zwischenüberschriften und Links gestaltet das Layout.
 */
export function LegalPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children?: ReactNode;
}) {
  return (
    <section className="pt-40 pb-32">
      <Container className="max-w-3xl">
        <Eyebrow sparkle>{eyebrow}</Eyebrow>
        <h1 className="mt-6 text-display-md font-medium hyphens-auto">{title}</h1>
        {children ? (
          <div
            className={cn(
              'mt-10 space-y-5 text-[1.0625rem] leading-relaxed text-pretty text-fg-muted',
              '[&_h2]:pt-8 [&_h2]:text-display-sm [&_h2]:font-medium [&_h2]:text-balance [&_h2]:text-fg',
              '[&_h3]:pt-3 [&_h3]:font-medium [&_h3]:text-fg [&_strong]:font-medium [&_strong]:text-fg',
              '[&_li]:marker:text-fg-subtle [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5',
              '[&_a]:break-words [&_a]:text-fg [&_a]:underline [&_a]:decoration-white/30 [&_a]:underline-offset-4 [&_a]:transition-colors [&_a]:hover:decoration-sky',
            )}
          >
            {children}
          </div>
        ) : null}
      </Container>
    </section>
  );
}
