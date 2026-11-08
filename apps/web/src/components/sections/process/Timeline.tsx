'use client';

import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef, useState } from 'react';
import { cn } from '@/lib/cn';

interface Step {
  index: string;
  title: string;
  text: string;
}

/** Zeitleiste: Desktop horizontal, Mobile vertikal – Fortschritt folgt der Scrollposition. */
export function Timeline({ steps, className }: { steps: readonly Step[]; className?: string }) {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 78%', 'end 60%'] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [reached, setReached] = useState(0);

  useMotionValueEvent(scrollYProgress, 'change', (value) => {
    // Station gilt als erreicht, sobald die Linie ihren Punkt passiert
    setReached(Math.min(steps.length, Math.floor(value * (steps.length - 1) + 1.02)));
  });

  const lit = reduce ? steps.length : reached;

  return (
    <ol ref={ref} className={cn('relative grid gap-14 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-0', className)}>
      {/* Linie – Desktop */}
      <div aria-hidden className="absolute top-[0.4375rem] right-0 left-0 hidden h-px bg-line-strong lg:block">
        <motion.div className="h-full origin-left bg-gradient-to-r from-sky to-royal-400" style={{ scaleX: reduce ? 1 : fill }} />
      </div>
      {/* Linie – Mobile */}
      <div aria-hidden className="absolute top-2 bottom-2 left-[0.4375rem] w-px bg-line-strong lg:hidden">
        <motion.div className="h-full w-full origin-top bg-gradient-to-b from-sky to-royal-400" style={{ scaleY: reduce ? 1 : fill }} />
      </div>

      {steps.map((step, i) => {
        const active = i < lit;
        return (
          // ab lg ein gemeinsames Zeilenraster (Subgrid): Nummern, Titel und Texte stehen spaltenübergreifend auf einer Höhe
          <li key={step.index} className="relative pl-11 lg:row-span-3 lg:grid lg:grid-rows-subgrid lg:pt-14 lg:pl-0">
            <span
              aria-hidden
              className={cn(
                'absolute top-0 left-0 size-[0.9375rem] rounded-full border transition-[background-color,border-color,box-shadow] duration-500 ease-out-quint',
                active ? 'border-sky bg-sky shadow-[0_0_0_6px_rgb(38_171_246/0.14)]' : 'border-line-strong bg-ink-900',
              )}
            />
            <span
              aria-hidden
              className={cn(
                'block font-mono text-5xl leading-none font-light tracking-[-0.04em] tabular transition-colors duration-700 ease-out-quint lg:text-6xl',
                active ? 'text-fg' : 'text-fg-subtle/45',
              )}
            >
              {step.index}
            </span>
            <h3 className="mt-6 text-display-sm font-medium text-balance">
              <span className="sr-only">Schritt {step.index}: </span>
              {step.title}
            </h3>
            <p className="mt-3 max-w-[34ch] leading-relaxed text-balance text-fg-muted">{step.text}</p>
          </li>
        );
      })}
    </ol>
  );
}
