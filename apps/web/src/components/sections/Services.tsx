import Image from 'next/image';
import { formatEuro, services, type Service } from '@ccs/shared';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { RevealText } from '@/components/ui/RevealText';
import { Sparkle } from '@/components/ui/Sparkle';
import { TwoTone } from '@/components/ui/TwoTone';
import { serviceFilms } from '@/content/media';
import { servicesSection } from '@/content/services-section';
import { ServiceRequestLink } from './offer/ServiceRequestLink';
import { ServiceFilmCard } from './services/ServiceFilmCard';
import { ServicePlaceholder } from './services/ServicePlaceholder';
import { ServicesStage } from './services/ServicesStage';

/**
 * 02 — LEISTUNGEN. Desktop: Sticky-Scrollytelling – links ein Bildrahmen, der beim Scrollen per
 * Wisch-Maske zur aktiven Leistung wechselt, rechts die sechs Leistungen im Banner-Zweizeiler.
 * Mobile: gestapelte Karten mit eigenem Bild. Ohne Foto zeigt der Rahmen einen Platzhalter;
 * hat die Leistung einen eigenen Film (`serviceFilms`), läuft er an Stelle des Fotos.
 * Jede Leistung ist Sprungziel (#<slug>) für das Header-Dropdown.
 */
export function Services() {
  const [first, ...rest] = servicesSection.title.split(/(?<=\.)\s+/);

  return (
    <section id="leistungen" aria-labelledby="leistungen-title" className="relative bg-ink-900 py-24 sm:py-32 lg:py-40">
      <Container>
        <header className="grid grid-cols-12 gap-x-5 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow index="02">{servicesSection.eyebrow}</Eyebrow>
            <h2 id="leistungen-title" className="mt-6 text-display-lg font-medium text-balance">
              <RevealText text={first ?? servicesSection.title} />
              {rest.length ? (
                <>
                  {' '}
                  <RevealText text={rest.join(' ')} wordClassName="text-sky-300/75" delay={0.14} />
                </>
              ) : null}
            </h2>
          </div>
          <Reveal className="col-span-12 mt-8 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:self-end" delay={0.2}>
            <p className="max-w-[46ch] text-lead text-fg-muted">{servicesSection.lead}</p>
          </Reveal>
        </header>

        <ServicesStage
          className="mt-16 lg:mt-24"
          placeholder={<ServicePlaceholder />}
          slides={services.map(({ slug, eyebrow, title, image }) => ({
            slug,
            eyebrow,
            title,
            image,
            film: serviceFilms[slug],
          }))}
        >
          {services.map((service, i) => (
            <ServiceBlock key={service.slug} service={service} active={i === 0} />
          ))}
        </ServicesStage>
      </Container>
    </section>
  );
}

function ServiceBlock({ service, active }: { service: Service; active: boolean }) {
  const film = serviceFilms[service.slug];

  return (
    <li
      id={service.slug}
      data-service-block
      data-active={active}
      aria-labelledby={`${service.slug}-title`}
      className="group/block relative border-t border-line py-14 first:border-t-0 first:pt-0 sm:py-16 lg:flex lg:min-h-[78svh] lg:flex-col lg:justify-center lg:py-20 lg:first:pt-20"
    >
      {/* Mobile/Tablet: eigenes Bild bzw. eigener Film pro Leistung (Desktop: Sticky-Bühne links) */}
      <div className="relative mb-9 aspect-[4/3] overflow-hidden bg-ink-850 lg:hidden">
        {film ? (
          <ServiceFilmCard film={film} />
        ) : service.image ? (
          <>
            <Image
              src={service.image.src}
              alt={service.image.alt}
              fill
              sizes="(min-width: 640px) 90vw, 100vw"
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(3_5_15/0.7))]" />
          </>
        ) : (
          <ServicePlaceholder />
        )}
      </div>

      <div className="flex items-center gap-4" aria-hidden>
        <span className="font-mono text-sm text-sky-400 tabular">{service.index}</span>
        <span className="h-px w-10 bg-line-strong transition-[width,background-color] duration-700 ease-out-expo lg:group-data-[active=true]/block:w-16 lg:group-data-[active=true]/block:bg-sky/60" />
      </div>

      <h3 id={`${service.slug}-title`} className="mt-6">
        <span className="sr-only">{service.name}</span>
        {/* aktiver Block: Titel in voller Helligkeit – inaktive bleiben AA-konform (≥ 70 %) */}
        <span aria-hidden className="block transition-opacity duration-700 ease-out-quint lg:group-data-[active=false]/block:opacity-70">
          <TwoTone top={service.eyebrow} bottom={service.title} size="lg" />
        </span>
      </h3>

      <p className="mt-6 max-w-[54ch] text-lead text-fg-muted">{service.description}</p>

      <ul className="mt-9 grid border-t border-line sm:grid-cols-2 sm:gap-x-8" aria-label={`${service.name}: Leistungsumfang`}>
        {service.highlights.map((highlight) => (
          <li key={highlight} className="flex items-start gap-3 border-b border-line py-3.5 text-[0.9375rem] leading-snug text-fg/90">
            <Sparkle className="mt-1 size-2.5 shrink-0 text-sky-400" />
            {highlight}
          </li>
        ))}
      </ul>

      <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-5">
        <ServiceRequestLink service={service.slug} variant="secondary" size="md">
          {servicesSection.requestLabel}
        </ServiceRequestLink>
        {service.priceFrom ? (
          <p className="flex items-baseline gap-2.5">
            <span className="text-sm text-fg-subtle">ab</span>
            <span className="text-[2rem] leading-none font-medium tracking-[-0.03em] tabular">{formatEuro(service.priceFrom)}</span>
            {service.priceLabel ? <span className="text-sm text-fg-muted">{service.priceLabel}</span> : null}
          </p>
        ) : (
          <p className="max-w-[30ch] text-sm leading-snug text-fg-subtle">{servicesSection.quoteNote}</p>
        )}
      </div>
    </li>
  );
}
