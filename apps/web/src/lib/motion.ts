/** Gemeinsame Bewegungs-Konstanten – identisch zu den CSS-Tokens in globals.css. */

type Bezier = [number, number, number, number];

export const EASE_OUT_EXPO: Bezier = [0.16, 1, 0.3, 1];
export const EASE_OUT_QUINT: Bezier = [0.22, 1, 0.36, 1];
export const EASE_IN_OUT_QUART: Bezier = [0.76, 0, 0.24, 1];

export const DURATION = {
  /** Hover, kleine UI-Wechsel */
  fast: 0.25,
  /** Menüs, Accordions */
  base: 0.5,
  /** Reveals von Blöcken */
  slow: 0.9,
  /** Große Headlines, Bilder */
  slower: 1.2,
} as const;

/** Standard-Versatz zwischen gestaffelten Elementen. */
export const STAGGER = 0.07;
