'use client';

import { motion, useReducedMotion } from 'motion/react';
import type { ReactNode } from 'react';
import { DURATION, EASE_OUT_EXPO } from '@/lib/motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Start-Versatz in px (nach oben gleitend). */
  y?: number;
  /** Anteil, der sichtbar sein muss, bevor animiert wird. */
  amount?: number;
  duration?: number;
}

/** Block-Reveal beim Hineinscrollen (einmalig). Bei „Bewegung reduzieren“ nur Einblenden. */
export function Reveal({ children, className, delay = 0, y = 28, amount = 0.25, duration = DURATION.slow }: RevealProps) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      data-reveal
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, delay, ease: EASE_OUT_EXPO }}
    >
      {children}
    </motion.div>
  );
}
