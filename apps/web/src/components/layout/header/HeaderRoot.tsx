'use client';

import { primaryPhone } from '@ccs/shared';
import { useCallback, useEffect, useRef, useState, type FocusEvent, type ReactNode } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Phone } from '@/components/ui/icons';
import { SmartLink } from '@/components/ui/SmartLink';
import { headerCta, mainNav, mobileMenu } from '@/content/navigation';
import { cn } from '@/lib/cn';
import { lockScroll, unlockScroll } from '@/lib/scroll';
import { inertSiblings, trapTab } from './focus';
import styles from './header.module.css';
import { MenuButton } from './MenuButton';
import { MobileMenu } from './MobileMenu';
import { NavDot } from './NavDot';
import { ServicesMenu } from './ServicesMenu';
import { navItemClass, navUnderlineClass } from './styles';
import { useActiveSection } from './useActiveSection';
import { useHeaderScroll } from './useHeaderScroll';

type OpenMenu = 'services' | 'mobile' | null;

const MOBILE_MENU_ID = 'mobile-menu';
const DESKTOP_QUERY = '(min-width: 64rem)';
const SECTION_IDS = mainNav.map((item) => item.href.replace('/#', ''));
const phoneLabel = `Anrufen: ${primaryPhone.display}`;

interface HeaderRootProps {
  /** Server-gerendertes Logo (Bildquellen kommen vom Server, nicht aus dem Client-Bundle). */
  logo: ReactNode;
}

/**
 * Fixierter Header.
 * - Über dem Hero transparent mit weichem Verlauf; ab 40 px Scroll: Ink-Glas mit Haarlinie, etwas flacher
 *   (nur per transform – die Leiste rückt hoch, die Fläche skaliert).
 * - Ab 600 px weicht er beim Runterscrollen aus und kommt beim Hochscrollen zurück;
 *   sichtbar bleibt er, solange ein Menü offen ist oder die Tastatur darin fokussiert.
 * - Das Logo steht frei in der Leiste, vertikal mittig.
 */
export function HeaderRoot({ logo }: HeaderRootProps) {
  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const { scrolled, hidden } = useHeaderScroll();
  const current = useActiveSection(SECTION_IDS);
  const [menu, setMenu] = useState<OpenMenu>(null);
  const [keyboardFocus, setKeyboardFocus] = useState(false);

  const mobileOpen = menu === 'mobile';
  const isHidden = hidden && menu === null && !keyboardFocus;
  const surface = scrolled && !mobileOpen;

  const setServicesOpen = useCallback(
    (open: boolean) => setMenu((value) => (open ? 'services' : value === 'services' ? null : value)),
    [],
  );

  const closeMobile = useCallback((options?: { restoreFocus?: boolean }) => {
    // Synchron entsperren: der Klick auf einen Anker wird direkt danach von SmoothScroll verarbeitet.
    unlockScroll();
    setMenu((value) => (value === 'mobile' ? null : value));
    if (options?.restoreFocus) toggleRef.current?.focus();
  }, []);

  const toggleMobile = () => {
    if (mobileOpen) closeMobile();
    else setMenu('mobile');
  };

  /* Mobile-Menü: Scroll-Sperre, Hintergrund inert, Fokusfalle, Esc. */
  useEffect(() => {
    const header = headerRef.current;
    if (!mobileOpen || !header) return;
    lockScroll();
    const restoreInert = inertSiblings(header);
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeMobile({ restoreFocus: true });
        return;
      }
      trapTab(event, header);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      restoreInert();
      unlockScroll();
    };
  }, [mobileOpen, closeMobile]);

  /* Breakpoint-Wechsel schließt das Menü, das es in der neuen Breite nicht gibt. */
  useEffect(() => {
    const query = window.matchMedia(DESKTOP_QUERY);
    const onChange = () =>
      setMenu((value) => ((value === 'mobile' && query.matches) || (value === 'services' && !query.matches) ? null : value));
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  /* Tastatur-Fokus im Header hält ihn sichtbar (Maus-Klicks auf Links zählen nicht). */
  const onFocus = (event: FocusEvent<HTMLElement>) => {
    if (event.target instanceof HTMLElement && event.target.matches(':focus-visible')) setKeyboardFocus(true);
  };
  const onBlur = (event: FocusEvent<HTMLElement>) => {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) setKeyboardFocus(false);
  };

  return (
    <header ref={headerRef} onFocus={onFocus} onBlur={onBlur} className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'relative isolate z-10 transition-[translate] duration-500 ease-out-quint',
          styles.intro,
          // Etwas mehr als die eigene Höhe – damit auch die Haarlinie darunter ganz mit verschwindet.
          isHidden && '-translate-y-[calc(100%+1.5rem)]',
        )}
      >
        {/* Über dem Hero: weicher Verlauf für Lesbarkeit */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 -z-10 h-[170%] bg-[linear-gradient(180deg,rgb(3_5_15/0.7)_0%,rgb(3_5_15/0.3)_45%,transparent_100%)] transition-opacity duration-700 ease-out-quint',
            scrolled || mobileOpen ? 'opacity-0' : 'opacity-100',
          )}
        />
        {/* Gescrollt: Ink-Glas – skaliert auf 68 px Höhe (Desktop) */}
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 origin-top bg-ink-950/70 transition-[opacity,scale] duration-500 ease-out-quint',
            surface ? 'opacity-100 backdrop-blur-xl backdrop-saturate-150 lg:scale-y-[0.85]' : 'opacity-0',
          )}
        />
        <div
          aria-hidden
          className={cn(
            'pointer-events-none absolute inset-x-0 top-full -z-10 h-px bg-line transition-[opacity,translate] duration-500 ease-out-quint',
            surface ? 'opacity-100 lg:-translate-y-3' : 'opacity-0',
          )}
        />

        <Container
          className={cn(
            // lg: Navigation zwischen Logo und Aktionen; ab xl exakt mittig
            'grid h-16 grid-cols-[1fr_auto] items-center gap-4 transition-[translate] duration-500 ease-out-quint lg:h-20 lg:grid-cols-[auto_1fr_auto] xl:grid-cols-[1fr_auto_1fr]',
            surface && 'lg:-translate-y-1.5',
          )}
        >
          <SmartLink
            href="/#top"
            aria-label="Clean Car Solution – zur Startseite"
            onClick={() => {
              if (mobileOpen) closeMobile();
            }}
            className="justify-self-start outline-offset-4"
          >
            {logo}
          </SmartLink>

          <nav aria-label={mobileMenu.navLabel} className="hidden h-full justify-self-center lg:block">
            <ul className="flex h-full items-center gap-5 xl:gap-9">
              {mainNav.map((item) => {
                const id = item.href.replace('/#', '');
                if ('menu' in item) {
                  return (
                    <ServicesMenu
                      key={item.href}
                      open={menu === 'services'}
                      onOpenChange={setServicesOpen}
                      current={current === id}
                      compact={surface}
                    />
                  );
                }
                const isCurrent = current === id;
                return (
                  <li key={item.href} className="flex h-full items-center">
                    <a
                      href={item.href}
                      aria-current={isCurrent ? 'location' : undefined}
                      className={cn(navItemClass, isCurrent && 'text-fg')}
                    >
                      {isCurrent ? <NavDot /> : null}
                      <span className="relative">
                        {item.label}
                        <span aria-hidden className={cn(navUnderlineClass, 'inset-x-0 -bottom-1.5')} />
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center justify-end gap-2.5 sm:gap-3">
            {/* Desktop: Telefon (Nummer ab xl) */}
            <a
              href={primaryPhone.href}
              aria-label={phoneLabel}
              className="group/phone hidden items-center gap-2.5 rounded-full py-1 pr-1 text-[0.9375rem] text-fg/80 transition-colors duration-300 hover:text-fg lg:inline-flex xl:pr-2"
            >
              <span className="grid size-10 place-items-center rounded-full border border-line-strong transition-[border-color,background-color] duration-300 group-hover/phone:border-sky/50 group-hover/phone:bg-sky/10">
                <Phone aria-hidden className="size-4 text-sky-300" />
              </span>
              <span className="hidden tracking-[-0.005em] whitespace-nowrap xl:inline">{primaryPhone.display}</span>
            </a>

            {/* Mobil (< sm): Anruf-Icon */}
            <a
              href={primaryPhone.href}
              aria-label={phoneLabel}
              inert={mobileOpen}
              className={cn(
                'grid size-11 place-items-center rounded-full border border-line-strong bg-ink-950/40 transition-opacity duration-300 sm:hidden',
                mobileOpen && 'pointer-events-none opacity-0',
              )}
            >
              <Phone aria-hidden className="size-[1.125rem] text-sky-300" />
            </a>

            <ButtonLink
              href={headerCta.href}
              inert={mobileOpen}
              className={cn('hidden transition-opacity sm:inline-flex', mobileOpen && 'pointer-events-none opacity-0')}
            >
              {headerCta.label}
            </ButtonLink>

            <MenuButton
              ref={toggleRef}
              open={mobileOpen}
              controls={MOBILE_MENU_ID}
              onToggle={toggleMobile}
              className="lg:hidden"
            />
          </div>
        </Container>
      </div>

      {/* Mega-Dropdown offen: Seite tritt leicht zurück (Klick daneben schließt) */}
      <div
        aria-hidden
        className={cn(
          'fixed inset-0 z-0 hidden bg-ink-950/50 transition-opacity duration-500 ease-out-quint lg:block',
          menu === 'services' ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <MobileMenu id={MOBILE_MENU_ID} open={mobileOpen} current={current} onClose={closeMobile} />
    </header>
  );
}
