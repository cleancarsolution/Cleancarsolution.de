'use client';

import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { cn } from '@/lib/cn';
import { ArrowLeft, ArrowRight } from './icons';

const NAV =
  'grid size-11 cursor-pointer place-items-center rounded-full border border-line-strong text-fg-muted transition-[border-color,color,background-color,opacity] duration-300 hover:border-sky/60 hover:bg-sky/[0.06] hover:text-sky-300 aria-disabled:pointer-events-none aria-disabled:opacity-35';

/**
 * Waagrechter Slider mit Einrasten (CSS scroll-snap): `trackRef` an die Liste der Folien, `thumbRef` an die
 * Fortschrittslinie (`SliderControls`). Linie und Pfeil-Knöpfe folgen dem Wischen – Breite und Lage der Linie
 * gehen direkt ins DOM, per rAF.
 */
export function useSnapSlider() {
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLUListElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const { scrollLeft, scrollWidth, clientWidth } = track;
      thumb.style.width = `${(clientWidth / scrollWidth) * 100}%`;
      thumb.style.transform = `translateX(${(scrollLeft / clientWidth) * 100}%)`;
      setAtStart(scrollLeft < 2);
      setAtEnd(scrollLeft > scrollWidth - clientWidth - 2);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    track.addEventListener('scroll', schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(track);
    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener('scroll', schedule);
      observer.disconnect();
    };
  }, []);

  /** Eine Folie weiter bzw. zurück – rastet an ihrer Vorderkante ein. */
  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    // Lage jeder Folie in der Spur – unabhängig davon, worauf sich `offsetLeft` bezieht
    const origin = track.getBoundingClientRect().left + track.clientLeft - track.scrollLeft;
    const starts = Array.from(
      track.children,
      (slide) => slide.getBoundingClientRect().left - origin,
    );
    const current = track.scrollLeft;
    const target =
      direction > 0
        ? starts.find((start) => start > current + 2)
        : starts.findLast((start) => start < current - 2);
    track.scrollTo({
      left: target ?? (direction > 0 ? track.scrollWidth : 0),
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  return { trackRef, thumbRef, atStart, atEnd, step };
}

interface SliderControlsProps {
  /** Aus `useSnapSlider` – einzeln übergeben, damit der React Compiler die Refs als solche erkennt. */
  thumbRef: RefObject<HTMLDivElement | null>;
  atStart: boolean;
  atEnd: boolean;
  onStep: (direction: 1 | -1) => void;
  labels: { prev: string; next: string };
  className?: string;
}

/** Fortschrittslinie (Sky → Royal) und Pfeil-Knöpfe unter einem Slider. */
export function SliderControls({
  thumbRef,
  atStart,
  atEnd,
  onStep,
  labels,
  className,
}: SliderControlsProps) {
  return (
    <div className={cn('flex items-center gap-6', className)}>
      <div aria-hidden className="h-px flex-1 overflow-hidden bg-line">
        <div ref={thumbRef} className="h-full w-0 bg-gradient-to-r from-sky to-royal-400" />
      </div>
      <div className="flex gap-3">
        <button
          type="button"
          onClick={() => onStep(-1)}
          aria-disabled={atStart}
          aria-label={labels.prev}
          className={NAV}
        >
          <ArrowLeft aria-hidden className="size-4" />
        </button>
        <button
          type="button"
          onClick={() => onStep(1)}
          aria-disabled={atEnd}
          aria-label={labels.next}
          className={NAV}
        >
          <ArrowRight aria-hidden className="size-4" />
        </button>
      </div>
    </div>
  );
}
