'use client';

import { useEffect, useState } from 'react';

/** Ab hier bekommt der Header seine Fläche (Blur + Haarlinie). */
const SCROLLED_AT = 40;
/** Erst unterhalb dieser Tiefe darf er sich beim Runterscrollen verstecken. */
const HIDE_AFTER = 600;
/** Mindest-Scrollweg, bevor eine Richtungsänderung zählt (filtert Lenis-Ausläufer & Trackpad-Zittern). */
const DIRECTION_THRESHOLD = 8;

export interface HeaderScrollState {
  /** Seite ist über die Hero-Oberkante hinaus gescrollt. */
  scrolled: boolean;
  /** Nutzer scrollt nach unten (und ist tief genug) – Header weicht aus. */
  hidden: boolean;
}

/** Scroll-Zustand des Headers – rAF-gedrosselt, passive Listener, nur bei Änderung ein Re-Render. */
export function useHeaderScroll(): HeaderScrollState {
  const [state, setState] = useState<HeaderScrollState>({ scrolled: false, hidden: false });

  useEffect(() => {
    let anchorY = window.scrollY;
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      const delta = y - anchorY;

      setState((prev) => {
        const scrolled = y > SCROLLED_AT;
        let hidden = prev.hidden;
        if (y <= HIDE_AFTER) hidden = false;
        else if (delta > DIRECTION_THRESHOLD) hidden = true;
        else if (delta < -DIRECTION_THRESHOLD) hidden = false;
        return prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden };
      });

      if (Math.abs(delta) > DIRECTION_THRESHOLD || y <= HIDE_AFTER) anchorY = y;
    };

    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return state;
}
