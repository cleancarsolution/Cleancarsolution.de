import { SmartLink } from '@/components/ui/SmartLink';
import { cn } from '@/lib/cn';

interface ScrollCueProps {
  label: string;
  srLabel: string;
  href: string;
  className?: string;
}

/** „Scrollen“ mit Lichtfaden, der von oben nach unten durch die Haarlinie läuft. */
export function ScrollCue({ label, srLabel, href, className }: ScrollCueProps) {
  return (
    <SmartLink
      href={href}
      className={cn(
        'group/cue inline-flex items-center gap-3.5 rounded-sm text-eyebrow font-medium text-fg-muted uppercase font-expanded transition-colors duration-300 hover:text-fg',
        className,
      )}
    >
      <span aria-hidden className="relative h-9 w-px overflow-hidden bg-white/15">
        <span className="absolute inset-0 bg-sky animate-scroll-cue motion-reduce:animate-none motion-reduce:opacity-0" />
      </span>
      <span>
        {label}
        <span className="sr-only"> – {srLabel}</span>
      </span>
    </SmartLink>
  );
}
