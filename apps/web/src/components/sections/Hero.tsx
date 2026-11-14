import { formatAddress, site } from '@ccs/shared';
import { NOT_PHONE_QUERY, PHONE_QUERY, VideoPoster } from '@/components/media/VideoPoster';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { MapPin } from '@/components/ui/icons';
import { Sparkle } from '@/components/ui/Sparkle';
import { hero } from '@/content/hero';
import { Drift, ScrollDim } from './hero/Drift';
import { HeroCopy } from './hero/HeroCopy';
import { HeroHeadline } from './hero/HeroHeadline';
import { HeroMedia } from './hero/HeroMedia';
import { HeroStage } from './hero/HeroStage';
import { PriceBadge } from './hero/PriceBadge';
import { Rise, Spin } from './hero/Rise';
import { ScrollCue } from './hero/ScrollCue';
import { VideoToggle } from './hero/VideoToggle';

/** Leicht rechts der Mitte: links steht die Headline, der Ausschnitt rückt das Motiv (Porsche, Hände, Maschine) nach rechts. */
const OBJECT_POSITION = '64% 50%';

/**
 * HERO (#top) – der Auftritt.
 * Idee: Nachtstudio. Der Banner-Film (Porsche im Nebel mit eingeblendeten Produkten, Schaum, Abspülen, Mikrofaser,
 * Politur) trägt die Bühne;
 * davor eine ruhige, asymmetrische Typo-Komposition und – als einziges Rot – die rotierende Preis-Plakette
 * aus dem Banner („ab 89 €“). Solange die Produkte im Film zu sehen sind, steht statt des Hero-Texts die
 * Produktzeile („Wir arbeiten mit professionellen Produkten“, `HeroCopy`).
 * Beim Herausscrollen driftet der Inhalt nach oben, das Bild taucht ins Dunkel.
 * Smartphone (< 640 px): Handwäsche-Film statt Banner-Film, kurz und knapp – Eyebrow in einer Zeile,
 * Headline in zwei Zeilen, ohne Lead.
 */
export function Hero() {
  return (
    <HeroStage
      id="top"
      labelledBy="hero-title"
      className="relative isolate flex min-h-svh flex-col overflow-hidden bg-ink-950 lg:min-h-[max(100svh,40rem)]"
    >
      <HeroMedia
        picture={
          // Erste Farbe ohne Warten: Poster (= erster Video-Frame) bzw. Standbild bei „Bewegung reduzieren“ –
          // je Gerät lädt nur eines der beiden Bilder
          <>
            <VideoPoster
              alt={hero.video.phone.alt}
              sizes="100vw"
              priority
              poster={hero.video.phone.poster}
              still={hero.video.phone.still}
              skipOn={NOT_PHONE_QUERY}
              className="sm:hidden"
            />
            <VideoPoster
              alt={hero.video.alt}
              sizes="100vw"
              priority
              poster={hero.video.poster}
              posterPortrait={hero.video.posterPortrait}
              still={hero.video.still}
              stillPortrait={hero.video.stillPortrait}
              skipOn={PHONE_QUERY}
              className="object-(--hero-object) max-sm:hidden"
            />
          </>
        }
        sources={{ ...hero.video.sources, phone: hero.video.phone.src }}
        objectPosition={OBJECT_POSITION}
      />

      {/* Lesbarkeit: Verläufe aus Ink (Header oben, Text links & unten), Vignette, feines Korn */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(180deg,rgb(3_5_15/0.6),transparent)]" />
        <div className="absolute inset-y-0 left-0 w-full bg-[linear-gradient(90deg,rgb(3_5_15/0.78)_0%,rgb(3_5_15/0.46)_34%,rgb(3_5_15/0.08)_62%,transparent_78%)]" />
        <div className="absolute inset-x-0 bottom-0 h-[68%] bg-[linear-gradient(0deg,var(--color-ink-950)_0%,rgb(3_5_15/0.82)_26%,rgb(3_5_15/0.38)_58%,transparent_100%)]" />
        {/* Hochformat: Text steht direkt über dem Motiv (Mitarbeiter, Logo) – dort kräftiger abdunkeln */}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgb(3_5_15/0.55)_0%,rgb(3_5_15/0.5)_48%,rgb(3_5_15/0.44)_62%,rgb(3_5_15/0.16)_80%,transparent_92%)] sm:hidden" />
        <div className="absolute inset-0 bg-[radial-gradient(130%_100%_at_64%_36%,transparent_52%,rgb(3_5_15/0.5)_100%)]" />
        <div className="absolute inset-0 bg-grain opacity-[0.06]" />
        <ScrollDim className="absolute inset-0 bg-ink-950" />
      </div>

      {/* Oben bleibt immer Platz für Header + Plakette (wächst auf kurzen Screens statt zu überlappen) */}
      <Drift className="relative mt-auto pt-[12.5rem] sm:pt-[16rem] xl:pt-[18rem]" distance={150} fadeOutAt={0.6}>
        <Container>
          {/* Während der Produktszene des Films steht hier statt des Hero-Texts die Produktzeile */}
          <HeroCopy
            scene={hero.video.productScene}
            films={Object.values(hero.video.sources)}
            line={hero.productLine}
            className="relative grid grid-cols-12 items-end gap-x-5 lg:gap-x-8"
          >
            <Spin
              delay={1.05}
              className="absolute right-0 bottom-full mb-7 w-[5.75rem] sm:mb-10 sm:w-32 xl:mb-14 xl:w-[9.25rem]"
            >
              <PriceBadge
                label={hero.offer.label}
                prefix={hero.offer.prefix}
                price={hero.offer.price}
                href={hero.offer.href}
              />
            </Spin>

            <h1 id="hero-title" className="col-span-12 xl:col-span-8">
              <Rise
                as="span"
                delay={0.35}
                y={10}
                className="flex items-start gap-3 text-eyebrow leading-[1.6] font-medium text-sky-300 uppercase [text-shadow:0_0_2px_rgb(3_5_15/0.7),0_1px_18px_rgb(3_5_15/0.95)] font-expanded sm:items-center sm:leading-none"
              >
                <Sparkle className="mt-[0.3rem] size-2.5 shrink-0 text-sky-400 sm:mt-0" />
                <span>
                  <span className="sm:hidden">{hero.eyebrowShort}</span>
                  <span className="max-sm:hidden">{hero.eyebrow}</span>
                </span>
              </Rise>
              <HeroHeadline
                lines={hero.headline}
                accent={hero.accent}
                delay={0.5}
                className="mt-5 text-[clamp(2.1rem,9.9vw,2.9rem)] leading-[0.98] font-medium tracking-[-0.045em] text-fg sm:mt-7 sm:text-[clamp(4rem,9vw,6rem)] sm:leading-[0.92] xl:text-[min(6.7vw,6rem)]"
              />
            </h1>

            <div className="col-span-12 mt-7 sm:mt-9 lg:grid lg:grid-cols-2 lg:items-end lg:gap-8 xl:col-span-4 xl:mt-0 xl:block">
              <Rise delay={0.9} className="max-sm:hidden">
                <p className="max-w-[38ch] text-base leading-relaxed text-fg-muted [text-shadow:0_1px_16px_rgb(3_5_15/0.8)] sm:text-lg xl:max-w-none">{hero.lead}</p>
              </Rise>
              <Rise
                delay={1}
                className="flex flex-col gap-3 sm:mt-7 sm:flex-row lg:mt-0 lg:justify-end xl:mt-8 xl:justify-start"
              >
                <ButtonLink
                  href={hero.primaryCta.href}
                  variant="white"
                  size="lg"
                  arrow
                  className="h-[3.25rem] w-full px-6 text-[0.9375rem] sm:h-14 sm:w-auto xl:px-5 xl:text-sm min-[1400px]:px-6 min-[1400px]:text-[0.9375rem]"
                >
                  {hero.primaryCta.label}
                </ButtonLink>
                <ButtonLink
                  href={hero.secondaryCta.href}
                  variant="secondary"
                  size="lg"
                  className="h-[3.25rem] w-full px-6 text-[0.9375rem] sm:h-14 sm:w-auto xl:px-5 xl:text-sm min-[1400px]:px-6 min-[1400px]:text-[0.9375rem]"
                >
                  {hero.secondaryCta.label}
                </ButtonLink>
              </Rise>
            </div>
          </HeroCopy>
        </Container>
      </Drift>

      <Rise delay={1.3} y={0} className="relative">
        <Drift distance={40} fadeOutAt={0.5}>
          <Container>
            <div className="mt-9 grid h-16 grid-cols-12 items-center gap-x-5 border-t border-line sm:mt-12 lg:h-[4.5rem] lg:gap-x-8">
              <p className="col-span-9 flex min-w-0 items-center gap-2.5 text-[0.8125rem] text-fg-muted sm:col-span-5 xl:col-span-4">
                <MapPin aria-hidden className="size-4 shrink-0 text-sky-400" />
                <span className="truncate">
                  <span className="sm:hidden">
                    {site.address.street} · {site.address.city}
                  </span>
                  <span className="hidden sm:inline">{formatAddress()}</span>
                </span>
              </p>
              <ScrollCue
                label={hero.scrollCue.label}
                srLabel={hero.scrollCue.srLabel}
                href={hero.scrollCue.href}
                className="hidden sm:col-span-4 sm:inline-flex xl:col-span-4"
              />
              <p className="hidden text-eyebrow font-medium whitespace-nowrap text-fg-subtle uppercase font-expanded xl:col-span-3 xl:block">
                {site.tagline}
              </p>
              <div className="col-span-3 flex justify-end xl:col-span-1">
                <VideoToggle pauseLabel={hero.video.pauseLabel} playLabel={hero.video.playLabel} />
              </div>
            </div>
          </Container>
        </Drift>
      </Rise>
    </HeroStage>
  );
}
