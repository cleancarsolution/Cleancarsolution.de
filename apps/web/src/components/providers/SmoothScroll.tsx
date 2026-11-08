'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { registerLenis, scrollToElement } from '@/lib/scroll';

/**
 * Smooth Scrolling (Lenis) + weiches Scrollen für alle Anker-Links (`#id` und `/#id`).
 * Bei „Bewegung reduzieren“ bleibt natives Scrollen aktiv.
 */
export function SmoothScroll() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let lenis: Lenis | null = null;

    const start = () => {
      if (lenis || reducedMotion.matches) return;
      lenis = new Lenis({ lerp: 0.11, smoothWheel: true, autoRaf: true });
      registerLenis(lenis);
    };
    const stop = () => {
      lenis?.destroy();
      lenis = null;
      registerLenis(null);
    };
    const onMotionChange = () => (reducedMotion.matches ? stop() : start());

    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.('a[href]');
      if (!(anchor instanceof HTMLAnchorElement) || anchor.target === '_blank') return;

      const href = anchor.getAttribute('href') ?? '';
      const match = /^\/?#([\w-]+)$/.exec(href);
      if (!match?.[1]) return;
      // `/#id` von einer Unterseite aus → normal zur Startseite navigieren
      if (href.startsWith('/') && window.location.pathname !== '/') return;

      const id = match[1];
      const target = document.getElementById(id);
      if (!target) return;

      event.preventDefault();
      scrollToElement(target);
      if (id === 'main') target.focus({ preventScroll: true });
      if (window.location.hash !== `#${id}`) window.history.pushState(null, '', `#${id}`);
    };

    start();
    reducedMotion.addEventListener('change', onMotionChange);
    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      reducedMotion.removeEventListener('change', onMotionChange);
      stop();
    };
  }, []);

  return null;
}
