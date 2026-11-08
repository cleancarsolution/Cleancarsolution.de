'use client';

import type { ReactNode } from 'react';
import { SliderControls, useSnapSlider } from '@/components/ui/SnapSlider';

interface ReviewSliderProps {
  /** Die Folien (`<li>`), auf dem Server gerendert. */
  children: ReactNode;
  label: string;
  controls: { prev: string; next: string };
}

/**
 * Rezensionen als Slider wie im Einblick: Felder zwischen Haarlinien (Kontaktabzug), alle so hoch wie das
 * längste; Wischen mit Einrasten, Fortschrittslinie und Pfeil-Knöpfe.
 */
export function ReviewSlider({ children, label, controls }: ReviewSliderProps) {
  const { trackRef, thumbRef, atStart, atEnd, step } = useSnapSlider();

  return (
    <>
      <ul
        ref={trackRef}
        aria-label={label}
        /* ohne Links in den Folien: per Tastatur fokussierbar, damit die Pfeiltasten blättern */
        tabIndex={0}
        /* waagrechtes Wischen (Trackpad) gehört dem Slider, nicht dem Smooth Scrolling der Seite */
        data-lenis-prevent-horizontal
        /* relative: Bezugsrahmen für die absolut positionierten sr-only-Texte – sonst ragen sie über die Seite */
        className="relative scrollbar-none flex snap-x snap-mandatory gap-px overflow-x-auto overscroll-x-contain border border-line bg-line"
      >
        {children}
      </ul>
      <SliderControls
        thumbRef={thumbRef}
        atStart={atStart}
        atEnd={atEnd}
        onStep={step}
        labels={controls}
        className="mt-6 sm:mt-8"
      />
    </>
  );
}
