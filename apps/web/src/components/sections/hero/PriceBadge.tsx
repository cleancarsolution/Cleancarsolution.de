import { formatEuro } from '@ccs/shared';
import { SmartLink } from '@/components/ui/SmartLink';
import { cn } from '@/lib/cn';

interface PriceBadgeProps {
  /** „Handwäsche innen & außen“ – läuft in Versalien um die Plakette. */
  label: string;
  prefix: string;
  price: number;
  href: string;
  className?: string;
}

/* Geometrie im 200er-Raster: Grundlinie des Ringtexts r = 76, Sparkle in der Lücke bei 9 Uhr. */
const R = 76;
const CIRCUMFERENCE = 2 * Math.PI * R;
const GAP = 34;
const RING_PATH = `M ${100 - R},100 a ${R},${R} 0 1,1 ${2 * R},0 a ${R},${R} 0 1,1 -${2 * R},0`;
/** Mitte des Schriftbands (Grundlinie + halbe Versalhöhe) – dort sitzt der Sparkle. */
const BAND = R + 6.5;
const SPARKLE_SCALE = 0.6;
const SPARKLE_OFFSET = 12 * SPARKLE_SCALE;
const SPARKLE_TRANSFORM = `translate(${100 - BAND - SPARKLE_OFFSET} ${100 - SPARKLE_OFFSET}) scale(${SPARKLE_SCALE})`;
const SPARKLE = 'M12 0c.55 6.4 5.6 11.45 12 12-6.4.55-11.45 5.6-12 12-.55-6.4-5.6-11.45-12-12C6.4 11.45 11.45 6.4 12 0Z';

/**
 * Das rote Preis-Badge der Banner („Handwäsche innen- & außen ab 89 €“) – neu gedacht als Plakette:
 * Signalrot, in der Mitte der Preis, außen läuft die Leistung als Ringtext langsam um.
 * Einziger Einsatz von Signalrot im Hero. Rotation steht bei „Bewegung reduzieren“
 * und wenn das Video pausiert ist (`data-paused` am Hero).
 */
export function PriceBadge({ label, prefix, price, href, className }: PriceBadgeProps) {
  const ring = label.toLocaleUpperCase('de-DE');
  const amount = formatEuro(price).replace(/[^\d.,]/g, '');

  return (
    <SmartLink
      href={href}
      className={cn(
        'group/badge relative block aspect-square rounded-full bg-signal text-white',
        'shadow-[inset_0_1px_0_rgb(255_255_255/0.25),inset_0_-10px_24px_-12px_rgb(80_0_8/0.55)]',
        'transition-[scale] duration-500 ease-out-expo hover:scale-[1.04]',
        className,
      )}
    >
      {/* Zugänglicher Name aus Inhalt (Grafik selbst ist aria-hidden) */}
      <span className="sr-only">{`${label} ${prefix} ${formatEuro(price)} – zu den Preisen`}</span>

      {/* Ringtext – als eigene Ebene gedreht (Compositor statt SVG-Repaint) */}
      <span
        aria-hidden
        className="absolute inset-0 animate-[spin_36s_linear_infinite] will-change-transform group-hover/badge:[animation-duration:18s] group-data-paused/hero:[animation-play-state:paused] motion-reduce:animate-none"
      >
        <svg viewBox="0 0 200 200" className="size-full overflow-visible">
          <defs>
            <path id="hero-badge-ring" d={RING_PATH} fill="none" />
          </defs>
          <text className="fill-white font-sans text-[17.5px] font-medium font-expanded">
            <textPath
              href="#hero-badge-ring"
              startOffset={GAP / 2}
              textLength={CIRCUMFERENCE - GAP}
              lengthAdjust="spacing"
            >
              {ring}
            </textPath>
          </text>
          <path d={SPARKLE} transform={SPARKLE_TRANSFORM} className="fill-white" />
        </svg>
      </span>

      {/* Mitte: Preis */}
      <svg aria-hidden viewBox="0 0 200 200" className="absolute inset-0 size-full">
        <circle cx="100" cy="100" r="62" fill="none" stroke="rgb(255 255 255 / 0.28)" strokeWidth="1" />
        <text x="100" y="80" textAnchor="middle" className="fill-white font-sans text-[15px] font-medium tracking-[0.18em] uppercase font-expanded">
          {prefix}
        </text>
        <text x="96" y="136" textAnchor="middle" className="fill-white font-sans text-[60px] font-semibold tracking-[-0.05em] tabular">
          {amount}
          <tspan dx="3" dy="-21" className="text-[26px] font-medium tracking-normal">
            €
          </tspan>
        </text>
      </svg>
    </SmartLink>
  );
}
