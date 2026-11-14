import Image from 'next/image';
import { offer } from '@/content/offer';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Check } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { RevealText } from '@/components/ui/RevealText';
import { TwoTone } from '@/components/ui/TwoTone';
import { cn } from '@/lib/cn';
import { LacquerPanel } from './offer/LacquerPanel';
import { ProductBanner } from './offer/ProductBanner';
import { ProductSlider } from './offer/ProductSlider';
import { QuoteList } from './offer/QuoteList';
import { ServiceRequestLink } from './offer/ServiceRequestLink';
import { StudioPrice } from './offer/StudioPrice';
import styles from './offer/studio.module.css';

/** „Faire Preise. Kompromisslose Qualität.“ → zwei Sätze, zweiter Satz im zweiten Ton. */
function sentences(text: string): string[] {
  return text.split(/(?<=\.)\s+/).filter(Boolean);
}

/**
 * 04 — PREISE (schwarz). Idee: „Studiolicht“.
 * Das Angebot ist ein Paneel aus schwarzem Lack im Nachtstudio. Scrollt es ins Bild, flackert ein Scheinwerfer
 * auf – sein Lichtkegel mit feinem Nebel fällt schräg auf die „89“, die Chrom-Ziffern fangen das Licht, ein
 * Glanzlicht legt sich darauf, am Boden liegt ein Lichtfleck und der Preis spiegelt sich darin.
 * Mit der Maus schwenkt der Kegel mit, das Glanzlicht folgt dem Blickwinkel. Darunter die übrigen Leistungen als
 * ruhige Preisliste, zum Schluss die Produkte im Slider und der Platz für die eigenen Produkte (`ProductBanner`).
 * Signalrot trägt nur das Angebots-Badge.
 */
export function Offer() {
  const [first, ...rest] = sentences(offer.title);

  return (
    <section
      id="preise"
      aria-labelledby="preise-title"
      className="relative isolate overflow-x-clip bg-ink-950 py-24 sm:py-32 lg:py-40"
    >
      <Container>
        <header className="grid grid-cols-12 gap-x-5 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow index="04">{offer.eyebrow}</Eyebrow>
            <h2 id="preise-title" className="mt-6 text-display-lg font-medium text-balance">
              <RevealText text={first ?? offer.title} />
              {rest.length ? (
                <>
                  {' '}
                  <RevealText text={rest.join(' ')} wordClassName="text-sky-300/75" delay={0.14} />
                </>
              ) : null}
            </h2>
          </div>
          <Reveal className="col-span-12 mt-8 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:self-end" delay={0.2}>
            <p className="max-w-[46ch] text-lead text-fg-muted">{offer.lead}</p>
          </Reveal>
        </header>

        <Reveal className="mt-16 lg:mt-24" y={40} amount={0.15}>
          <FeaturedOffer />
        </Reveal>

        <QuoteList className="mt-24 sm:mt-28 lg:mt-36" />

        <Reveal className="mt-20 lg:mt-28" y={32} amount={0.2}>
          <Products />
        </Reveal>
        <ProductBanner />
      </Container>
    </section>
  );
}

/* ── Die Produkte: Slider ─────────────────────────────────────────────────── */

/** ~1,6 Kacheln auf dem Smartphone, ~2,6 ab sm, ~3,6 ab lg, ~4,2 ab xl – die angeschnittene nächste zeigt, dass es weitergeht. */
const PRODUCT_SLIDE = 'w-[62%] sm:w-[38%] lg:w-[28%] xl:w-[24%]';
/** Breite der Bildfläche (76 % der Kachel) – danach wählt der Browser die Bildgröße. */
const PRODUCT_SIZES = '(min-width: 1440px) 250px, (min-width: 1280px) 18vw, (min-width: 1024px) 22vw, (min-width: 640px) 29vw, 47vw';

/**
 * „Wir arbeiten mit hochqualitativen Produkten“: alle Produkte gleich groß im Slider. Jede Kachel (4 : 5) ist ein
 * kleines Studio – Licht von oben, das Produkt steht auf der Bodenlinie und spiegelt sich im glänzenden Boden.
 */
function Products() {
  const p = offer.products;

  return (
    <div className="border-t border-line pt-8 lg:pt-10">
      <h3 id="preise-produkte-title" className="text-display-sm font-medium text-balance">
        {p.title}
      </h3>
      <div className="mt-8 lg:mt-10">
        <ProductSlider labelledBy="preise-produkte-title" controls={p.controls}>
          {p.items.map((item, i) => (
            <li key={item.src} className={cn('shrink-0 snap-start bg-ink-950', PRODUCT_SLIDE)}>
              <div className="relative isolate aspect-[4/5] overflow-hidden">
                {/* Studiolicht von oben, Lichtfleck und Kante des Bodens, feines Korn */}
                <span aria-hidden className="absolute inset-0 -z-10 bg-[radial-gradient(80%_62%_at_50%_0%,rgb(132_208_250/0.11),transparent_72%)]" />
                <span aria-hidden className="absolute inset-x-0 top-[80%] bottom-0 -z-10 bg-[linear-gradient(180deg,rgb(255_255_255/0.035),transparent)]" />
                <span aria-hidden className="absolute inset-x-[16%] top-[73%] -z-10 h-[14%] bg-[radial-gradient(closest-side,rgb(132_208_250/0.16),transparent)]" />
                <span aria-hidden className="absolute inset-x-[8%] top-[80%] -z-10 h-px bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.14),transparent)]" />
                <span aria-hidden className="absolute inset-0 -z-10 bg-grain opacity-[0.05]" />

                <span aria-hidden className="absolute top-4 left-5 font-mono text-[0.6875rem] text-fg-subtle tabular">
                  {String(i + 1).padStart(2, '0')}
                </span>

                <div className="absolute inset-x-[12%] top-[12%] bottom-[20%]">
                  <Image src={item.src} alt={item.alt} fill sizes={PRODUCT_SIZES} quality={80} className="object-contain object-bottom" />
                </div>
                {/* Spiegelung im glänzenden Boden – dasselbe Bild, gespiegelt und nach unten ausgeblendet */}
                <div aria-hidden className="absolute inset-x-[12%] top-[80%] h-[68%] [mask-image:linear-gradient(180deg,rgb(0_0_0/0.3),transparent_26%)]">
                  <div className="absolute inset-0 -scale-y-100">
                    <Image src={item.src} alt="" fill sizes={PRODUCT_SIZES} quality={80} className="object-contain object-bottom" />
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ProductSlider>
      </div>
    </div>
  );
}

/* ── Das Angebot: Lackpaneel ──────────────────────────────────────────────── */

function FeaturedOffer() {
  const f = offer.featured;

  return (
    <LacquerPanel labelledBy="preise-angebot-title" className="grid border border-white/10 lg:grid-cols-12">
      {/* Oberkante fängt das Deckenlicht, kaltes Raumlicht fällt von oben ein */}
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.38)_22%,rgb(255_255_255/0.12)_62%,transparent)]',
          styles.ambient,
        )}
      />
      <span
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_55%_at_30%_0%,rgb(132_208_250/0.09),transparent_72%)]',
          styles.ambient,
        )}
      />

      {/* Bühne: Name, Badge, Preis im Scheinwerferlicht (StudioPrice) */}
      <div className="relative flex flex-col p-6 sm:p-10 lg:col-span-7 xl:p-14">
        {/* Zum Boden hin liegt der Lack im Schatten – die Beschreibung steht ruhig, ohne Licht dahinter */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[38%] bg-[linear-gradient(0deg,var(--color-ink-950)_22%,rgb(3_5_15/0.72)_58%,transparent)]"
        />

        {/* Mobil steht das Badge über dem Namen – so bricht „Innen & Außen“ nicht um */}
        <header className="flex flex-col-reverse items-start gap-4 sm:flex-row sm:justify-between sm:gap-6">
          <h3 id="preise-angebot-title">
            <span className="sr-only">{f.name}</span>
            <span aria-hidden>
              <TwoTone top={f.banner.top} bottom={f.banner.bottom} size="md" />
            </span>
          </h3>
          <span className="inline-flex shrink-0 items-center rounded-full bg-signal py-1.5 pr-2.5 pl-3 text-[0.6875rem] leading-none font-semibold tracking-[0.18em] text-white uppercase font-expanded">
            {f.badge}
          </span>
        </header>

        <StudioPrice prefix={f.prefix} price={f.price} className="mt-16 sm:mt-20 lg:mt-24" />

        <p className="mt-auto max-w-[44ch] pt-6 text-[1.0625rem] leading-relaxed text-pretty text-fg-muted">{f.description}</p>
      </div>

      {/* Datenblatt: Leistungsumfang, Termin */}
      <div className="relative flex flex-col border-t border-white/10 bg-ink-950/85 p-6 sm:p-10 lg:col-span-5 lg:border-t-0 lg:border-l xl:p-14">
        <p className="flex items-center justify-between gap-4 text-eyebrow font-medium text-fg-subtle uppercase font-expanded">
          {f.includesTitle}
          <span className="font-mono tracking-normal text-sky-400 tabular">{String(f.includes.length).padStart(2, '0')}</span>
        </p>
        <ol className="mt-6 border-t border-white/10">
          {f.includes.map((item, i) => (
            <li key={item} className="flex items-center gap-4 border-b border-white/10 py-4 text-[0.9375rem] leading-snug text-fg/90">
              <span className="w-6 shrink-0 font-mono text-[0.6875rem] text-fg-subtle tabular">{String(i + 1).padStart(2, '0')}</span>
              <span className="flex-1">{item}</span>
              <Check aria-hidden className="size-4 shrink-0 text-sky-400" />
            </li>
          ))}
        </ol>

        <div className="mt-auto flex flex-col gap-5 pt-10">
          <ServiceRequestLink service={f.service} variant="white" size="lg" className="w-full">
            {f.cta}
          </ServiceRequestLink>
          <p className="text-sm leading-relaxed text-fg-subtle">{f.note}</p>
        </div>
      </div>
    </LacquerPanel>
  );
}
