'use client';

import { motion, useInView, useReducedMotion } from 'motion/react';
import { useRef } from 'react';
import { cn } from '@/lib/cn';
import { DURATION, EASE_OUT_EXPO, STAGGER } from '@/lib/motion';

interface RevealTextProps {
  /** Text, der Wort für Wort aus einer Maske gleitet. */
  text: string;
  className?: string;
  /** Klassen pro Wort (z. B. für Farbakzente). */
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  /** Sofort beim Mount statt beim Hineinscrollen (z. B. Hero). */
  immediate?: boolean;
}

/**
 * Headline-Reveal: jedes Wort gleitet aus einer eigenen Maske nach oben.
 * Rendert Inline-Spans – in ein <h1>/<h2> o. Ä. einsetzen.
 */
export function RevealText({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = STAGGER,
  immediate = false,
}: RevealTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const show = immediate || inView;
  const words = text.split(' ');

  return (
    <span ref={ref} className={cn('inline', className)}>
      {words.map((word, i) => (
        <span key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em] align-bottom">
            <motion.span
              data-reveal
              className={cn('inline-block will-change-transform', wordClassName)}
              initial={reduce ? { opacity: 0 } : { y: '110%' }}
              animate={show ? (reduce ? { opacity: 1 } : { y: '0%' }) : undefined}
              transition={{ duration: DURATION.slower, delay: delay + i * stagger, ease: EASE_OUT_EXPO }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </span>
  );
}
