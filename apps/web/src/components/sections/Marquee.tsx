import { services } from '@ccs/shared';
import { Sparkle } from '@/components/ui/Sparkle';
import { marquee } from '@/content/hero';
import { MarqueeTrack } from '@/components/ui/MarqueeTrack';

interface Item {
  /** Obere Bannerzeile – Sky, leicht. */
  top: string;
  /** Untere Bannerzeile – Weiß, kräftig. */
  bottom?: string;
}

const items: Item[] = [
  ...services.map((service) => ({ top: service.eyebrow, bottom: service.title })),
  ...marquee.extras.map((word) => ({ top: word })),
];

function Track() {
  return (
    <ul aria-hidden className="flex shrink-0 items-center">
      {items.map((item, index) => (
        <li key={`${item.top}-${item.bottom ?? ''}`} className="flex items-center whitespace-nowrap">
          <span className="font-light text-sky-400">{item.top}</span>
          {item.bottom ? (
            <span className="ml-[0.28em] bg-[linear-gradient(180deg,#ffffff_30%,var(--color-sky-200)_100%)] bg-clip-text font-medium text-transparent">
              {item.bottom}
            </span>
          ) : null}
          <Sparkle
            className="mx-[0.62em] size-[0.3em] shrink-0 text-sky animate-sparkle motion-reduce:animate-none"
            style={{ animationDelay: `${(index % 4) * -0.9}s` }}
          />
        </li>
      ))}
    </ul>
  );
}

/**
 * Laufband zwischen Hero und „Über uns“: die Leistungen in der Zweiton-Typografie der Banner,
 * als eine große Zeile – Sky (leicht) + Weiß (kräftig), getrennt von Funkel-Sternen.
 * Zwei identische Spuren für die nahtlose Schleife; Screenreader bekommen eine einfache Aufzählung.
 */
export function Marquee() {
  const spoken = items.map((item) => [item.top, item.bottom].filter(Boolean).join(' ')).join(', ');

  return (
    <div className="relative overflow-hidden border-y border-line bg-ink-950">
      <p className="sr-only">
        {marquee.label}: {spoken}
      </p>
      <div className="py-7 [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] sm:py-9 lg:py-11">
        <MarqueeTrack className="text-[clamp(2rem,1.1rem+3.6vw,4.5rem)] leading-none tracking-[0.02em] uppercase font-wide [--marquee-duration:110s]">
          <Track />
          <Track />
        </MarqueeTrack>
      </div>
    </div>
  );
}
