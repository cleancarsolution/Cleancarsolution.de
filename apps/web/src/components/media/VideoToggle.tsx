'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { Pause, Play } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

interface VideoToggleProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  /** Absicht (Icon & Beschriftung). */
  shouldPlay: boolean;
  /** Tatsächlicher Zustand (Ring läuft nur dann). */
  playing: boolean;
  /** Video eingehängt – sonst bleibt der Ring unsichtbar. */
  mounted: boolean;
  onToggle: () => void;
  pauseLabel: string;
  playLabel: string;
  className?: string;
}

/**
 * Pause/Play für Hintergrundvideos (WCAG 2.2.2). Ein feiner Ring zeigt den Fortschritt der Schleife –
 * geschrieben per rAF direkt ins SVG, ohne React-Re-Render.
 */
export function VideoToggle({ videoRef, shouldPlay, playing, mounted, onToggle, pauseLabel, playLabel, className }: VideoToggleProps) {
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const draw = () => {
      const element = videoRef.current;
      const ring = ringRef.current;
      if (!element || !ring || !Number.isFinite(element.duration) || element.duration <= 0) return;
      ring.style.strokeDashoffset = String(1 - element.currentTime / element.duration);
    };
    draw();
    if (!playing) return;
    let frame = 0;
    const tick = () => {
      draw();
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frame);
  }, [playing, videoRef]);

  const label = shouldPlay ? pauseLabel : playLabel;

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={label}
      title={label}
      className={cn(
        'group/toggle relative grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-fg transition-[background-color] duration-300 hover:bg-white/[0.08]',
        className,
      )}
    >
      <svg aria-hidden viewBox="0 0 44 44" className="absolute inset-0 size-full -rotate-90">
        <circle cx="22" cy="22" r="21.25" fill="none" stroke="rgb(255 255 255 / 0.2)" strokeWidth="1" />
        <circle
          ref={ringRef}
          cx="22"
          cy="22"
          r="21.25"
          fill="none"
          stroke="var(--color-sky)"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="1"
          strokeDashoffset="1"
          className={cn('transition-opacity duration-500', mounted ? 'opacity-100' : 'opacity-0')}
        />
      </svg>
      {shouldPlay ? <Pause aria-hidden className="size-3.5" /> : <Play aria-hidden className="ml-0.5 size-3.5" />}
    </button>
  );
}
