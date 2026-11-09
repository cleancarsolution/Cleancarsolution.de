import type { CSSProperties } from 'react';
import { LOGO_ORDER, LOGO_PALETTE } from '@/components/brand/Logo';
import { LOGO_PATHS, type LogoPart } from '@/components/brand/logo-paths';
import { cn } from '@/lib/cn';
import { FinaleStage } from './FinaleStage';
import styles from './logo-finale.module.css';

/** Hell-Fassung wie im Header – das Logo steht frei auf dem dunklen Grund. */
const PALETTE = LOGO_PALETTE.light;

/** Zeichenflächen in Logo-Einheiten (logo-paths.ts); die Unterkante ist die Bodenlinie. */
interface View {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** ab sm: Wort-Bild-Marke nebeneinander (Bildmarke links) – Unterkante = untere Welle. */
const WIDE: View = { x: 0, y: -28, w: 801, h: 132.6 };
/** Smartphone: Bildmarke über dem Schriftzug, wie im Kunden-Logo `Color-vert.png`. */
const STACKED: View = { x: 410, y: -147, w: 390, h: 249 };
/** Bildmarke im gestapelten Logo: 85 % der Schriftbreite, Abstand zum Schriftzug wie im Original. */
const STACKED_MARK = 'translate(429.4 -121.9) scale(0.9306)';

const MARK_PARTS: ReadonlySet<LogoPart> = new Set(['car', 'waveMid', 'waveLow', 'sparkleTop', 'sparkleLow']);

/** Auftakt je Teil: Bewegung (Klasse) und Verzögerung in s – Wellen, Auto, Schriftzug, zuletzt die Funkel. */
const REVEAL: Record<LogoPart, { className: string | undefined; delay: number }> = {
  waveLow: { className: styles.wave, delay: 0.15 },
  waveMid: { className: styles.wave, delay: 0.25 },
  car: { className: styles.car, delay: 0.35 },
  wordCleanCar: { className: styles.word, delay: 0.55 },
  wordSolution: { className: styles.word, delay: 0.7 },
  sparkleTop: { className: styles.sparkle, delay: 1.05 },
  sparkleLow: { className: styles.sparkle, delay: 1.2 },
};

/** Lichtstreifen: Breite und Neigung in Logo-Einheiten. */
const BEAM_W = 120;
const BEAM_SKEW = -16;

const href = (part: LogoPart) => `#ccs-finale-${part}`;

/**
 * Finale des Footers: das Logo von Clean Car Solution in voller Breite auf der Bodenlinie, darunter seine
 * Spiegelung im glänzenden Boden. Beim Hineinscrollen kommen die Teile nacheinander – die Wellen laufen von links
 * herein, das Auto rollt an, der Schriftzug hebt sich, zuletzt funkeln die Sterne –, dann gleitet einmal
 * Studiolicht über das Logo und sein Reflex läuft auf der Bodenlinie mit (`FinaleStage`).
 * Die Logo-Pfade stehen nur einmal im Dokument (<defs>), alle Fassungen verweisen per <use> darauf.
 * Rein dekorativ (`aria-hidden`) – „Bewegung reduzieren“: alles steht sofort, kein Lichtlauf.
 */
export function LogoFinale({ className }: { className?: string }) {
  return (
    <FinaleStage className={className}>
      <svg width="0" height="0" className="absolute">
        <defs>
          {LOGO_ORDER.map((part) => (
            <path key={part} id={href(part).slice(1)} d={LOGO_PATHS[part]} fill={PALETTE[part]} fillRule="evenodd" />
          ))}
        </defs>
      </svg>

      <Variant view={WIDE} id="wide" className="hidden sm:block" />
      <Variant view={STACKED} id="stacked" markTransform={STACKED_MARK} className="sm:hidden" />
    </FinaleStage>
  );
}

function Variant({ view, id, markTransform, className }: { view: View; id: string; markTransform?: string; className?: string }) {
  const viewBox = `${view.x} ${view.y} ${view.w} ${view.h}`;
  const floor = view.y + view.h;
  const placed = (parts: readonly LogoPart[]) => parts.filter((part) => !markTransform || !MARK_PARTS.has(part));
  const marked = LOGO_ORDER.filter((part) => markTransform && MARK_PARTS.has(part));
  const clipId = `ccs-finale-${id}-clip`;
  const beamId = `ccs-finale-${id}-beam`;
  /* Lichtstreifen startet links außerhalb und läuft bis rechts außerhalb (Weg in Logo-Einheiten). */
  const beamStart = view.x - BEAM_W - 40;
  const travel = view.w + BEAM_W + 80;
  /* Mitte des Streifens auf Höhe der Bodenlinie, relativ zur linken Kante – für den Reflex auf der Linie. */
  const floorCenter = beamStart - view.x + BEAM_W / 2 + Math.tan((BEAM_SKEW * Math.PI) / 180) * floor;

  const uses = (animated: boolean) => (
    <>
      {placed(LOGO_ORDER).map((part) => (
        <Part key={part} part={part} animated={animated} />
      ))}
      {marked.length ? (
        <g transform={markTransform}>
          {marked.map((part) => (
            <Part key={part} part={part} animated={animated} />
          ))}
        </g>
      ) : null}
    </>
  );

  return (
    <div data-variant data-units={view.w} data-travel={travel} data-floor-center={floorCenter} className={className}>
      <svg viewBox={viewBox} className="block h-auto w-full overflow-visible">
        <defs>
          <linearGradient id={beamId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#84d0fa" stopOpacity="0" />
            <stop offset="0.38" stopColor="#b8e4fc" stopOpacity="0.2" />
            <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.7" />
            <stop offset="0.62" stopColor="#b8e4fc" stopOpacity="0.2" />
            <stop offset="1" stopColor="#84d0fa" stopOpacity="0" />
          </linearGradient>
          <clipPath id={clipId}>
            {placed(LOGO_ORDER).map((part) => (
              <use key={part} href={href(part)} />
            ))}
            {marked.map((part) => (
              <use key={part} href={href(part)} transform={markTransform} />
            ))}
          </clipPath>
        </defs>

        {uses(true)}

        {/* Studiolicht – nur auf dem Logo sichtbar */}
        <g clipPath={`url(#${clipId})`}>
          <g data-beam>
            <rect
              x={beamStart}
              y={view.y - 20}
              width={BEAM_W}
              height={view.h + 40}
              transform={`skewX(${BEAM_SKEW})`}
              fill={`url(#${beamId})`}
            />
          </g>
        </g>
      </svg>

      {/* Bodenlinie mit Lichtreflex */}
      <div data-reveal className={cn('relative h-px overflow-hidden bg-line-strong', styles.floor)}>
        {/* Ruhelage links außerhalb – als `transform`, damit die Animation sie sauber ersetzt */}
        <span
          data-glint
          className="absolute inset-y-0 left-0 w-[18%] bg-[linear-gradient(90deg,transparent,var(--color-sky-200)_50%,transparent)]"
          style={{ transform: 'translateX(-100%)' }}
        />
      </div>

      {/* Spiegelung im Boden: das Logo, an der Bodenlinie gekippt, läuft nach unten ins Dunkel aus */}
      <div
        className={cn('relative overflow-hidden', styles.mirror)}
        style={{ aspectRatio: `${view.w} / ${Math.round(view.h * 0.3)}` } as CSSProperties}
      >
        <svg viewBox={viewBox} className={cn('absolute inset-x-0 top-0 block h-auto w-full', styles.flip)}>
          {uses(false)}
        </svg>
      </div>
    </div>
  );
}

function Part({ part, animated }: { part: LogoPart; animated: boolean }) {
  if (!animated) return <use href={href(part)} />;
  const { className, delay } = REVEAL[part];
  return (
    <use
      data-reveal
      href={href(part)}
      className={cn(styles.part, className)}
      style={{ '--d': `${delay}s` } as CSSProperties}
    />
  );
}
