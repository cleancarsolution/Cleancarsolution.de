'use client';

import { motion, useTransform } from 'motion/react';
import type { ReactNode } from 'react';
import { useHero } from './HeroStage';

interface DriftProps {
  children: ReactNode;
  /** Weg nach oben (px) über die volle Scroll-Strecke des Hero. */
  distance?: number;
  /** Bei diesem Fortschritt ist die Ebene ausgeblendet (`null` = nicht ausblenden). */
  fadeOutAt?: number | null;
  className?: string;
}

/** Scroll-gekoppelte Ebene im Hero: gleitet beim Herausscrollen nach oben und blendet aus. */
export function Drift({ children, distance = 140, fadeOutAt = 0.6, className }: DriftProps) {
  const { progress, reduceMotion } = useHero();
  const y = useTransform(progress, [0, 1], [0, reduceMotion ? 0 : -distance]);
  const opacity = useTransform(progress, [0, fadeOutAt ?? 1], [1, fadeOutAt === null ? 1 : 0]);
  return (
    <motion.div style={{ y, opacity }} className={className}>
      {children}
    </motion.div>
  );
}

/** Abdunklung, die beim Herausscrollen zunimmt – das Bild „geht ins Studio-Dunkel zurück“. */
export function ScrollDim({ className }: { className?: string }) {
  const { progress } = useHero();
  const opacity = useTransform(progress, [0, 0.85], [0, 0.72]);
  return <motion.div aria-hidden style={{ opacity }} className={className} />;
}
