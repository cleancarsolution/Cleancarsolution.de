'use client';

import { services, site } from '@ccs/shared';
import { motion, stagger, useReducedMotion, type Variants } from 'motion/react';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { PartnerPromoCompact } from '@/components/partner/PartnerPromo';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { TwoTone } from '@/components/ui/TwoTone';
import { ArrowUpRight, Instagram, Mail, Phone, TikTok } from '@/components/ui/icons';
import { headerCta, mainNav, mobileMenu, serviceHref } from '@/content/navigation';
import { cn } from '@/lib/cn';
import { EASE_OUT_EXPO, EASE_OUT_QUINT } from '@/lib/motion';
import { OfferLink } from './OfferLink';

const SOCIAL_ICONS: Record<string, ReactNode> = {
  Instagram: <Instagram className="size-[1.125rem]" />,
  TikTok: <TikTok className="size-4" />,
};

interface MobileMenuProps {
  id: string;
  open: boolean;
  /** ID der Sektion im Lesebereich – bekommt den Sky-Punkt. */
  current: string | null;
  /** Schließt das Menü; `restoreFocus` gibt den Fokus an den Burger zurück. */
  onClose: (options?: { restoreFocus?: boolean }) => void;
}

/**
 * Vollbild-Menü (< lg). Fällt wie ein Rolltor von oben herab, die Einträge gleiten gestaffelt nach.
 * „Leistungen“ klappt als Akkordeon die sechs Banner-Zweizeiler auf (plus Angebot und Inhouse-Partner);
 * unten direkte Kontaktwege.
 * Fokusfalle, Esc und Scroll-Sperre steuert der Header (HeaderRoot).
 */
export function MobileMenu({ id, open, current, onClose }: MobileMenuProps) {
  const reduce = useReducedMotion();
  const accordionId = useId();
  const firstItemRef = useRef<HTMLButtonElement>(null);
  const [present, setPresent] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  if (open && !present) setPresent(true);

  /* Beim Öffnen landet der Fokus auf dem ersten Eintrag. */
  useEffect(() => {
    if (!open) return;
    const frame = window.requestAnimationFrame(() => firstItemRef.current?.focus({ preventScroll: true }));
    return () => window.cancelAnimationFrame(frame);
  }, [open]);

  const overlay: Variants = reduce
    ? {
        open: { opacity: 1, transition: { duration: 0.25, delayChildren: stagger(0.03) } },
        closed: { opacity: 0, transition: { duration: 0.2 } },
      }
    : {
        open: {
          clipPath: 'inset(0% 0% 0% 0%)',
          transition: { duration: 0.75, ease: EASE_OUT_EXPO, delayChildren: stagger(0.05, { startDelay: 0.14 }) },
        },
        closed: {
          clipPath: 'inset(0% 0% 100% 0%)',
          transition: { duration: 0.5, ease: EASE_OUT_QUINT, delay: 0.06 },
        },
      };

  const item: Variants = reduce
    ? { open: { opacity: 1 }, closed: { opacity: 0 } }
    : {
        open: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE_OUT_EXPO } },
        closed: { opacity: 0, y: 28, transition: { duration: 0.25, ease: EASE_OUT_QUINT } },
      };

  const close = () => onClose();

  return (
    <motion.div
      id={id}
      inert={!open}
      variants={overlay}
      initial={false}
      animate={open ? 'open' : 'closed'}
      onAnimationComplete={(definition) => {
        if (definition !== 'closed') return;
        setPresent(false);
        setServicesOpen(false);
      }}
      style={{ visibility: present ? 'visible' : 'hidden' }}
      className="fixed inset-0 z-0 overflow-hidden lg:hidden"
    >
      <div aria-hidden className="absolute inset-0 bg-ink-950" />
      <div aria-hidden className="absolute inset-0 bg-grain opacity-[0.06]" />
      {/* Studiolicht hinter dem CTA – die Fläche „leuchtet“ zum Termin hin. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-[30vh] left-1/2 h-[70vh] w-[150vw] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_72_206/0.28),rgb(38_171_246/0.06)_55%,transparent)]"
      />

      <div data-lenis-prevent className="relative h-full overflow-y-auto overscroll-contain">
        <Container className="flex min-h-full flex-col pt-[5.5rem] pb-[max(2rem,env(safe-area-inset-bottom))]">
          <nav aria-label={mobileMenu.navLabel}>
            <ul className="border-t border-line">
              {mainNav.map((entry, index) => {
                const isCurrent = current !== null && entry.href === `/#${current}`;
                if ('menu' in entry) {
                  return (
                    <motion.li key={entry.href} variants={item} className="border-b border-line">
                      <button
                        ref={index === 0 ? firstItemRef : undefined}
                        type="button"
                        aria-expanded={servicesOpen}
                        aria-controls={accordionId}
                        onClick={() => setServicesOpen((value) => !value)}
                        className={cn(linkRowClass, 'w-full cursor-pointer text-left')}
                      >
                        <LinkLabel current={isCurrent}>{entry.label}</LinkLabel>
                        <PlusMinus open={servicesOpen} />
                      </button>
                      <div
                        id={accordionId}
                        className={cn(
                          'grid transition-[grid-template-rows] duration-500 ease-out-expo',
                          servicesOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                        )}
                      >
                        <div className="min-h-0 overflow-hidden" inert={!servicesOpen}>
                          <ul className="grid gap-x-6 pb-2 sm:grid-cols-2">
                            {services.map((service) => (
                              <li key={service.slug} className="border-t border-line first:border-t-0 sm:[&:nth-child(2)]:border-t-0">
                                <a
                                  href={serviceHref(service.slug)}
                                  onClick={close}
                                  className="group/svc flex items-start gap-4 rounded-sm py-4 outline-offset-2"
                                >
                                  <span className="w-6 pt-px font-mono text-[0.6875rem] tracking-normal text-fg-subtle tabular">
                                    {service.index}
                                  </span>
                                  <TwoTone top={service.eyebrow} bottom={service.title} size="sm" className="flex-1" />
                                  <ArrowUpRight
                                    aria-hidden
                                    className="mt-1 size-4 text-fg-subtle transition-colors duration-300 group-hover/svc:text-sky-300"
                                  />
                                </a>
                              </li>
                            ))}
                          </ul>
                          <OfferLink onNavigate={close} />
                          <PartnerPromoCompact onNavigate={close} className="mt-3 mb-6" />
                        </div>
                      </div>
                    </motion.li>
                  );
                }
                return (
                  <motion.li key={entry.href} variants={item} className="border-b border-line">
                    <a href={entry.href} onClick={close} aria-current={isCurrent ? 'location' : undefined} className={linkRowClass}>
                      <LinkLabel current={isCurrent}>{entry.label}</LinkLabel>
                      <ArrowUpRight aria-hidden className="size-5 text-fg-subtle transition-colors duration-300 group-hover/row:text-sky-300" />
                    </a>
                  </motion.li>
                );
              })}
            </ul>
          </nav>

          <motion.div variants={item} className="mt-auto pt-14">
            <p className="text-eyebrow font-medium text-fg-subtle uppercase font-expanded">{mobileMenu.contactTitle}</p>
            <ul className="mt-5 grid grid-cols-2 gap-3">
              {site.phones.map((phone) => (
                <li key={phone.href}>
                  <a
                    href={phone.href}
                    className="flex h-full flex-col rounded-sm border border-line bg-white/[0.03] px-4 py-3.5 transition-[background-color,border-color] duration-300 ease-out-quint hover:border-line-strong hover:bg-white/[0.06]"
                  >
                    <span className="flex items-center gap-2 text-[0.6875rem] tracking-[0.16em] text-fg-subtle uppercase font-expanded">
                      <Phone aria-hidden className="size-3.5 text-sky-400" />
                      {phone.label}
                    </span>
                    <span className="mt-1.5 text-[0.9375rem] whitespace-nowrap text-fg tabular">{phone.display}</span>
                  </a>
                </li>
              ))}
            </ul>
            {/* E-Mail in voller Breite – eine Adresse wird nie abgeschnitten */}
            <a
              href={`mailto:${site.email}`}
              className="mt-3 flex h-12 items-center gap-2.5 rounded-sm border border-line bg-white/[0.03] px-4 text-[0.875rem] text-fg-muted transition-colors duration-300 hover:text-fg"
            >
              <Mail aria-hidden className="size-4 shrink-0 text-sky-400" />
              <span className="min-w-0 break-all">{site.email}</span>
            </a>
            <div className="mt-3 flex items-center gap-3">
              {site.socials.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label}: ${social.handle} (öffnet in neuem Tab)`}
                  className="grid size-12 shrink-0 place-items-center rounded-full border border-line bg-white/[0.03] text-fg-muted transition-colors duration-300 hover:text-fg"
                >
                  {SOCIAL_ICONS[social.label]}
                </a>
              ))}
            </div>
            <ButtonLink href={headerCta.href} onClick={close} size="lg" arrow className="mt-6 w-full">
              {headerCta.label}
            </ButtonLink>
            <p className="mt-5 text-center font-mono text-[0.6875rem] tracking-[0.18em] text-fg-subtle uppercase">
              {site.claim} · {site.address.city}
            </p>
          </motion.div>
        </Container>
      </div>
    </motion.div>
  );
}

const linkRowClass =
  'group/row flex items-center justify-between gap-6 rounded-sm py-[1.1rem] text-[clamp(1.75rem,7.4vw,2.5rem)] leading-[1.05] font-medium tracking-[-0.035em] text-fg outline-offset-2';

function LinkLabel({ current, children }: { current: boolean; children: ReactNode }) {
  return (
    <span className="relative flex items-center gap-3">
      <span
        aria-hidden
        className={cn(
          'size-1.5 rounded-full bg-sky transition-opacity duration-300',
          current ? 'opacity-100' : 'hidden',
        )}
      />
      {children}
    </span>
  );
}

/** „+“, dessen senkrechter Balken beim Öffnen einklappt („−“). */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        'relative grid size-10 shrink-0 place-items-center rounded-full border transition-colors duration-300',
        open ? 'border-sky/50 text-sky-300' : 'border-line-strong text-fg',
      )}
    >
      <span className="absolute h-[1.5px] w-3.5 rounded-full bg-current" />
      <span
        className={cn(
          'absolute h-3.5 w-[1.5px] rounded-full bg-current transition-transform duration-500 ease-out-expo',
          open && 'scale-y-0',
        )}
      />
    </span>
  );
}
