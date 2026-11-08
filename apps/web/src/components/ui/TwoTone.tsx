import { cn } from '@/lib/cn';

interface TwoToneProps {
  /** Obere Zeile (Akzent), z. B. „Polster & Leder“. */
  top: string;
  /** Untere Zeile (Hauptwort), z. B. „Reinigung“. */
  bottom: string;
  size?: 'sm' | 'md' | 'lg';
  /** Auf hellen Flächen: Royal + Navy statt Sky + Weiß. */
  onLight?: boolean;
  as?: 'span' | 'h3' | 'h4' | 'p' | 'div';
  className?: string;
}

const sizes = {
  sm: { top: 'text-[0.6875rem]', bottom: 'text-[0.9375rem]' },
  md: { top: 'text-[0.8125rem] sm:text-sm', bottom: 'text-xl sm:text-2xl' },
  lg: { top: 'text-sm sm:text-base', bottom: 'text-3xl sm:text-4xl lg:text-5xl' },
} as const;

/**
 * Die zweizeilige Signatur-Typografie der Banner:
 *   POLSTER & LEDER   ← Sky, leicht
 *   REINIGUNG         ← Weiß, kräftig
 */
export function TwoTone({ top, bottom, size = 'md', onLight, as: Tag = 'span', className }: TwoToneProps) {
  return (
    <Tag className={cn('flex flex-col uppercase', className)}>
      <span
        className={cn(
          'font-normal tracking-[0.14em] font-expanded',
          sizes[size].top,
          onLight ? 'text-royal' : 'text-sky-400',
        )}
      >
        {top}
      </span>
      <span
        className={cn(
          'mt-1 leading-none font-medium tracking-[0.02em] font-wide',
          sizes[size].bottom,
          onLight ? 'text-navy' : 'text-fg',
        )}
      >
        {bottom}
      </span>
    </Tag>
  );
}
