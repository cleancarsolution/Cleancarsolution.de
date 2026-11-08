import type { SVGProps } from 'react';
import { cn } from '@/lib/cn';

/** Vierzackiger Funkel-Stern aus dem Logo – Mikro-Ornament, sparsam einsetzen. */
export function Sparkle({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={cn('size-3', className)} {...props}>
      <path d="M12 0c.55 6.4 5.6 11.45 12 12-6.4.55-11.45 5.6-12 12-.55-6.4-5.6-11.45-12-12C6.4 11.45 11.45 6.4 12 0Z" />
    </svg>
  );
}
