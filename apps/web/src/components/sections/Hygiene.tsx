import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Leaf, Shield, Steam } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { RevealText } from '@/components/ui/RevealText';
import { TwoTone } from '@/components/ui/TwoTone';
import { hygiene } from '@/content/hygiene';
import { ServiceRequestLink } from './offer/ServiceRequestLink';
import { ClearView } from './hygiene/ClearView';

const ICONS: Record<(typeof hygiene.benefits)[number]['icon'], ReactNode> = {
  leaf: <Leaf className="size-[1.125rem]" />,
  steam: <Steam className="size-[1.125rem]" />,
  shield: <Shield className="size-[1.125rem]" />,
};

/** Dampfschwaden in der Navy-Karte: Position, Größe, Verzögerung (s). */
const WISPS = [
  { left: '8%', size: '70%', delay: 0 },
  { left: '42%', size: '58%', delay: 2.7 },
  { left: '64%', size: '64%', delay: 5.3 },
];

/**
 * 03 — HYGIENE (helle Fläche). Kontrapunkt zur Nacht: hell, klar, frisch.
 * Idee: „Klarsicht“ – das Trockendampf-Video liegt links hinter Milchglas, rechts klar;
 * beim Hineinscrollen wischt die Trennlinie das Glas frei wie ein Abzieher, danach lässt sie sich ziehen.
 * Die Navy-Karte („Hygiene / Trockendampf“) greift über das Video und erklärt die Wirkung.
 */
export function Hygiene() {
  const [quiet, statement] = hygiene.titleLines;
  const accent = hygiene.titleAccent;
  const rest = statement?.slice(accent.length).trim() ?? '';

  return (
    <section
      id="hygiene"
      aria-labelledby="hygiene-title"
      className="relative isolate overflow-hidden bg-paper py-24 text-paper-ink sm:py-32 lg:py-40"
    >
      {/* Frische: kühles Licht von oben rechts, als stiege Dampf auf; feine Rasterlinien wie Fliesen im Studio */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-[20%] -right-[10%] -z-10 h-[70%] w-[60%] bg-[radial-gradient(closest-side,rgb(38_171_246/0.16),rgb(38_171_246/0.05)_55%,transparent)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[55%] bg-[linear-gradient(90deg,rgb(1_13_97/0.05)_1px,transparent_1px),linear-gradient(180deg,rgb(1_13_97/0.05)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(180deg,transparent,#000_45%,transparent)]"
      />

      <Container>
        <header className="grid grid-cols-12 gap-x-5 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow index="03" tone="navy">
              {hygiene.eyebrow}
            </Eyebrow>
            <h2 id="hygiene-title" className="mt-6 text-display-lg font-medium text-balance text-navy">
              <span className="block">
                {/* zurückgenommen, aber ≥ 3 : 1 (große Schrift) */}
                <RevealText text={quiet ?? ''} wordClassName="text-paper-muted/75" />
              </span>
              <span className="block">
                <RevealText
                  text={accent}
                  delay={0.12}
                  wordClassName="-mb-[0.1em] bg-[linear-gradient(100deg,var(--color-navy)_0%,var(--color-royal)_55%,var(--color-sky)_100%)] bg-clip-text pr-[0.04em] pb-[0.1em] text-transparent"
                />{' '}
                <RevealText text={rest} delay={0.19} />
              </span>
            </h2>
          </div>
          <Reveal className="col-span-12 mt-8 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:self-end" delay={0.2}>
            <p className="max-w-[40ch] text-lead font-medium text-navy">{hygiene.lead}</p>
            <p className="mt-5 max-w-[46ch] leading-relaxed text-paper-muted">{hygiene.text}</p>
          </Reveal>
        </header>

        <div className="mt-16 grid lg:mt-24 lg:grid-cols-12 lg:gap-x-8">
          <Reveal y={40} amount={0.15} className="lg:col-span-8 lg:col-start-1 lg:row-start-1">
            <ClearView labels={hygiene.compare} className="aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/11]" />
            {/* erst ab lg – darunter greift die Karte unter das Video */}
            <p className="mt-4 hidden items-center gap-3 text-sm text-paper-muted lg:flex">
              <span aria-hidden className="flex items-center gap-1 text-royal">
                <span className="h-px w-5 bg-current" />
                <span className="size-1.5 rounded-full border border-current" />
                <span className="h-px w-5 bg-current" />
              </span>
              {hygiene.compare.hint}
            </p>
          </Reveal>

          <Reveal
            y={48}
            amount={0.3}
            delay={0.15}
            className="relative z-10 mx-4 -mt-10 sm:mx-10 sm:-mt-16 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:mx-0 lg:mt-0 lg:-mb-16 lg:self-end"
          >
            <BenefitsCard />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

/** Navy-Karte mit Banner-Zweizeiler, den drei Vorteilen des Trockendampfs und dem direkten Weg zur Anfrage. */
function BenefitsCard() {
  return (
    <div className="relative isolate overflow-hidden bg-[linear-gradient(200deg,var(--color-navy-700)_0%,var(--color-navy-900)_55%,var(--color-navy-950)_100%)] p-7 text-fg shadow-[0_50px_100px_-40px_rgb(1_13_97/0.7)] sm:p-10">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px hairline-wave" />
      <span
        aria-hidden
        className="pointer-events-none absolute -top-1/3 -right-1/4 -z-10 size-[22rem] rounded-full bg-[radial-gradient(closest-side,rgb(38_171_246/0.24),rgb(0_72_206/0.08)_55%,transparent)]"
      />
      {/* Trockendampf steigt leise auf */}
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 mix-blend-screen motion-reduce:hidden">
        {WISPS.map((wisp) => (
          <span
            key={wisp.left}
            className="absolute bottom-0 aspect-square animate-steam rounded-full bg-[radial-gradient(closest-side,rgb(184_228_252/0.16),rgb(184_228_252/0.04)_60%,transparent)] blur-2xl"
            style={{ left: wisp.left, width: wisp.size, animationDelay: `${wisp.delay}s` }}
          />
        ))}
      </span>
      <span aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-[0.07] mix-blend-overlay" />

      <div className="flex items-start justify-between gap-6">
        <TwoTone top={hygiene.badge.title} bottom={hygiene.badge.text} size="md" as="p" />
        <span aria-hidden className="mt-1 grid size-11 shrink-0 place-items-center rounded-full border border-white/15 text-sky-300">
          <Steam className="size-5" />
        </span>
      </div>

      <ol className="mt-8 border-t border-white/10">
        {hygiene.benefits.map((benefit, i) => (
          <li key={benefit.title} className="grid grid-cols-[2.25rem_1fr] gap-x-3 border-b border-white/10 py-5">
            <span className="pt-0.5 font-mono text-xs text-sky-400 tabular">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h3 className="flex items-center gap-2.5 font-medium text-fg">
                <span aria-hidden className="text-sky-300">
                  {ICONS[benefit.icon]}
                </span>
                {benefit.title}
              </h3>
              <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-fg-muted">{benefit.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <ServiceRequestLink service={hygiene.cta.service} variant="white" size="md" className="mt-8 w-full sm:w-auto">
        {hygiene.cta.label}
      </ServiceRequestLink>
    </div>
  );
}
