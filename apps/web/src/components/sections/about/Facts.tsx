import { Reveal } from '@/components/ui/Reveal';
import { cn } from '@/lib/cn';

interface Fact {
  value: string;
  label: string;
}

/** „ab 89 €“ → { pre: 'ab', num: '89', post: '€' } – Zahl groß, Einheit klein. */
function splitValue(value: string) {
  const match = /^(\D*?)\s*(\d[\d.,]*)\s*(.*)$/.exec(value);
  if (!match) return { pre: '', num: value, post: '' };
  return { pre: match[1] ?? '', num: match[2] ?? value, post: match[3] ?? '' };
}

/**
 * Datenblatt-Zeile unter dem Studio-Bild: große tabellarische Werte, kleine Labels,
 * statisches Haarlinien-Raster (nur die Inhalte gleiten ein).
 */
export function Facts({ facts, className }: { facts: readonly Fact[]; className?: string }) {
  return (
    <dl className={cn('grid grid-cols-2 border-b border-line lg:grid-cols-4', className)}>
      {facts.map((fact, i) => {
        const { pre, num, post } = splitValue(fact.value);
        return (
          <div
            key={fact.label}
            className={cn(
              'flex flex-col-reverse justify-end gap-4 border-line py-8 sm:py-10 lg:py-12',
              // Haarlinien: mobil 2 Spalten, ab lg 4 Spalten
              i % 2 === 1 ? 'border-l pl-5 sm:pl-8' : 'pr-5',
              i >= 2 && 'border-t lg:border-t-0',
              'lg:border-l lg:px-8 xl:px-10',
              i === 0 && 'lg:border-l-0 lg:pl-0 xl:pl-0',
            )}
          >
            <dt className="max-w-[18ch] text-sm leading-snug text-fg-muted">
              <Reveal delay={0.1 + i * 0.07} y={10}>
                {fact.label}
              </Reveal>
            </dt>
            <dd>
              <Reveal
                delay={i * 0.07}
                y={22}
                className="flex items-baseline font-normal tracking-[-0.045em] text-fg font-wide"
              >
                {pre ? (
                  <span className="mr-[0.4em] text-[clamp(0.9375rem,0.8rem+0.4vw,1.125rem)] font-normal tracking-normal text-fg-subtle">
                    {pre}
                  </span>
                ) : null}
                <span className="text-[clamp(2.75rem,1.6rem+3.4vw,4.75rem)] leading-none">{num}</span>
                {post ? (
                  <span className="ml-[0.18em] text-[clamp(1.125rem,0.9rem+0.8vw,1.625rem)] leading-none font-normal tracking-normal text-sky-400">
                    {post}
                  </span>
                ) : null}
              </Reveal>
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
