import type { CSSProperties } from 'react';
import { cn } from '@/lib/cn';
import styles from './hero.module.css';

interface HeroHeadlineProps {
  lines: readonly string[];
  /** Genau ein Wort mit Verlaufstext (`text-wave`). */
  accent?: string;
  /** Start der Wort-Staffel in Sekunden. */
  delay?: number;
  className?: string;
}

interface Part {
  text: string;
  /** Reihenfolge über alle Zeilen – bestimmt die Staffelung. */
  order: number;
  accent: boolean;
  /** Nach diesem Teil folgt ein Leerzeichen (Wortende, nicht Zeilenende). */
  space: boolean;
}

/**
 * Zerlegt die Zeilen in Wörter und Wörter nach Bindestrichen:
 * „Showroom-Glanz.“ → „Showroom-“ + „Glanz.“ – dort darf auf schmalen Screens umbrochen werden.
 */
function toParts(lines: readonly string[], accent?: string): Part[][] {
  const result: Part[][] = [];
  let order = 0;
  for (const line of lines) {
    const words = line.split(' ');
    const parts: Part[] = [];
    words.forEach((word, wordIndex) => {
      const pieces = word.split(/(?<=-)/);
      const isAccent = accent !== undefined && word.replace(/[.,!?:;]/g, '') === accent;
      pieces.forEach((text, pieceIndex) => {
        parts.push({
          text,
          order: order++,
          accent: isAccent,
          space: pieceIndex === pieces.length - 1 && wordIndex < words.length - 1,
        });
      });
    });
    result.push(parts);
  }
  return result;
}

/**
 * Hero-Headline: Wort für Wort aus Masken (Bewegung wie `RevealText`, aber als CSS-Keyframes,
 * damit sie mit dem ersten Paint startet). Zeilen sind Blöcke; nach Bindestrichen darf umbrochen
 * werden, damit „Showroom-Glanz.“ auf 360 px groß bleiben kann. Rendert Spans (in die <h1> setzen).
 */
export function HeroHeadline({ lines, accent, delay = 0, className }: HeroHeadlineProps) {
  const parsed = toParts(lines, accent);

  return (
    <span className={cn('block', className)} style={{ '--delay': `${delay}s` } as CSSProperties}>
      {parsed.map((parts, lineIndex) => (
        <span key={lines[lineIndex]} className="block">
          {parts.map((part) => (
            <span key={part.order}>
              <span className="-mx-[0.06em] -mb-[0.14em] inline-block overflow-hidden px-[0.06em] pb-[0.14em] align-bottom">
                <span
                  className={cn('inline-block', styles.word, part.accent && 'text-wave')}
                  style={{ '--i': part.order } as CSSProperties}
                >
                  {part.text}
                </span>
              </span>
              {part.space ? ' ' : null}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}
