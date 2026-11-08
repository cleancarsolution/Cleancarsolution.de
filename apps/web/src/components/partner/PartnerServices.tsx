import { cn } from '@/lib/cn';

const sizes = {
  sm: { list: '-ml-[calc(0.625rem+1px)] gap-y-2', item: 'px-2.5 text-[0.625rem]' },
  md: { list: '-ml-[calc(0.875rem+1px)] gap-y-3', item: 'px-3.5 text-[0.75rem] sm:text-[0.8125rem]' },
} as const;

interface PartnerServicesProps {
  items: readonly string[];
  size?: keyof typeof sizes;
  /** Name der Liste für Screenreader (entfällt, wenn ein umgebender Link schon benannt ist). */
  label?: string;
  className?: string;
}

/**
 * Leistungen wie auf dem Werkstatt-Plakat der PKW-Schmiede: Versalien, getrennt von senkrechten Strichen.
 * Der Strich am Zeilenanfang wird weggeschnitten (negativer Versatz + overflow-hidden) –
 * umbrochene Zeilen beginnen bündig.
 */
export function PartnerServices({ items, size = 'md', label, className }: PartnerServicesProps) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <ul aria-label={label} className={cn('flex flex-wrap', sizes[size].list)}>
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              'border-l border-white/25 leading-[1.25] font-medium tracking-[0.14em] text-fg/90 uppercase font-expanded',
              sizes[size].item,
            )}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
