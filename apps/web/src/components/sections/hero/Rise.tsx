import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './hero.module.css';

interface RiseProps {
  children: ReactNode;
  /** Verzögerung in Sekunden ab erstem Paint. */
  delay?: number;
  /** Start-Versatz in px (0 = nur Einblenden). */
  y?: number;
  className?: string;
  as?: 'div' | 'span';
}

/**
 * Auftakt-Einblendung im Hero (CSS, startet mit dem ersten Paint – nicht erst nach der Hydration),
 * damit Eyebrow, Lead, CTAs und Meta-Leiste im selben Takt laufen wie Bild und Headline.
 */
export function Rise({ children, delay = 0, y = 18, className, as: Tag = 'div' }: RiseProps) {
  return (
    <Tag
      className={cn(y === 0 ? styles.riseSlow : styles.rise, className)}
      style={{ '--delay': `${delay}s`, '--y': `${y}px` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Auftakt der Preis-Plakette: dreht sich aus einer Vierteldrehung herein und wächst auf Endgröße. */
export function Spin({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <div className={cn(styles.spin, className)} style={{ '--delay': `${delay}s` } as CSSProperties}>
      {children}
    </div>
  );
}

/** Auftakt des Bildes: aus dem Schwarz, langsam von 1,08 auf 1. */
export function MediaIntro({ children, className, style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div className={cn(styles.media, className)} style={style}>
      {children}
    </div>
  );
}
