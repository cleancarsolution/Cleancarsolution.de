'use client';

import { formatEuro, getService } from '@ccs/shared';
import type { MouseEvent } from 'react';
import { ArrowRight } from '@/components/ui/icons';
import { servicesMenu } from '@/content/navigation';
import { cn } from '@/lib/cn';
import { requestService } from '@/lib/events';

const offerService = getService(servicesMenu.offer.service);
const offerLabel = offerService.priceLabel ?? offerService.name;
const offerPrice = offerService.priceFrom;

interface OfferLinkProps {
  /** Wird vor dem Scrollen aufgerufen (Menü schließen, Scroll-Sperre lösen). */
  onNavigate?: () => void;
  className?: string;
}

/**
 * Kompakte Angebotszeile mit dem roten Banner-Punkt: „Handwäsche innen & außen · ab 89 €“.
 * Wählt die Leistung im Kontaktformular vor und scrollt hin; ohne JS bzw. mit Modifier-Taste
 * öffnet der Link `/?leistung=…#kontakt` (wird vom Formular beim Laden ausgewertet).
 */
export function OfferLink({ onNavigate, className }: OfferLinkProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    onNavigate?.();
    // Außerhalb der Startseite gibt es kein Formular – dann normal navigieren.
    if (window.location.pathname !== '/') return;
    event.preventDefault();
    requestService(servicesMenu.offer.service);
  };

  return (
    <a
      href={`/?leistung=${servicesMenu.offer.service}#kontakt`}
      onClick={onClick}
      className={cn(
        'group/offer flex items-center gap-3 rounded-sm border border-line bg-white/[0.03] py-1.5 pr-1.5 pl-4 transition-[background-color,border-color] duration-300 ease-out-quint hover:border-line-strong hover:bg-white/[0.06]',
        className,
      )}
    >
      <span className="min-w-0 flex-1 text-[0.875rem] leading-snug text-fg-muted transition-colors duration-300 group-hover/offer:text-fg">
        {offerLabel}
      </span>
      {/* Rot trägt – wie auf dem Banner – immer den Preis. */}
      <span className="inline-flex h-9 shrink-0 items-center gap-2 rounded-full bg-signal pr-3 pl-3.5 text-white">
        {offerPrice !== undefined ? (
          <span className="text-[0.875rem] leading-none whitespace-nowrap">
            <span>{servicesMenu.offer.prefix}</span>{' '}
            <span className="font-semibold">{formatEuro(offerPrice)}</span>
          </span>
        ) : null}
        <ArrowRight
          aria-hidden
          className="size-3.5 transition-transform duration-300 ease-out-quint group-hover/offer:translate-x-0.5"
        />
      </span>
    </a>
  );
}
