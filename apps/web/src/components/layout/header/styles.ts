/**
 * Gemeinsame Klassen der Header-Navigation.
 * Hover: feine Unterstreichung, die von links einläuft und nach rechts ausläuft („Lichtkante“).
 */
export const navItemClass = [
  'group/nav relative inline-flex h-full items-center gap-1.5 rounded-sm px-1 text-[0.9375rem] tracking-[-0.005em] whitespace-nowrap',
  'text-fg/75 transition-colors duration-300 ease-out-quint hover:text-fg aria-expanded:text-fg',
  'cursor-pointer outline-offset-4',
].join(' ');

/** Unterstreichung als eigenes Element (unter dem Label, nicht unter dem Chevron). */
export const navUnderlineClass = [
  'pointer-events-none absolute inset-x-1 bottom-[calc(50%-0.95rem)] h-px origin-right scale-x-0 bg-current',
  'transition-transform duration-500 ease-out-expo',
  'group-hover/nav:origin-left group-hover/nav:scale-x-100 group-focus-visible/nav:origin-left group-focus-visible/nav:scale-x-100',
].join(' ');
