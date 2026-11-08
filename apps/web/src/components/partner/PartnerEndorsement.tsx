import { Eyebrow } from '@/components/ui/Eyebrow';
import { ArrowUpRight } from '@/components/ui/icons';
import { contact } from '@/content/contact';
import { partner } from '@/content/partner';
import { cn } from '@/lib/cn';
import { PartnerLogoAnimated } from './PartnerLogoAnimated';
import { PartnerServices } from './PartnerServices';

/**
 * Inhouse-Partner PKW-Schmiede im Footer – eine ruhige Empfehlung statt Werbefläche: schwarze Karte mit
 * Haarlinien, links das Logo, in der Mitte, was Besucher dort bekommen (Service, Reparatur, Wartung +
 * Leistungen), rechts der Weg zur Website (neuer Tab). Die ganze Karte ist klickbar (gestreckter Link).
 * Hover/Fokus: Rahmen hellt auf, oben läuft die Lichtkante im Wellen-Verlauf ein, das Zahnrad rückt einen
 * Zahn weiter, der Pfeil wandert nach rechts oben.
 */
export function PartnerEndorsement({ className }: { className?: string }) {
  return (
    <aside
      aria-labelledby="footer-partner-title"
      data-partner-card
      className={cn(
        'group/partner relative border border-line-strong transition-[border-color] duration-500 ease-out-quint',
        'hover:border-white/30 has-[a:focus-visible]:border-white/30',
        className,
      )}
    >
      {/* Lichtkante: läuft beim Hover von links ein (wie die Unterstreichung der Navigation) */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px origin-left scale-x-0 hairline-wave transition-transform duration-700 ease-out-expo group-hover/partner:scale-x-100 group-has-[a:focus-visible]/partner:scale-x-100"
      />

      <div className="grid lg:grid-cols-12">
        <div className="flex items-center px-6 pt-7 pb-6 sm:px-8 sm:pt-9 lg:col-span-3 lg:p-10">
          <PartnerLogoAnimated spin={false} className="h-14 sm:h-16 xl:h-[4.5rem]" />
        </div>

        <div className="border-t border-line px-6 py-7 sm:px-8 sm:py-9 lg:col-span-6 lg:border-t-0 lg:border-l lg:p-10">
          <Eyebrow sparkle>{partner.label}</Eyebrow>
          <h2
            id="footer-partner-title"
            className="mt-5 text-[1.25rem] leading-snug font-medium tracking-[-0.015em] text-balance sm:text-[1.375rem]"
          >
            <span className="sr-only">{partner.name}: </span>
            {partner.tagline}
          </h2>
          <p className="mt-3 max-w-[56ch] text-[0.9375rem] leading-relaxed text-fg-muted">{partner.text}</p>
          <PartnerServices items={partner.highlights} label={`Leistungen der ${partner.name}`} className="mt-6" />
        </div>

        <div className="flex items-center justify-between gap-6 border-t border-line px-6 py-5 sm:px-8 sm:py-6 lg:col-span-3 lg:flex-col-reverse lg:items-start lg:justify-between lg:border-t-0 lg:border-l lg:p-10">
          <a
            href={partner.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col gap-1.5 rounded-sm outline-offset-4 after:absolute after:inset-0"
          >
            <span className="text-[0.9375rem] font-medium text-fg">{partner.visitLabel}</span>
            <span className="font-mono text-[0.75rem] tracking-[0.06em] text-fg-subtle transition-colors duration-300 ease-out-quint group-hover/partner:text-fg-muted">
              {partner.hrefLabel}
            </span>
            <span className="sr-only">{contact.form.newTab}</span>
          </a>
          <span
            aria-hidden
            className="grid size-11 shrink-0 place-items-center rounded-full border border-white/25 text-fg transition-[background-color,border-color,color] duration-300 ease-out-quint group-hover/partner:border-fg group-hover/partner:bg-fg group-hover/partner:text-ink-950 lg:self-end"
          >
            <ArrowUpRight className="size-[1.125rem] transition-transform duration-500 ease-out-expo group-hover/partner:translate-x-0.5 group-hover/partner:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </aside>
  );
}
