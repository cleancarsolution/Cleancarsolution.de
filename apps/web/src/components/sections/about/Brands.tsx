import { cn } from '@/lib/cn';

/** Ruhige Typo-Zeile mit den Produktmarken als Text-Wortmarken (keine Logos). */
export function Brands({ label, brands, className }: { label: string; brands: readonly string[]; className?: string }) {
  return (
    <div className={cn('flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between', className)}>
      <p className="text-sm text-fg-subtle">{label}</p>
      <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-10" aria-label="Produktmarken">
        {brands.map((brand, i) => (
          <li
            key={brand}
            className="flex items-center gap-x-6 text-[1.0625rem] font-semibold tracking-[0.14em] text-fg/75 uppercase font-wide sm:gap-x-10 sm:text-lg"
          >
            {/* Trennstrich erst ab sm – mobil könnte er sonst eine umbrochene Zeile eröffnen */}
            {i > 0 ? <span aria-hidden className="hidden h-3.5 w-px bg-line-strong sm:block" /> : null}
            {brand}
          </li>
        ))}
      </ul>
    </div>
  );
}
