'use client';

import { useEffect, useState } from 'react';

/** Lesekante: die Sektion, die diese Höhe (Anteil des Viewports) schneidet, gilt als aktiv. */
const READING_LINE = 0.42;

/**
 * Liefert die ID der Sektion, die gerade gelesen wird – aber nur, wenn sie zur Navigation gehört.
 * Liegt die Lesekante in einer Sektion ohne Nav-Eintrag (Hygiene, Einblick, Kontakt …), ist nichts aktiv.
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');

  useEffect(() => {
    const wanted = new Set(key.split('|'));
    let frame = 0;

    const update = () => {
      frame = 0;
      const line = window.innerHeight * READING_LINE;
      let current: string | null = null;
      for (const section of document.querySelectorAll<HTMLElement>('main section[id]')) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) {
          current = section.id;
          break;
        }
      }
      const next = current && wanted.has(current) ? current : null;
      setActive((prev) => (prev === next ? prev : next));
    };

    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    return () => {
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [key]);

  return active;
}
