'use client';

import type { ReactNode } from 'react';
import { SliderControls, useSnapSlider } from '@/components/ui/SnapSlider';

interface ProductSliderProps {
  /** Die Kacheln (`<li>`), auf dem Server gerendert. */
  children: ReactNode;
  /** ID der Überschrift, die die Liste benennt. */
  labelledBy: string;
  controls: { prev: string; next: string };
}

/**
 * Produkte als Slider wie im Einblick und bei den Kundenstimmen: Kacheln zwischen Haarlinien, Wischen mit
 * Einrasten, Fortschrittslinie und Pfeil-Knöpfe.
 */
export function ProductSlider({ children, labelledBy, controls }: ProductSliderProps) {
  const { trackRef, thumbRef, atStart, atEnd, step } = useSnapSlider();

  return (
    <>
      <ul
        ref={trackRef}
        aria-labelledby={labelledBy}
        /* ohne Links in den Kacheln: per Tastatur fokussierbar, damit die Pfeiltasten blättern */
        tabIndex={0}
        /* waagrechtes Wischen (Trackpad) gehört dem Slider, nicht dem Smooth Scrolling der Seite */
        data-lenis-prevent-horizontal
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
