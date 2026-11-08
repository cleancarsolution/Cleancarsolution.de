'use client';

import { useInView } from 'motion/react';
import { useRef, type CSSProperties } from 'react';
import { Star } from '@/components/ui/icons';
import { cn } from '@/lib/cn';
import styles from './reviews.module.css';

interface RatingLightsProps {
  /** Note 0 … 5 (eine Nachkommastelle) – Bruchteile leuchten anteilig. */
  rating: number;
  className?: string;
}

/**
 * Die fünf Sterne der Gesamtnote. Sobald sie ins Bild kommen, schalten sie sich nacheinander ein (`data-lit`,
 * einmalig); die Choreografie liegt in `reviews.module.css`. Rein dekorativ – die Note steht als Text daneben.
 */
export function RatingLights({ rating, className }: RatingLightsProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const lit = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });

  return (
    <span
      ref={ref}
      aria-hidden
      data-lit={lit}
      className={cn('inline-flex gap-1.5', styles.lights, className)}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={styles.star}
          style={{ '--i': i, '--fill': Math.min(1, Math.max(0, rating - i)) } as CSSProperties}
        >
          <Star className={styles.off} />
          <Star className={styles.on} />
        </span>
      ))}
    </span>
  );
}
