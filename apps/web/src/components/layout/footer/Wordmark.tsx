'use client';

import { useInView, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useId, useRef, type PointerEvent } from 'react';
import { cn } from '@/lib/cn';
import { EASE_IN_OUT_QUART } from '@/lib/motion';
import styles from './wordmark.module.css';

/**
 * Geometrie der Wortmarke in SVG-Einheiten (Schriftgröße 100), im Browser an Mona Sans gemessen
 * (Breite 125 %, Gewicht 500): `x` = Startposition je Buchstabe inkl. Unterschneidung,
 * `ink` = sichtbare Breite von der linken Kante des ersten bis zur rechten Kante des letzten Buchstabens.
 * Die Marke ist ein festes Markenzeichen wie das Logo – bei anderem Text neu messen.
 */
const CAP = 74;
const SIDE_BEARING = 2;

interface Row {
  letters: ReadonlyArray<readonly [letter: string, x: number]>;
  ink: number;
}

const CLEAN = [
  ['C', 0],
  ['L', 81.5],
  ['E', 140.59],
  ['A', 211],
  ['N', 294.2],
] as const;

const ROWS: Record<'wide' | 'stacked', readonly Row[]> = {
  /** ab sm: eine Zeile über die volle Breite */
  wide: [
    {
      letters: [
        ...CLEAN,
        ['C', 400.41],
        ['A', 479.83],
        ['R', 563.03],
      ],
      ink: 635.03,
    },
  ],
  /** mobil: zwei Ebenen – so bleibt die Marke auch auf dem Telefon groß */
  stacked: [
    { letters: CLEAN, ink: 370.2 },
    {
      letters: [
        ['C', 0],
        ['A', 79.42],
        ['R', 162.63],
      ],
      ink: 234.63,
    },
  ],
};

/** Lichtstreifen: Breite, Neigung und Startposition (links außerhalb) in SVG-Einheiten. */
const BEAM_W = 150;
const BEAM_SKEW = -16;
const BEAM_START = -BEAM_W - 40;
/** Versatz des Streifens auf Höhe der Bodenlinie durch die Neigung. */
const BEAM_FLOOR_SHIFT = Math.tan((BEAM_SKEW * Math.PI) / 180) * CAP;
const SWEEP_MS = 2600;
/** Licht startet, wenn die Buchstaben (fast) stehen. */
const SWEEP_DELAY_MS = 950;
const LETTER_STAGGER = 0.045;

/**
 * Finale des Footers: „CLEAN CAR“ über die volle Breite, aus schwarzem Lack – oben vom kalten Studiolicht
 * gestreift, zur Bodenlinie hin im Dunkel. Beim Hineinscrollen heben sich die Buchstaben nacheinander aus
 * der Bodenlinie, dann gleitet einmal ein Lichtstreifen über den Lack, und sein Reflex läuft auf der
 * Bodenlinie mit. Mit der Maus über der Marke gleitet das Licht erneut. Rein dekorativ (`aria-hidden`).
 * „Bewegung reduzieren“: Buchstaben stehen sofort, kein Lichtlauf.
 */
export function Wordmark({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const running = useRef<Animation[]>([]);
  const uid = useId().replace(/[^a-zA-Z0-9-]/g, '');

  const sweep = useCallback(() => {
    const root = ref.current;
    if (!root || running.current.length) return;
    // nur die sichtbare Fassung (breit oder gestapelt) animieren
    const variant = Array.from(root.querySelectorAll<HTMLElement>('[data-variant]')).find(
      (element) => element.getClientRects().length > 0,
    );
    if (!variant) return;

    const maxInk = Number(variant.dataset.ink);
    const pxPerUnit = variant.getBoundingClientRect().width / maxInk;
    const travel = maxInk - BEAM_START + 40;
    const timing: KeyframeAnimationOptions = {
      duration: SWEEP_MS,
      easing: `cubic-bezier(${EASE_IN_OUT_QUART.join(', ')})`,
    };

    const animations: Animation[] = [];
    variant.querySelectorAll<SVGGElement>('[data-beam]').forEach((beam) => {
      animations.push(beam.animate([{ transform: 'translateX(0px)' }, { transform: `translateX(${travel}px)` }], timing));
    });
    // Reflex auf der Bodenlinie: läuft exakt unter der Mitte des Lichtstreifens mit
    variant.querySelectorAll<HTMLElement>('[data-glint]').forEach((glint) => {
      const from = (BEAM_START + BEAM_W / 2 + BEAM_FLOOR_SHIFT) * pxPerUnit - glint.offsetWidth / 2;
      const to = from + travel * pxPerUnit;
      animations.push(glint.animate([{ transform: `translateX(${from}px)` }, { transform: `translateX(${to}px)` }], timing));
    });

    running.current = animations;
    Promise.allSettled(animations.map((animation) => animation.finished)).then(() => {
      running.current = [];
    });
  }, []);

  useEffect(() => {
    if (!inView || reduce) return;
    const timer = window.setTimeout(sweep, SWEEP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [inView, reduce, sweep]);

  useEffect(() => () => running.current.forEach((animation) => animation.cancel()), []);

  const onPointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && inView && !reduce) sweep();
  };

  return (
    <div
      ref={ref}
      aria-hidden
      data-shown={inView}
      onPointerEnter={onPointerEnter}
      className={cn(styles.stage, 'select-none', className)}
    >
      <Variant rows={ROWS.wide} uid={`${uid}-w`} className="hidden sm:block" />
      <Variant rows={ROWS.stacked} uid={`${uid}-s`} className="sm:hidden" />
    </div>
  );
}

function Variant({ rows, uid, className }: { rows: readonly Row[]; uid: string; className?: string }) {
  const maxInk = Math.max(...rows.map((row) => row.ink));

  return (
    <div data-variant data-ink={maxInk} className={className}>
      {rows.map((row, r) => {
        const id = `${uid}-${r}`;
        const xs = row.letters.map(([, x]) => x - SIDE_BEARING).join(' ');
        const text = row.letters.map(([letter]) => letter).join('');
        // Staffelung läuft über alle Zeilen weiter
        const offset = rows.slice(0, r).reduce((sum, previous) => sum + previous.letters.length, 0);

        return (
          <div key={id} className={r > 0 ? 'mt-[4%]' : undefined}>
            <svg
              viewBox={`0 -1 ${row.ink} ${CAP + 1}`}
              className="block h-auto overflow-hidden"
              style={{ width: `${(row.ink / maxInk) * 100}%` }}
            >
              <defs>
                {/* schwarzer Lack: oben vom Studiolicht gestreift, zur Bodenlinie hin im Dunkel */}
                <linearGradient id={`${id}-lacquer`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={CAP}>
                  <stop offset="0" stopColor="#26325f" />
                  <stop offset="0.45" stopColor="#111a38" />
                  <stop offset="1" stopColor="#070b1b" />
                </linearGradient>
                <linearGradient id={`${id}-beam`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#84d0fa" stopOpacity="0" />
                  <stop offset="0.38" stopColor="#b8e4fc" stopOpacity="0.16" />
                  <stop offset="0.5" stopColor="#e4f5fe" stopOpacity="0.62" />
                  <stop offset="0.62" stopColor="#b8e4fc" stopOpacity="0.16" />
                  <stop offset="1" stopColor="#84d0fa" stopOpacity="0" />
                </linearGradient>
                <clipPath id={`${id}-clip`}>
                  <text x={xs} y={CAP} fontSize="100" className="font-sans font-medium font-expanded">
                    {text}
                  </text>
                </clipPath>
              </defs>

              {row.letters.map(([letter, x], i) => (
                <text
                  key={`${letter}-${x}`}
                  data-reveal
                  x={x - SIDE_BEARING}
                  y={CAP}
                  fontSize="100"
                  fill={`url(#${id}-lacquer)`}
                  className={cn(styles.letter, 'font-sans font-medium font-expanded')}
                  style={{ transitionDelay: `${(offset + i) * LETTER_STAGGER}s` }}
                >
                  {letter}
                </text>
              ))}

              <g clipPath={`url(#${id}-clip)`}>
                <g data-beam>
                  <rect
                    x={BEAM_START}
                    y={-12}
                    width={BEAM_W}
                    height={CAP + 24}
                    transform={`skewX(${BEAM_SKEW})`}
                    fill={`url(#${id}-beam)`}
                  />
                </g>
              </g>
            </svg>

            {/* Bodenlinie mit Lichtreflex */}
            <div className="relative h-px overflow-hidden bg-line-strong">
              {/* Ruhelage links außerhalb – als `transform`, damit die Animation sie sauber ersetzt */}
              <span
                data-glint
                className="absolute inset-y-0 left-0 w-[22%] bg-[linear-gradient(90deg,transparent,var(--color-sky-200)_50%,transparent)]"
                style={{ transform: 'translateX(-100%)' }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
