import { primaryPhone } from '@ccs/shared';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Phone } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { RevealText } from '@/components/ui/RevealText';
import { howItWorks } from '@/content/process';
import { Timeline } from './process/Timeline';

/**
 * 06 — ABLAUF. Vier Schritte auf einer Linie, die sich beim Scrollen von Sky nach Royal füllt;
 * erreichte Stationen leuchten auf. Abschluss: direkter Einstieg in Schritt 01.
 */
export function Process() {
  return (
    <section id="ablauf" aria-labelledby="ablauf-title" className="relative bg-ink-900 py-24 sm:py-32 lg:py-40">
      <Container>
        <header className="max-w-4xl">
          <Eyebrow index="06">{howItWorks.eyebrow}</Eyebrow>
          <h2 id="ablauf-title" className="mt-6 text-display-lg font-medium text-balance">
            <RevealText text={howItWorks.title} />
          </h2>
        </header>

        <Timeline steps={howItWorks.steps} className="mt-16 lg:mt-24" />

        <Reveal className="mt-20 lg:mt-28" amount={0.5}>
          <div className="flex flex-col gap-8 border-t border-line pt-10 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-display-sm font-medium">{howItWorks.closing.text}</p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
              <ButtonLink href={howItWorks.closing.cta.href} size="lg" arrow className="w-full sm:w-auto">
                {howItWorks.closing.cta.label}
              </ButtonLink>
              <a href={primaryPhone.href} className="group inline-flex items-center gap-3 text-fg-muted transition-colors hover:text-fg">
                <span aria-hidden className="grid size-11 place-items-center rounded-full border border-line-strong transition-colors group-hover:border-sky/60">
                  <Phone className="size-[1.125rem]" />
                </span>
                <span className="flex flex-col leading-tight">
                  <span className="text-xs text-fg-subtle">{howItWorks.closing.phoneLabel}</span>
                  <span className="font-medium text-fg tabular">{primaryPhone.display}</span>
                </span>
              </a>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
