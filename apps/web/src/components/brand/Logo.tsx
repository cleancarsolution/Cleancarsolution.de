import { cn } from '@/lib/cn';
import { LOGO_HEIGHT, LOGO_PATHS, LOGO_TOP, LOGO_WIDTH, MARK_WIDTH, type LogoPart } from './logo-paths';

export interface LogoProps {
  /**
   * `color` = Originalfarben wie das Kunden-Logo (für helle Flächen),
   * `light` = weißes Auto/Schriftzug wie auf dem Roll-up (für Navy-Flächen), `blue` = blaues Auto auf Dunkel.
   */
  variant?: 'color' | 'light' | 'blue';
  /** `false` = nur Bildmarke (Auto + Wellen), ohne Schriftzug. */
  showWordmark?: boolean;
  className?: string;
  title?: string;
}

export const LOGO_PALETTE: Record<NonNullable<LogoProps['variant']>, Record<LogoPart, string>> = {
  // Exakt die Farben des Kunden-Logos: Navy trägt Auto, obere Welle, großen Stern und „CLEAN CAR“.
  color: {
    car: '#010D61',
    waveMid: '#0048CE',
    waveLow: '#26ABF6',
    sparkleTop: '#010D61',
    sparkleLow: '#26ABF6',
    wordCleanCar: '#010D61',
    wordSolution: '#0048CE',
  },
  light: {
    car: '#F3F6FB',
    waveMid: '#2A68E0',
    waveLow: '#26ABF6',
    sparkleTop: '#F3F6FB',
    sparkleLow: '#26ABF6',
    wordCleanCar: '#F3F6FB',
    wordSolution: '#84D0FA',
  },
  // Original-Navy wäre auf Ink unsichtbar – das Auto trägt Royal 400, die mittlere Welle rückt eine Stufe dunkler.
  blue: {
    car: '#2A68E0',
    waveMid: '#0048CE',
    waveLow: '#26ABF6',
    sparkleTop: '#26ABF6',
    sparkleLow: '#26ABF6',
    wordCleanCar: '#F3F6FB',
    wordSolution: '#84D0FA',
  },
};

/** Stapelreihenfolge wie bei den Original-Ebenen: untere Welle → mittlere Welle → Auto → Schriftzug, Funkel-Sterne obenauf. */
export const LOGO_ORDER: readonly LogoPart[] = [
  'waveLow',
  'waveMid',
  'wordSolution',
  'car',
  'wordCleanCar',
  'sparkleTop',
  'sparkleLow',
];
const MARK_PARTS: readonly LogoPart[] = ['waveLow', 'waveMid', 'car', 'sparkleTop', 'sparkleLow'];

/**
 * Vektor-Logo (aus den drei Original-Ebenen vektorisiert, siehe logo-paths.ts).
 * Größe über die Höhe steuern, z. B. `className="h-9 w-auto"`.
 * `data-part` an jedem Pfad ist der Ansatzpunkt für CSS-Animationen (z. B. der Auftakt im Header).
 */
export function Logo({ variant = 'color', showWordmark = true, className, title = 'Clean Car Solution' }: LogoProps) {
  const width = showWordmark ? LOGO_WIDTH : MARK_WIDTH;
  const parts = showWordmark ? LOGO_ORDER : MARK_PARTS;
  const palette = LOGO_PALETTE[variant];

  return (
    <svg
      viewBox={`0 ${LOGO_TOP} ${width} ${LOGO_HEIGHT}`}
      width={width}
      height={LOGO_HEIGHT}
      role={title ? 'img' : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      className={cn('block h-9 w-auto', className)}
    >
      {parts.map((part) => (
        <path key={part} data-part={part} d={LOGO_PATHS[part]} fill={palette[part]} fillRule="evenodd" />
      ))}
    </svg>
  );
}
