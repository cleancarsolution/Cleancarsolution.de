'use client';

import { useId, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionProps {
  items: readonly FaqItem[];
  /** Index der anfangs geöffneten Frage (`null` = alle zu). */
  defaultOpen?: number | null;
  className?: string;
}

/**
 * Akkordeon (WAI-ARIA Accordion Pattern): immer höchstens eine Antwort offen.
 * Signatur: Beim Öffnen fährt Licht in Markenverlauf (Navy → Royal → Sky) über die Kante der Frage.
 * Höhe über den grid-rows-Trick (0fr → 1fr), Inhalt blendet per opacity/transform ein.
 * Tastatur: Enter/Leertaste öffnen, Pfeil ↑/↓ sowie Pos1/Ende springen zwischen den Fragen.
 */
export function FaqAccordion({ items, defaultOpen = 0, className }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(defaultOpen);
  const baseId = useId();
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);

  const focusButton = (index: number) => buttons.current[index]?.focus();

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const last = items.length - 1;
    const targets: Partial<Record<string, number>> = {
      ArrowDown: index === last ? 0 : index + 1,
      ArrowUp: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    focusButton(target);
  };

  return (
    <div className={cn('border-b border-line-paper', className)}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-frage-${index}`;
        const panelId = `${baseId}-antwort-${index}`;
        const number = String(index + 1).padStart(2, '0');

        return (
          <div key={item.question} className="relative border-t border-line-paper">
            {/* Lichtkante: zeichnet sich beim Öffnen von links nach rechts */}
            <span
              aria-hidden
              className={cn(
                'pointer-events-none absolute inset-x-0 -top-px h-[1.5px] origin-left bg-wave transition-transform duration-[900ms] ease-out-expo',
                isOpen ? 'scale-x-100' : 'scale-x-0',
              )}
            />
            <h3>
              <button
                ref={(element) => {
                  buttons.current[index] = element;
                }}
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                onKeyDown={(event) => onKeyDown(event, index)}
                className="group grid w-full cursor-pointer grid-cols-[2.25rem_minmax(0,1fr)_auto] items-start gap-x-3 rounded-sm py-6 text-left focus-visible:outline-royal sm:grid-cols-[3.5rem_minmax(0,1fr)_auto] sm:gap-x-4 sm:py-8"
              >
                <span
                  className={cn(
                    'pt-[0.4rem] font-mono text-[0.8125rem] tracking-normal tabular transition-colors duration-300 sm:pt-[0.55rem]',
                    isOpen ? 'text-royal' : 'text-paper-muted group-hover:text-navy',
                  )}
                >
                  {number}
                </span>
                <span
                  className={cn(
                    'text-[1.1875rem] leading-[1.3] font-medium tracking-[-0.02em] text-balance transition-colors duration-300 sm:text-2xl lg:text-[1.625rem]',
                    isOpen ? 'text-navy' : 'text-navy/90 group-hover:text-royal',
                  )}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden
                  className={cn(
                    'relative ml-2 grid size-10 shrink-0 place-items-center rounded-full border transition-[background-color,border-color,color] duration-300 ease-out-quint sm:ml-4 sm:size-11',
                    isOpen
                      ? 'border-navy bg-navy text-white'
                      : 'border-line-paper text-navy group-hover:border-navy/40 group-hover:bg-white',
                  )}
                >
                  <PlusMinus open={isOpen} />
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              inert={!isOpen}
              className={cn(
                'grid transition-[grid-template-rows] duration-500 ease-out-quint',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden">
                <div className="pr-12 pb-8 pl-[3rem] sm:pr-20 sm:pb-10 sm:pl-[4.5rem]">
                  <p
                    className={cn(
                      'max-w-[58ch] text-base leading-relaxed text-paper-muted transition-[opacity,translate] duration-500 ease-out-quint sm:text-[1.0625rem]',
                      isOpen ? 'translate-y-0 opacity-100 delay-100' : '-translate-y-2 opacity-0',
                    )}
                  >
                    {item.answer}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/** Plus, das sich beim Öffnen per halber Drehung in ein Minus verwandelt. */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      className={cn(
        'relative block size-3.5 transition-transform duration-500 ease-out-expo',
        open ? 'rotate-180' : 'rotate-0',
      )}
    >
      <span className="absolute inset-x-0 top-1/2 h-[1.5px] -translate-y-1/2 rounded-full bg-current" />
      <span
        className={cn(
          'absolute inset-y-0 left-1/2 w-[1.5px] -translate-x-1/2 rounded-full bg-current transition-transform duration-500 ease-out-expo',
          open ? 'rotate-90' : 'rotate-0',
        )}
      />
    </span>
  );
}
