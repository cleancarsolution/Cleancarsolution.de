import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';

interface Pillar {
  index: string;
  title: string;
  text: string;
}

/**
 * Der Claim „Erfahrung. Vertrauen. Exzellenz.“ als drei haarliniengetrennte Spalten –
 * horizontal gelesen ergibt sich der Claim. Beim Hover läuft eine Sky-Lichtkante über die Spalte.
 */
export function Pillars({ pillars, className }: { pillars: readonly Pillar[]; className?: string }) {
  return (
    <ol className={cn('grid border-t border-line lg:grid-cols-3', className)}>
      {pillars.map((pillar, i) => (
        <li
          key={pillar.index}
          className="group relative border-b border-line lg:border-b-0 lg:border-l lg:first:border-l-0"
        >
          <span
            aria-hidden
            className="absolute -top-px left-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-sky via-sky/70 to-transparent transition-transform duration-700 ease-out-expo group-hover:scale-x-100"
          />
          <Reveal
            delay={i * 0.08}
            className="grid grid-cols-[3.25rem_1fr] py-9 sm:grid-cols-[5rem_1fr] sm:py-11 lg:block lg:px-10 lg:pt-10 lg:pb-4 lg:group-first:pl-0 xl:px-14"
          >
            <span className="pt-2 font-mono text-xs text-sky-400 tabular lg:block lg:pt-0">{pillar.index}</span>
            <div>
              <h3 className="text-display-sm font-medium lg:mt-14 lg:text-[clamp(2rem,1rem+1.6vw,2.75rem)]">
                {pillar.title}
                <span className="text-sky-400">.</span>
              </h3>
              <p className="mt-4 max-w-[36ch] text-[0.9375rem] leading-relaxed text-fg-muted lg:mt-5">{pillar.text}</p>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
