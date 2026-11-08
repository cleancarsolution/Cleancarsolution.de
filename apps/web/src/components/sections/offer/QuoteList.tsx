import { getService, type ServiceSlug } from '@ccs/shared';
import { offer } from '@/content/offer';
import { ServiceRequestLink } from '@/components/sections/offer/ServiceRequestLink';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Check } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { TwoTone } from '@/components/ui/TwoTone';

/** Leistungen, für die es ein individuelles Angebot gibt (siehe offer.custom.text) – in Katalog-Reihenfolge (Nummern aufsteigend). */
const QUOTED: readonly ServiceSlug[] = ['fahrzeugaufbereitung', 'polster-leder', 'smart-repair', 'cabrioverdeck'];

/**
 * „Individuelles Angebot“ als Preisliste: eine Zeile je Leistung – Nummer, Banner-Zweizeiler, Einzeiler,
 * rechts „Individuell“ statt einer Zahl und der Weg zur Anfrage (wählt die Leistung im Formular vor).
 * Die ganze Zeile ist klickbar (gestreckter Link), Haarlinien gliedern statt Boxen.
 */
export function QuoteList({ className }: { className?: string }) {
  const c = offer.custom;

  return (
    <div className={className}>
      <header className="grid grid-cols-12 gap-x-5 lg:gap-x-8">
        <Reveal className="col-span-12 lg:col-span-6">
          <Eyebrow tone="muted">{c.eyebrow}</Eyebrow>
          <h3 id="preise-individuell-title" className="mt-5 text-display-md font-medium text-balance">
            {c.title}
          </h3>
        </Reveal>
        <Reveal className="col-span-12 mt-6 lg:col-span-5 lg:col-start-8 lg:mt-0 lg:self-end" delay={0.1}>
          <p className="max-w-[52ch] leading-relaxed text-fg-muted">{c.text}</p>
        </Reveal>
      </header>

      <Reveal className="mt-12 lg:mt-16" y={32} amount={0.2}>
        {/* Spaltenköpfe wie auf einer Preisliste – nur ab Desktop, für Screenreader trägt die Zeile selbst */}
        <div
          aria-hidden
          className="hidden grid-cols-[4.5rem_minmax(15rem,20rem)_1fr_10rem] gap-x-8 pb-4 text-eyebrow font-medium text-fg-subtle uppercase font-expanded lg:grid"
        >
          <span />
          <span>{c.list.service}</span>
          <span>{c.list.scope}</span>
          <span className="text-right">{c.list.price}</span>
        </div>

        <ul aria-labelledby="preise-individuell-title" className="border-t border-line">
          {QUOTED.map((slug) => {
            const service = getService(slug);
            return (
              <li
                key={slug}
                className="group/row relative grid grid-cols-[2.75rem_1fr] gap-x-3 border-b border-line py-7 transition-colors duration-500 ease-out-quint hover:bg-white/[0.025] has-[:focus-visible]:bg-white/[0.025] sm:grid-cols-[4.5rem_1fr] sm:gap-x-0 lg:grid-cols-[4.5rem_minmax(15rem,20rem)_1fr_10rem] lg:items-center lg:gap-x-8 lg:py-9"
              >
                {/* Lichtkante, die beim Überfahren unter der Zeile entlangläuft */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-[linear-gradient(90deg,var(--color-sky),rgb(38_171_246/0.4)_45%,transparent)] transition-transform duration-700 ease-out-expo group-hover/row:scale-x-100 motion-reduce:transition-none"
                />

                <span className="pt-1 font-mono text-xs text-fg-subtle tabular transition-colors duration-500 group-hover/row:text-sky-300 lg:pt-0 lg:pl-1">
                  {service.index}
                </span>

                <p>
                  <span className="sr-only">{service.name}</span>
                  <span aria-hidden className="block transition-transform duration-700 ease-out-expo group-hover/row:translate-x-1 motion-reduce:transition-none">
                    <TwoTone top={service.eyebrow} bottom={service.title} size="md" />
                  </span>
                </p>

                <p className="col-start-2 mt-3 max-w-[54ch] text-[0.9375rem] leading-relaxed text-fg-muted lg:col-start-auto lg:mt-0">
                  {service.summary}
                </p>

                <div className="col-start-2 mt-6 flex items-center justify-between gap-6 border-t border-line pt-5 lg:col-start-auto lg:mt-0 lg:flex-col lg:items-end lg:justify-center lg:gap-2.5 lg:border-t-0 lg:pt-0">
                  <p className="text-[0.9375rem] font-medium text-fg">
                    <span className="sr-only">{`${c.list.price}: `}</span>
                    {c.list.quote}
                  </p>
                  <ServiceRequestLink
                    service={slug}
                    variant="ghost"
                    className="static gap-2 text-sm text-fg-muted after:absolute after:inset-0 hover:text-fg"
                  >
                    {c.list.request}
                    <span className="sr-only">{`: ${service.name}`}</span>
                  </ServiceRequestLink>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>

      <Reveal className="mt-10 lg:mt-12" amount={0.4}>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-x-8">
            {c.points.map((point) => (
              <li key={point} className="flex items-center gap-2.5 text-[0.9375rem] text-fg/90">
                <Check aria-hidden className="size-4 shrink-0 text-sky-400" />
                {point}
              </li>
            ))}
          </ul>
          <ServiceRequestLink service={c.service} variant="secondary" size="lg" className="w-full sm:w-auto sm:self-start lg:self-auto">
            {c.cta}
          </ServiceRequestLink>
        </div>
      </Reveal>
    </div>
  );
}
