'use client';

import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { useMemo, useRef } from 'react';
import { cn } from '@/lib/cn';

type Accent = 'glow' | 'highlight' | undefined;

interface StatementProps {
  text: string;
  /** Wortfolgen, die beim Aufleuchten kurz in Sky glühen und dann weiß werden. */
  glow?: readonly string[];
  /** Wortfolge, die nach dem Aufleuchten in Sky stehen bleibt (Motto). */
  highlight?: string;
  className?: string;
}

/** Breite des „Lichtkegels“ (Anteil am Scroll-Fortschritt), in dem ein Wort aufleuchtet. */
const WINDOW = 0.12;
/** Wie lange (im Fortschritt) ein Markenwort nachglüht. */
const AFTERGLOW = 0.16;
const DIM = 0.16;

function markAccents(words: string[], phrases: readonly string[], accent: Exclude<Accent, undefined>, out: Accent[]) {
  for (const phrase of phrases) {
    const parts = phrase.split(' ');
    for (let i = 0; i <= words.length - parts.length; i++) {
      if (parts.every((part, j) => words[i + j] === part)) {
        for (let j = 0; j < parts.length; j++) out[i + j] = accent;
      }
    }
  }
}

/**
 * Editorialer Absatz, dessen Wörter beim Scrollen nacheinander „ausgeleuchtet“ werden –
 * wie ein Lichtstreifen, der über frischen Lack gleitet. Markenwörter glühen dabei kurz in Sky.
 * Screenreader lesen den Text einmal als Ganzes; bei „Bewegung reduzieren“ ist alles sofort sichtbar.
 */
export function Statement({ text, glow = [], highlight, className }: StatementProps) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] });

  const tokens = useMemo(() => {
    const words = text.split(' ');
    const accents: Accent[] = words.map(() => undefined);
    markAccents(words, glow, 'glow', accents);
    if (highlight) markAccents(words, [highlight], 'highlight', accents);
    const span = Math.max(words.length - 1, 1);
    return words.map((word, i) => {
      const start = (i / span) * (1 - WINDOW);
      return { word, accent: accents[i], start, end: start + WINDOW };
    });
  }, [text, glow, highlight]);

  return (
    <p ref={ref} className={cn('relative', className)}>
      <span className="sr-only">{text}</span>
      <span aria-hidden>
        {tokens.map((token, i) => (
          <span key={`${token.word}-${i}`}>
            <Word {...token} progress={scrollYProgress} reduce={Boolean(reduce)} />
            {i < tokens.length - 1 ? ' ' : null}
          </span>
        ))}
      </span>
    </p>
  );
}

interface WordProps {
  word: string;
  accent: Accent;
  start: number;
  end: number;
  progress: MotionValue<number>;
  reduce: boolean;
}

function Word({ word, accent, start, end, progress, reduce }: WordProps) {
  const opacity = useTransform(progress, [start, end], [DIM, 1]);
  const glow = useTransform(
    progress,
    accent === 'glow' ? [start, end, end + AFTERGLOW] : [start, end],
    accent === 'glow' ? [0, 1, 0] : [0, 1],
  );

  if (reduce) {
    return <span className={accent === 'highlight' ? 'text-sky-300' : undefined}>{word}</span>;
  }

  return (
    <span className="relative inline-block">
      <motion.span data-reveal className="inline-block" style={{ opacity }}>
        {word}
      </motion.span>
      {accent ? (
        <motion.span
          className="absolute inset-0 text-sky-300 [text-shadow:0_0_0.45em_rgb(38_171_246/0.55)]"
          style={{ opacity: glow }}
        >
          {word}
        </motion.span>
      ) : null}
    </span>
  );
}
