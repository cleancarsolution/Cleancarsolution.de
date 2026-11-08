import { ArrowUpRight } from '@/components/ui/icons';
import { partner } from '@/content/partner';
import { cn } from '@/lib/cn';
import { PartnerLogoAnimated } from './PartnerLogoAnimated';
import { PartnerServices } from './PartnerServices';

interface PartnerPromoProps {
  /** Wird beim Klick aufgerufen (Menü schließen) – die Website öffnet in neuem Tab. */
  onNavigate?: () => void;
  /** Menü offen → Logo-Auftakt läuft (ohne Angabe: sobald sichtbar). */
  active?: boolean;
  className?: string;
}

/** Enthält die sichtbaren Beschriftungen („Inhouse-Partner“, Claim, „Website besuchen“) – Label in Name (WCAG 2.5.3). */
const linkLabel = `${partner.name} – ${partner.label}: ${partner.tagline} ${partner.visitLabel} (öffnet in neuem Tab)`;

/** Schwarze Karte mit Haarlinie – wie die Partner-Karte im Footer (`PartnerEndorsement`), ohne Schein. */
const surfaceClass =
  'group/partner relative isolate overflow-hidden border border-line-strong bg-ink-950 transition-[border-color] duration-300 ease-out-quint outline-offset-2 hover:border-white/30';

/** Lichtkante oben: läuft beim Überfahren von links ein. */
function TopEdge() {
  return (
    <span
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 h-px origin-left scale-x-0 hairline-wave transition-transform duration-700 ease-out-expo group-hover/partner:scale-x-100"
    />
  );
}

function ExternalArrow({ className }: { className?: string }) {
  return (
    <ArrowUpRight
      aria-hidden
      className={cn(
        'size-4 shrink-0 text-sky-300 transition-transform duration-500 ease-out-expo group-hover/partner:translate-x-0.5 group-hover/partner:-translate-y-0.5',
        className,
      )}
    />
  );
}

/** Werbefläche im Mega-Dropdown „Leistungen“ – rechte Spalte. */
export function PartnerPromo({ onNavigate, active, className }: PartnerPromoProps) {
  return (
    <a
      href={partner.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      aria-label={linkLabel}
      className={cn(surfaceClass, '@container flex flex-col p-5 xl:p-6', className)}
    >
      <TopEdge />

      <span className="flex items-center justify-between gap-3">
        <span className="text-eyebrow font-medium whitespace-nowrap text-sky-400 uppercase font-expanded">{partner.label}</span>
        <ExternalArrow />
      </span>

      <span className="flex flex-1 items-center py-6">
        <PartnerLogoAnimated active={active} className="h-20 xl:h-24" />
      </span>

      <span className="block text-[0.9375rem] leading-snug text-balance text-fg">{partner.tagline}</span>
      <PartnerServices items={partner.highlights} size="sm" className="mt-3" />

      {/* schmale Spalte (Desktop lg): Adresse und Aufforderung untereinander statt umbrochen */}
      <span className="mt-5 flex flex-col items-start gap-1 border-t border-white/10 pt-4 text-[0.8125rem] @2xs:flex-row @2xs:items-center @2xs:justify-between @2xs:gap-4">
        <span className="whitespace-nowrap text-fg-muted transition-colors duration-300 group-hover/partner:text-fg">
          {partner.hrefLabel}
        </span>
        <span className="whitespace-nowrap text-sky-300">{partner.visitLabel}</span>
      </span>
    </a>
  );
}

/** Kompakte Fassung für das Leistungs-Akkordeon im Mobile-Menü. */
export function PartnerPromoCompact({ onNavigate, className }: Omit<PartnerPromoProps, 'active'>) {
  return (
    <a
      href={partner.href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onNavigate}
      aria-label={linkLabel}
      className={cn(surfaceClass, 'block p-4 outline-offset-[-2px]', className)}
    >
      <TopEdge />
      <span className="flex items-center justify-between gap-4">
        <span className="text-eyebrow font-medium text-sky-400 uppercase font-expanded">{partner.label}</span>
        <ExternalArrow />
      </span>
      <span className="mt-4 flex items-center gap-4">
        <PartnerLogoAnimated className="h-12 shrink-0" />
        <span className="text-[0.8125rem] leading-snug text-fg-muted">{partner.tagline}</span>
      </span>
    </a>
  );
}
