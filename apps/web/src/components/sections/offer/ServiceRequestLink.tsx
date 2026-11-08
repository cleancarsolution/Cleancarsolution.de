'use client';

import type { InquiryServiceValue } from '@ccs/shared';
import type { MouseEvent, ReactNode } from 'react';
import { buttonClasses } from '@/components/ui/Button';
import { ArrowRight } from '@/components/ui/icons';
import { requestService } from '@/lib/events';

interface ServiceRequestLinkProps {
  service: InquiryServiceValue;
  variant?: 'primary' | 'white' | 'secondary' | 'navy' | 'ghost';
  size?: 'md' | 'lg';
  className?: string;
  children: ReactNode;
}

/**
 * CTA „Leistung anfragen“: wählt die Leistung im Kontaktformular vor und scrollt weich dorthin.
 * Progressive Enhancement: ohne JS bzw. mit Strg/⌘-Klick öffnet der Link `/?leistung=<slug>#kontakt`,
 * das Formular liest den Parameter beim Laden aus (`readServiceFromUrl`).
 */
export function ServiceRequestLink({ service, variant = 'primary', size = 'lg', className, children }: ServiceRequestLinkProps) {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    requestService(service);
  };

  return (
    <a href={`/?leistung=${service}#kontakt`} onClick={onClick} className={buttonClasses({ variant, size, className })}>
      <span className="relative">{children}</span>
      <ArrowRight
        aria-hidden
        className="-mr-0.5 size-[1.05em] transition-transform duration-300 ease-out-quint group-hover/btn:translate-x-0.5"
      />
    </a>
  );
}
