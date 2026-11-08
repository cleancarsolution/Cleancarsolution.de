'use client';

import { ArrowRight } from '@/components/ui/icons';
import { scrollToTop } from '@/lib/scroll';

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={scrollToTop}
      className="group inline-flex items-center gap-2.5 text-sm whitespace-nowrap text-fg-muted transition-colors duration-300 hover:text-fg"
    >
      Nach oben
      <span className="grid size-9 place-items-center rounded-full border border-line-strong transition-[border-color,background-color] duration-300 group-hover:border-sky/60 group-hover:bg-sky/[0.06]">
        <ArrowRight aria-hidden className="size-4 -rotate-90 transition-transform duration-300 ease-out-quint group-hover:-translate-y-0.5" />
      </span>
    </button>
  );
}
