'use client';

import { motion } from 'motion/react';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * „Hier sind Sie“-Licht: kleiner Sky-Punkt vor dem Nav-Eintrag der Sektion, die gerade gelesen wird.
 * Wandert per Layout-Animation (transform) von Eintrag zu Eintrag.
 */
export function NavDot() {
  return (
    <motion.span
      aria-hidden
      layoutId="header-nav-dot"
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
      className="pointer-events-none absolute top-[calc(50%-2px)] -left-2.5 size-1 rounded-full bg-sky"
    />
  );
}
