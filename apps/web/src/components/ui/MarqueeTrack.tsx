'use client';

import { useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

interface MarqueeTrackProps {
  children: ReactNode;
  className?: string;
}

/** Ziel-Geschwindigkeit beim Hover (Anteil) und Dauer des Abbremsens/Beschleunigens. */
const HOVER_RATE = 0.12;
const EASE_MS = 700;

/**
 * Laufband-Spur (CSS `animate-marquee`). Beim Überfahren bremst sie weich ab statt hart zu stoppen:
 * die playbackRate der CSS-Animation wird per Web Animations API über ~0,7 s heruntergeregelt –
 * ohne Positionssprung. Bei „Bewegung reduzieren“ steht die Spur (CSS).
 */
export function MarqueeTrack({ children, className }: MarqueeTrackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);

  const rampTo = (target: number) => {
    const animation = ref.current?.getAnimations()[0];
    if (!animation) return;
    window.cancelAnimationFrame(frame.current);
    const from = animation.playbackRate;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / EASE_MS);
      const eased = 1 - Math.pow(1 - t, 3);
      animation.updatePlaybackRate(from + (target - from) * eased);
      if (t < 1) frame.current = window.requestAnimationFrame(step);
    };
    frame.current = window.requestAnimationFrame(step);
  };

  return (
    <div
      ref={ref}
      onPointerEnter={(event) => {
        if (event.pointerType === 'mouse') rampTo(HOVER_RATE);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'mouse') rampTo(1);
      }}
      className={cn('flex w-max animate-marquee motion-reduce:animate-none', className)}
    >
      {children}
    </div>
  );
}
