'use client';

import { useInView, useReducedMotion } from 'motion/react';
import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import styles from './studio.module.css';

interface LacquerPanelProps {
  children: ReactNode;
  /** id der Überschrift, die das Angebot benennt. */
  labelledBy: string;
  className?: string;
}

/**
 * Das Angebots-Paneel aus schwarzem Lack. Einzige Client-Komponente der Sektion:
 * - Sobald die Oberkante des Paneels das untere Viertel des Bildschirms hinter sich lässt, geht das Studiolicht an
 *   (`data-lit`, einmalig) – bewusst über die Position statt über einen Sichtbarkeitsanteil, damit es auch auf
 *   niedrigen Bildschirmen (Querformat, 200 % Zoom) zuverlässig angeht. Die Choreografie liegt in `studio.module.css`.
 * - Mit der Maus wandern Reflexe und Glanzlicht mit dem Blickwinkel: Position landet rAF-gedrosselt als
 *   `--mx`/`--my` (−1 … 1) am Element, ohne React-Re-Render. Touch und „Bewegung reduzieren“: ruhig.
 */
export function LacquerPanel({ children, labelledBy, className }: LacquerPanelProps) {
  const ref = useRef<HTMLElement>(null);
  const frame = useRef(0);
  const lit = useInView(ref, { once: true, margin: '0px 0px -25% 0px' });
  const reduce = useReducedMotion();

  useEffect(() => () => window.cancelAnimationFrame(frame.current), []);

  const aim = (x: number, y: number) => {
    const element = ref.current;
    if (!element) return;
    window.cancelAnimationFrame(frame.current);
    frame.current = window.requestAnimationFrame(() => {
      element.style.setProperty('--mx', x.toFixed(3));
      element.style.setProperty('--my', y.toFixed(3));
    });
  };

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== 'mouse' || reduce) return;
    const rect = event.currentTarget.getBoundingClientRect();
    aim(((event.clientX - rect.left) / rect.width) * 2 - 1, ((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const onPointerLeave = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType === 'mouse') aim(0, 0);
  };

  return (
    <article
      ref={ref}
      aria-labelledby={labelledBy}
      data-lit={lit}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      className={cn('relative isolate overflow-hidden', styles.panel, className)}
    >
      {children}
    </article>
  );
}
