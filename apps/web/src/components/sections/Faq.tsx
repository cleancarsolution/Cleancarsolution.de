import type { ReactNode } from 'react';
import { primaryPhone, site } from '@ccs/shared';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ArrowUpRight, Mail, Phone } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { RevealText } from '@/components/ui/RevealText';
import { faq } from '@/content/faq';
import { FaqAccordion } from './faq/FaqAccordion';

/** Strukturierte Daten (schema.org/FAQPage) – gleiche Inhalte wie das sichtbare Akkordeon. */
function FaqJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

function QuickLink({ href, icon, label, value }: { href: string; icon: ReactNode; label: string; value: string }) {
  return (
    <a
      href={href}
      className="group flex items-center gap-4 border-b border-line-paper py-4 focus-visible:outline-royal sm:gap-5"
    >
      <span
        aria-hidden
        className="grid size-11 shrink-0 place-items-center rounded-full bg-navy text-white transition-[background-color] duration-300 ease-out-quint group-hover:bg-royal"
      >
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-[0.8125rem] text-paper-muted">{label}</span>
        <span className="truncate text-lg font-medium tracking-[-0.01em] text-navy tabular transition-colors duration-300 group-hover:text-royal">
          {value}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden
        className="ml-auto size-4 shrink-0 text-paper-muted transition-[translate,color] duration-300 ease-out-quint group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-royal"
      />
    </a>
  );
}

/**
 * 07 — FAQ (helle Fläche). Links die Headline (auf Desktop sticky) mit direktem Draht,
 * rechts das Akkordeon. Die erste Frage ist geöffnet.
 */
export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="relative bg-paper py-24 text-paper-ink sm:py-32 lg:py-40">
      <Container>
        <div className="grid grid-cols-1 gap-y-14 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="lg:sticky lg:top-32">
              <Eyebrow index="07" tone="navy">
                {faq.eyebrow}
              </Eyebrow>
              <h2 id="faq-title" className="mt-6 text-display-lg font-medium text-balance text-navy">
                <RevealText text={faq.title} />
              </h2>
              <Reveal delay={0.1}>
                <p className="mt-6 max-w-md text-lead text-paper-muted lg:mt-8">{faq.lead}</p>
              </Reveal>

              <Reveal delay={0.18} className="mt-10 max-w-md lg:mt-14">
                <p className="text-eyebrow font-medium text-paper-muted uppercase font-expanded">
                  {faq.quickContact.title}
                </p>
                <div className="mt-3 border-t border-line-paper">
                  <QuickLink
                    href={primaryPhone.href}
                    icon={<Phone className="size-[1.125rem]" />}
                    label={faq.quickContact.phone}
                    value={primaryPhone.display}
                  />
                  <QuickLink
                    href={`mailto:${site.email}`}
                    icon={<Mail className="size-[1.125rem]" />}
                    label={faq.quickContact.email}
                    value={site.email}
                  />
                </div>
              </Reveal>
            </div>
          </div>

          <div className="lg:col-span-7 lg:col-start-6">
            <Reveal y={36} amount={0.1}>
              <FaqAccordion items={faq.items} defaultOpen={0} />
            </Reveal>
          </div>
        </div>
      </Container>
      <FaqJsonLd />
    </section>
  );
}
