import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Sparkle } from './Sparkle';

interface EyebrowProps {
  children: ReactNode;
  /** Optionale Nummer, z. B. „02“ – wird in Mono vorangestellt. */
  index?: string;
  tone?: 'sky' | 'muted' | 'navy';
  /** Funkel-Stern statt Nummer. */
  sparkle?: boolean;
  as?: 'p' | 'span' | 'div';
  className?: string;
}

const tones = {
  sky: 'text-sky-400',
  muted: 'text-fg-muted',
  navy: 'text-royal',
} as const;

/** Breites Versal-Label im Banner-Stil: „02 — LEISTUNGEN“. */
export function Eyebrow({ children, index, tone = 'sky', sparkle, as: Tag = 'p', className }: EyebrowProps) {
  return (
    <Tag className={cn('flex items-center gap-3 text-eyebrow font-medium uppercase font-expanded', tones[tone], className)}>
      {index ? (
        <>
          <span className="font-mono tracking-normal tabular opacity-80">{index}</span>
          <span aria-hidden className="h-px w-6 bg-current opacity-40" />
        </>
      ) : null}
      {sparkle ? <Sparkle className="size-2.5" /> : null}
      <span>{children}</span>
    </Tag>
  );
}
