'use client';

import { useInView, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { EASE_IN_OUT_QUART } from '@/lib/motion';
import styles from './logo-finale.module.css';

const SWEEP_MS = 2600;
/** Licht startet, wenn die Teile (fast) stehen. */
const SWEEP_DELAY_MS = 1300;

/**
 * Bühne des Footer-Finales (`LogoFinale`): schaltet beim Hineinscrollen den Auftakt frei (`data-shown`) und lässt
 * danach einmal das Studiolicht über das Logo gleiten – sein Reflex läuft exakt unter der Mitte des Streifens auf
 * der Bodenlinie mit. Mit der Maus über dem Logo gleitet das Licht erneut. Web Animations API, nur `transform`.
 */
export function FinaleStage({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const running = useRef<Animation[]>([]);

  const sweep = useCallback(() => {
    const root = ref.current;
    if (!root || running.current.length) return;
    // nur die sichtbare Fassung (nebeneinander oder gestapelt) animieren
    const variant = Array.from(root.querySelectorAll<HTMLElement>('[data-variant]')).find(
      (element) => element.getClientRects().length > 0,
    );
    if (!variant) return;

    const travel = Number(variant.dataset.travel);
    const pxPerUnit = variant.getBoundingClientRect().width / Number(variant.dataset.units);
    const timing: KeyframeAnimationOptions = {
      duration: SWEEP_MS,
      easing: `cubic-bezier(${EASE_IN_OUT_QUART.join(', ')})`,
    };

    const animations: Animation[] = [];
    // SVG-Inhalt: Längen in Logo-Einheiten
    variant.querySelectorAll<SVGGElement>('[data-beam]').forEach((beam) => {
      animations.push(beam.animate([{ transform: 'translateX(0px)' }, { transform: `translateX(${travel}px)` }], timing));
    });
    variant.querySelectorAll<HTMLElement>('[data-glint]').forEach((glint) => {
      const from = Number(variant.dataset.floorCenter) * pxPerUnit - glint.offsetWidth / 2;
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
      className={cn(styles.stage, 'relative select-none', className)}
    >
      {children}
    </div>
  );
}
