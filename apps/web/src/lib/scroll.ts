import type Lenis from 'lenis';

/**
 * Zentrale Scroll-Steuerung. Lenis (Smooth Scrolling) wird in `SmoothScroll` registriert;
 * ohne Lenis (z. B. bei „Bewegung reduzieren“) wird auf natives Scrollen zurückgefallen.
 */

let lenis: Lenis | null = null;

/** Höhe, um die Anker-Ziele unter dem fixierten Header landen. */
export const HEADER_OFFSET = 88;

export function registerLenis(instance: Lenis | null): void {
  lenis = instance;
}

export function getLenis(): Lenis | null {
  return lenis;
}

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollToElement(target: HTMLElement, offset = HEADER_OFFSET): void {
  if (lenis) {
    lenis.scrollTo(target, { offset: -offset, duration: 1.4 });
    return;
  }
  const top = target.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

export function scrollToId(id: string, offset = HEADER_OFFSET): boolean {
  const target = document.getElementById(id);
  if (!target) return false;
  scrollToElement(target, offset);
  return true;
}

export function scrollToTop(): void {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}

/** Für Overlays (Mobile-Menü): Hintergrund-Scrollen sperren/freigeben. */
export function lockScroll(): void {
  lenis?.stop();
  document.documentElement.style.overflow = 'hidden';
}

export function unlockScroll(): void {
  document.documentElement.style.overflow = '';
  lenis?.start();
}
