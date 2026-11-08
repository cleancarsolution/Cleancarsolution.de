import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import styles from './studio.module.css';

/**
 * Reflexe der LED-Deckenleisten im schwarzen Lack – wie im Aufbereitungs-Studio über einer frisch polierten
 * Motorhaube. Jede Leiste ist ein schmales Lichtband entlang einer leicht gewölbten Kurve: an den Enden
 * spitz auslaufend, im Glanzpunkt am breitesten und hellsten, dazu ein Hauch Streulicht.
 * Geometrie wird auf dem Server berechnet (reines SVG, kein Client-JS).
 */

type Point = readonly [number, number];

interface Strip {
  /** Start (links) und Ende (rechts) der Mittellinie. */
  from: Point;
  to: Point;
  /** Wölbung der Kurve quer zur Laufrichtung (positiv = nach unten durchhängend). */
  sag: number;
  /** Maximale Breite des Lichtbands. */
  width: number;
  /** Lage des Glanzpunkts entlang der Leiste (0 … 1) und seine Ausdehnung. */
  hot: number;
  spread: number;
  /** Spitzen-Deckkraft. */
  intensity: number;
}

interface StripSet {
  id: string;
  width: number;
  height: number;
  strips: readonly Strip[];
}

/** Desktop & Tablet: Paneel im Querformat. Oben ferne, unten nahe Leisten – nach rechts hinten laufen sie zusammen. */
const WIDE: StripSet = {
  id: 'wide',
  width: 1440,
  height: 720,
  strips: [
    { from: [-60, 255], to: [1500, -265], sag: 26, width: 1.5, hot: 0.31, spread: 0.12, intensity: 0.5 },
    { from: [-60, 360], to: [1500, -170], sag: 30, width: 1.9, hot: 0.35, spread: 0.13, intensity: 0.62 },
    { from: [-60, 470], to: [1500, -70], sag: 34, width: 2.4, hot: 0.39, spread: 0.14, intensity: 0.78 },
    { from: [-60, 590], to: [1500, 40], sag: 38, width: 2.9, hot: 0.43, spread: 0.15, intensity: 0.86 },
    { from: [-60, 722], to: [1500, 162], sag: 42, width: 3.5, hot: 0.47, spread: 0.16, intensity: 0.78 },
    { from: [-60, 870], to: [1500, 292], sag: 46, width: 4.1, hot: 0.5, spread: 0.17, intensity: 0.66 },
  ],
};

/** Smartphone: Hochformat, steiler und enger – das Band kreuzt hinter dem Preis. */
const TALL: StripSet = {
  id: 'tall',
  width: 400,
  height: 640,
  strips: [
    { from: [-30, 150], to: [430, -48], sag: 8, width: 1.1, hot: 0.6, spread: 0.16, intensity: 0.5 },
    { from: [-30, 238], to: [430, 38], sag: 9, width: 1.4, hot: 0.62, spread: 0.17, intensity: 0.62 },
    { from: [-30, 334], to: [430, 130], sag: 10, width: 1.7, hot: 0.64, spread: 0.18, intensity: 0.78 },
    { from: [-30, 440], to: [430, 232], sag: 11, width: 2.1, hot: 0.66, spread: 0.19, intensity: 0.84 },
    { from: [-30, 558], to: [430, 344], sag: 12, width: 2.5, hot: 0.68, spread: 0.2, intensity: 0.72 },
  ],
};

/** Gesamthelligkeit der Reflexe: leise genug, dass Preis, Text und Liste darüber ruhig lesbar bleiben. */
const LEVEL = 0.62;

/* ── Geometrie ──────────────────────────────────────────────────────────── */

function controlPoints({ from, to, sag }: Strip): [Point, Point, Point, Point] {
  const dx = to[0] - from[0];
  const dy = to[1] - from[1];
  const length = Math.hypot(dx, dy);
  const nx = -dy / length;
  const ny = dx / length;
  return [
    from,
    [from[0] + dx / 3 + nx * sag, from[1] + dy / 3 + ny * sag],
    [from[0] + (2 * dx) / 3 + nx * sag, from[1] + (2 * dy) / 3 + ny * sag],
    to,
  ];
}

function bezier([a, b, c, d]: [Point, Point, Point, Point], t: number): { point: Point; tangent: Point } {
  const u = 1 - t;
  const point: Point = [
    u * u * u * a[0] + 3 * u * u * t * b[0] + 3 * u * t * t * c[0] + t * t * t * d[0],
    u * u * u * a[1] + 3 * u * u * t * b[1] + 3 * u * t * t * c[1] + t * t * t * d[1],
  ];
  const tangent: Point = [
    3 * u * u * (b[0] - a[0]) + 6 * u * t * (c[0] - b[0]) + 3 * t * t * (d[0] - c[0]),
    3 * u * u * (b[1] - a[1]) + 6 * u * t * (c[1] - b[1]) + 3 * t * t * (d[1] - c[1]),
  ];
  return { point, tangent };
}

/** Glanz-Verteilung entlang der Leiste: Gauß-Spitze im Glanzpunkt, darunter ein schwacher Grundschein. */
function glow(strip: Strip, t: number): number {
  const peak = Math.exp(-((t - strip.hot) ** 2) / (2 * strip.spread ** 2));
  const base = Math.pow(Math.sin(Math.PI * t), 0.8);
  return Math.min(1, 0.12 * base + 0.88 * peak);
}

/** Lichtband als geschlossene Fläche: Mittellinie, beidseitig um die halbe (variable) Breite versetzt. */
function ribbon(strip: Strip, scale = 1, samples = 72): string {
  const curve = controlPoints(strip);
  const left: string[] = [];
  const right: string[] = [];
  for (let i = 0; i <= samples; i++) {
    const t = i / samples;
    const { point, tangent } = bezier(curve, t);
    const length = Math.hypot(tangent[0], tangent[1]) || 1;
    const nx = -tangent[1] / length;
    const ny = tangent[0] / length;
    const taper = Math.pow(Math.sin(Math.PI * t), 0.6);
    const half = (strip.width * scale * taper * (0.35 + 0.65 * glow(strip, t))) / 2;
    left.push(`${(point[0] + nx * half).toFixed(1)} ${(point[1] + ny * half).toFixed(1)}`);
    right.push(`${(point[0] - nx * half).toFixed(1)} ${(point[1] - ny * half).toFixed(1)}`);
  }
  return `M${left.join('L')}L${right.reverse().join('L')}Z`;
}

/** Farbverlauf entlang der Leiste: im Glanzpunkt kaltes Weiß, zu den Enden Eisblau und transparent. */
const STOPS = [0, 0.05, 0.12, 0.2, 0.28, 0.34, 0.4, 0.46, 0.52, 0.58, 0.66, 0.75, 0.85, 0.94, 1];

function mix(t: number): string {
  // Sky-300 (#84D0FA) → Weiß, je näher am Glanzpunkt
  const r = Math.round(132 + (255 - 132) * t);
  const g = Math.round(208 + (255 - 208) * t);
  const b = Math.round(250 + (255 - 250) * t);
  return `rgb(${r} ${g} ${b})`;
}

/* ── Darstellung ────────────────────────────────────────────────────────── */

function StripArt({ set, from, to, className }: { set: StripSet; from: number; to: number; className?: string }) {
  const strips = set.strips.slice(from, to);
  return (
    <svg
      viewBox={`0 0 ${set.width} ${set.height}`}
      preserveAspectRatio="xMidYMin slice"
      className={cn('absolute inset-0 size-full', className)}
    >
      <defs>
        <filter
          id={`ccs-studio-bloom-${set.id}-${from}`}
          filterUnits="userSpaceOnUse"
          x={-200}
          y={-200}
          width={set.width + 400}
          height={set.height + 400}
        >
          <feGaussianBlur stdDeviation={set.id === 'wide' ? 7 : 4} />
        </filter>
        {strips.map((strip, k) => {
          const i = from + k;
          const [x1, y1] = strip.from;
          const [x2, y2] = strip.to;
          return (
            <linearGradient
              key={i}
              id={`ccs-studio-strip-${set.id}-${i}`}
              gradientUnits="userSpaceOnUse"
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
            >
              {STOPS.map((offset) => {
                const value = glow(strip, offset);
                return (
                  <stop
                    key={offset}
                    offset={offset}
                    stopColor={mix(Math.min(1, value * 1.15))}
                    stopOpacity={Number((strip.intensity * value * LEVEL).toFixed(3))}
                  />
                );
              })}
            </linearGradient>
          );
        })}
      </defs>

      {strips.map((strip, k) => {
        const i = from + k;
        return (
          <g key={i} className={styles.strip} style={{ '--i': i } as CSSProperties}>
            {/* Streulicht: breiter, weich, sehr leise */}
            <path
              d={ribbon(strip, 5)}
              fill={`url(#ccs-studio-strip-${set.id}-${i})`}
              opacity={0.1}
              filter={`url(#ccs-studio-bloom-${set.id}-${from})`}
            />
            {/* Lichtband: scharf wie der Reflex einer LED-Leiste auf Lack */}
            <path d={ribbon(strip)} fill={`url(#ccs-studio-strip-${set.id}-${i})`} />
          </g>
        );
      })}
    </svg>
  );
}

interface StudioStripsProps {
  className?: string;
}

/**
 * Ab sm zwei Ebenen (fern/nah) für die Parallaxe mit dem Zeiger, darunter eine Ebene im Hochformat.
 * Der Container wird vom Elternteil positioniert; alles ist dekorativ (aria-hidden).
 */
export function StudioStrips({ className }: StudioStripsProps) {
  return (
    <div aria-hidden className={cn('pointer-events-none', className)}>
      <div className="absolute -inset-8 hidden sm:block">
        <div className={cn('absolute inset-0', styles.drift)} style={{ '--depth-x': '12px', '--depth-y': '6px' } as CSSProperties}>
          <StripArt set={WIDE} from={0} to={3} />
        </div>
        <div className={cn('absolute inset-0', styles.drift)} style={{ '--depth-x': '26px', '--depth-y': '12px' } as CSSProperties}>
          <StripArt set={WIDE} from={3} to={6} />
        </div>
      </div>
      <div className="absolute inset-0 sm:hidden">
        <StripArt set={TALL} from={0} to={TALL.strips.length} />
      </div>
    </div>
  );
}
