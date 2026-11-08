import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/** tailwind-merge kennt unsere eigenen Tokens – sonst würde z. B. `text-display-xl` als Farbe gelten. */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ['display-2xl', 'display-xl', 'display-lg', 'display-md', 'display-sm', 'lead', 'eyebrow'],
      ease: ['out-expo', 'out-quint', 'in-out-quart'],
      animate: ['marquee', 'sparkle', 'scroll-cue', 'sheen'],
    },
  },
});

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
