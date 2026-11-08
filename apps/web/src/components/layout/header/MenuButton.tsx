'use client';

import type { Ref } from 'react';
import { mobileMenu } from '@/content/navigation';
import { cn } from '@/lib/cn';

interface MenuButtonProps {
  open: boolean;
  controls: string;
  onToggle: () => void;
  ref?: Ref<HTMLButtonElement>;
  className?: string;
}

/** Burger (Mobil/Tablet): zwei Linien, die sich zum Schließen-Kreuz verwandeln. */
export function MenuButton({ open, controls, onToggle, ref, className }: MenuButtonProps) {
  const line = 'absolute inset-x-0 h-[1.5px] rounded-full bg-fg transition-[translate,rotate,scale] duration-500 ease-out-expo';
  return (
    <button
      ref={ref}
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      aria-label={open ? mobileMenu.closeLabel : mobileMenu.openLabel}
      onClick={onToggle}
      className={cn(
        'relative grid size-11 cursor-pointer place-items-center rounded-full border border-line-strong bg-ink-950/40 transition-[background-color,border-color] duration-200 ease-out-quint hover:border-white/40 hover:bg-white/[0.06]',
        className,
      )}
    >
      <span aria-hidden className="relative block h-3 w-[1.125rem]">
        <span className={cn(line, 'top-0', open && 'translate-y-[5.25px] rotate-45')} />
        <span
          className={cn(
            line,
            'bottom-0',
            open ? '-translate-y-[5.25px] -rotate-45' : 'translate-x-[3.15px] scale-x-[0.65]',
          )}
        />
      </span>
    </button>
  );
}
