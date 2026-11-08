'use client';

import { formatEuro, services } from '@ccs/shared';
import { motion, stagger, useReducedMotion, type Variants } from 'motion/react';
import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
} from 'react';
import { PartnerPromo } from '@/components/partner/PartnerPromo';
import { Container } from '@/components/ui/Container';
import { Sparkle } from '@/components/ui/Sparkle';
import { TwoTone } from '@/components/ui/TwoTone';
import { ArrowRight, ChevronDown } from '@/components/ui/icons';
import { serviceHref, servicesMenu } from '@/content/navigation';
import { cn } from '@/lib/cn';
import { EASE_OUT_EXPO, EASE_OUT_QUINT } from '@/lib/motion';
import { NavDot } from './NavDot';
import { OfferLink } from './OfferLink';
import { ServicePreview } from './ServicePreview';
import { navItemClass, navUnderlineClass } from './styles';

/** Hover-Absicht: kurz verweilen zum Öffnen, großzügiger beim Verlassen (Diagonal-Bewegung zum Panel). */
const OPEN_DELAY = 80;
const CLOSE_DELAY = 180;

type OpenedBy = 'hover' | 'click' | 'keyboard';

interface ServicesMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Die Leistungs-Sektion ist gerade im Lesebereich (Nav-Punkt). */
  current: boolean;
  /** Header ist im kompakten Zustand – das Panel rückt mit nach oben. */
  compact: boolean;
}

/**
 * Mega-Dropdown „Leistungen“ (Disclosure-Navigation, ab lg) – der „Showroom“.
 * Drei Spalten: links die sechs Leistungen (Nummer + Banner-Zweizeiler), über die eine Lichtmarkierung
 * gleitet; in der Mitte die Bühne mit dem Studio-Video (bzw. dem eigenen Film der Leistung) und der Leistung
 * unter dem Zeiger (bzw. im Fokus);
 * rechts die Werbefläche des Inhouse-Partners PKW-Schmiede (animiertes Logo) und die Angebotszeile –
 * der einzige Rot-Akzent im Menü.
 *
 * Tastatur: Enter/Leertaste öffnet, ↓ springt ins Panel, ↑/↓ bewegen sich in der Liste,
 * Esc schließt und gibt den Fokus an den Auslöser zurück, Tab aus dem Panel heraus schließt.
 */
export function ServicesMenu({ open, onOpenChange, current, compact }: ServicesMenuProps) {
  const reduce = useReducedMotion();
  const panelId = useId();
  const rootRef = useRef<HTMLLIElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const timer = useRef<number | undefined>(undefined);
  const openedBy = useRef<OpenedBy>('click');
  const pendingFocus = useRef<number | null>(null);

  const highlightId = `${panelId}-highlight`;

  /** Panel bleibt sichtbar, bis die Schließ-Animation fertig ist. */
  const [present, setPresent] = useState(false);
  /** Schon einmal geöffnet → erst dann lädt die Bühne Poster und Video. */
  const [seen, setSeen] = useState(false);
  /** Leistung in der Vorschau (Zeiger oder Fokus). */
  const [preview, setPreview] = useState(0);
  const previewService = services[preview] ?? services[0];

  if (open && !present) setPresent(true);
  if (open && !seen) setSeen(true);

  const clearTimer = () => window.clearTimeout(timer.current);
  const schedule = (fn: () => void, delay: number) => {
    clearTimer();
    timer.current = window.setTimeout(fn, delay);
  };
  useEffect(() => clearTimer, []);

  const show = useCallback(
    (by: OpenedBy) => {
      openedBy.current = by;
      onOpenChange(true);
    },
    [onOpenChange],
  );
  const hide = useCallback(() => onOpenChange(false), [onOpenChange]);
  const hideAndReturnFocus = useCallback(() => {
    hide();
    triggerRef.current?.focus();
  }, [hide]);

  /* Außenklick & globales Esc (auch wenn der Fokus nicht im Menü liegt, z. B. nach Hover). */
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) hide();
    };
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== 'Escape') return;
      const focusInside = rootRef.current?.contains(document.activeElement);
      hide();
      if (focusInside) triggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, hide]);

  /* Nach dem Öffnen per Tastatur den gewünschten Eintrag fokussieren (Panel ist jetzt sichtbar). */
  useEffect(() => {
    if (!open || pendingFocus.current === null) return;
    const index = pendingFocus.current;
    pendingFocus.current = null;
    itemRefs.current[index]?.focus();
  }, [open]);

  /* Schließt sich das Panel, während der Fokus darin liegt (z. B. Hover-Ende), bleibt er erreichbar. */
  useEffect(() => {
    if (!open && panelRef.current?.contains(document.activeElement)) triggerRef.current?.focus({ preventScroll: true });
  }, [open]);

  const onPointerEnter = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    if (open) clearTimer();
    else schedule(() => show('hover'), OPEN_DELAY);
  };

  const onPointerLeave = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return;
    if (!open) return clearTimer();
    if (openedBy.current === 'hover') schedule(hide, CLOSE_DELAY);
  };

  const onTriggerClick = (event: MouseEvent<HTMLButtonElement>) => {
    clearTimer();
    if (!open) return show(event.detail === 0 ? 'keyboard' : 'click');
    // Per Hover geöffnet → Klick „pinnt“ das Panel, statt es sofort wieder zu schließen.
    if (openedBy.current === 'hover') {
      openedBy.current = 'click';
      return;
    }
    hide();
  };

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    clearTimer();
    if (open) {
      itemRefs.current[0]?.focus();
      return;
    }
    pendingFocus.current = 0;
    show('keyboard');
  };

  const onBlur = (event: FocusEvent<HTMLLIElement>) => {
    const next = event.relatedTarget;
    if (!open || !(next instanceof Node)) return;
    if (!rootRef.current?.contains(next)) hide();
  };

  const onPanelKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.nativeEvent.stopImmediatePropagation();
      hideAndReturnFocus();
      return;
    }
    const items = itemRefs.current;
    const index = items.findIndex((item) => item === document.activeElement);
    if (index === -1) return;
    const last = items.length - 1;
    const targets: Partial<Record<string, number>> = {
      ArrowDown: Math.min(index + 1, last),
      ArrowUp: index - 1,
      Home: 0,
      End: last,
    };
    const target = targets[event.key];
    if (target === undefined) return;
    event.preventDefault();
    if (target < 0) triggerRef.current?.focus();
    else items[target]?.focus();
  };

  const surface: Variants = reduce
    ? {
        open: { opacity: 1, transition: { duration: 0.2 } },
        closed: { opacity: 0, transition: { duration: 0.15 } },
      }
    : {
        open: {
          opacity: 1,
          y: 0,
          clipPath: 'inset(0% 0% 0% 0%)',
          transition: { duration: 0.5, ease: EASE_OUT_EXPO, delayChildren: stagger(0.035, { startDelay: 0.06 }) },
          transitionEnd: { clipPath: 'none' },
        },
        closed: {
          opacity: 0,
          y: -10,
          clipPath: ['inset(0% 0% 0% 0%)', 'inset(0% 0% 100% 0%)'],
          transition: { duration: 0.32, ease: EASE_OUT_QUINT },
        },
      };

  const item: Variants = reduce
    ? { open: { opacity: 1 }, closed: { opacity: 1 } }
    : {
        open: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } },
        closed: { opacity: 0, y: 8, transition: { duration: 0.2 } },
      };

  return (
    <li
      ref={rootRef}
      className="flex h-full items-center"
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
      onBlur={onBlur}
    >
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={onTriggerClick}
        onKeyDown={onTriggerKeyDown}
        className={cn(navItemClass, current && 'text-fg')}
      >
        {current ? <NavDot /> : null}
        <span className="relative">
          {servicesMenu.label}
          <span aria-hidden className={cn(navUnderlineClass, 'inset-x-0 -bottom-1.5')} />
        </span>
        <ChevronDown
          aria-hidden
          className={cn(
            'size-3.5 text-fg-subtle transition-[rotate,color] duration-500 ease-out-expo group-hover/nav:text-fg',
            open && 'rotate-180 text-sky-300 group-hover/nav:text-sky-300',
          )}
        />
      </button>

      <div
        ref={panelRef}
        id={panelId}
        inert={!open}
        style={{ visibility: present ? 'visible' : 'hidden' }}
        onKeyDown={onPanelKeyDown}
        className={cn(
          // etwas Abstand zur Leiste
          'absolute inset-x-0 top-full pt-5 transition-transform duration-500 ease-out-quint',
          compact && '-translate-y-1.5',
        )}
      >
        <Container>
          <motion.div
            variants={surface}
            initial={false}
            animate={open ? 'open' : 'closed'}
            onAnimationComplete={(definition) => {
              if (definition === 'closed') setPresent(false);
            }}
            className="relative overflow-hidden border border-white/10 bg-ink-950/[0.96] shadow-[0_60px_120px_-40px_rgb(0_0_0/0.9),inset_0_1px_0_rgb(255_255_255/0.06)] backdrop-blur-2xl backdrop-saturate-150"
          >
            {/* Signatur an der Oberkante: Lichtkante im Wellen-Verlauf des Logos */}
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,var(--color-royal)_18%,var(--color-sky)_50%,var(--color-royal)_82%,transparent)] opacity-80"
            />
            {/* Studiolicht über der Liste */}
            <span
              aria-hidden
              className="pointer-events-none absolute -top-40 -left-24 size-[30rem] rounded-full bg-[radial-gradient(closest-side,rgb(0_72_206/0.16),transparent)]"
            />
            <div className="relative grid grid-cols-12 gap-3 p-3">
              <div className="col-span-4 flex flex-col px-3 pt-5 pb-2 xl:px-5">
                <motion.p
                  variants={item}
                  className="flex items-center justify-between gap-4 text-eyebrow font-medium text-fg-subtle uppercase font-expanded"
                >
                  <span className="flex items-center gap-2.5">
                    <Sparkle className="size-2.5 text-sky-400" />
                    {servicesMenu.listLabel}
                  </span>
                  <span className="font-mono tracking-normal text-sky-400 tabular">
                    {String(services.length).padStart(2, '0')}
                  </span>
                </motion.p>
                <ul className="mt-4 border-t border-line">
                  {services.map((service, index) => (
                    <motion.li key={service.slug} variants={item} className="border-b border-line">
                      <a
                        ref={(element) => {
                          itemRefs.current[index] = element;
                        }}
                        href={serviceHref(service.slug)}
                        onClick={hide}
                        onPointerEnter={() => setPreview(index)}
                        onFocus={() => setPreview(index)}
                        data-preview={index === preview}
                        className="group/item relative isolate flex items-center gap-4 py-3.5 pr-3 pl-4 outline-offset-[-2px]"
                      >
                        {/* Eine Lichtmarkierung, die zur Leistung unter dem Zeiger gleitet */}
                        {index === preview ? (
                          <motion.span
                            layoutId={highlightId}
                            aria-hidden
                            transition={reduce ? { duration: 0 } : { type: 'spring', stiffness: 420, damping: 38, mass: 0.8 }}
                            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgb(38_171_246/0.16),rgb(0_72_206/0.07)_45%,rgb(255_255_255/0.015))]"
                          >
                            <span className="absolute inset-y-0 left-0 w-0.5 bg-[linear-gradient(180deg,var(--color-sky),var(--color-royal))]" />
                          </motion.span>
                        ) : null}
                        <span className="w-5 shrink-0 font-mono text-[0.6875rem] text-fg-subtle tabular transition-colors duration-300 group-data-[preview=true]/item:text-sky-300">
                          {service.index}
                        </span>
                        <TwoTone
                          top={service.eyebrow}
                          bottom={service.title}
                          size="sm"
                          className="flex-1 transition-[opacity,translate] duration-500 ease-out-expo group-data-[preview=false]/item:opacity-70 group-data-[preview=true]/item:translate-x-1"
                        />
                        {/* rechts: Startpreis (falls kommuniziert) – in der Vorschau weicht er dem Pfeil */}
                        <span className="relative flex w-14 shrink-0 items-center justify-end">
                          {service.priceFrom ? (
                            <span className="text-[0.75rem] whitespace-nowrap text-fg-muted tabular transition-opacity duration-300 group-data-[preview=true]/item:opacity-0">
                              {servicesMenu.offer.prefix} {formatEuro(service.priceFrom)}
                            </span>
                          ) : null}
                          <ArrowRight
                            aria-hidden
                            className="absolute right-0 size-4 -translate-x-1.5 text-sky-300 opacity-0 transition-[opacity,translate] duration-500 ease-out-expo group-data-[preview=true]/item:translate-x-0 group-data-[preview=true]/item:opacity-100"
                          />
                        </span>
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <motion.div variants={item} className="col-span-5">
                {previewService ? (
                  <ServicePreview
                    service={previewService}
                    index={preview}
                    total={services.length}
                    open={open}
                    seen={seen}
                    onNavigate={hide}
                  />
                ) : null}
              </motion.div>

              <motion.div variants={item} className="col-span-3 flex">
                <PartnerPromo active={open} onNavigate={hide} className="flex-1" />
              </motion.div>
            </div>

            {/* Fußleiste: alle Leistungen links, das Angebot (Rot) rechts – mit Platz für den vollen Namen */}
            <motion.div
              variants={item}
              className="relative flex items-center justify-between gap-6 border-t border-white/10 py-3 pr-3 pl-6 xl:pl-8"
            >
              <a
                href={servicesMenu.allHref}
                onClick={hide}
                className="group/all inline-flex items-center gap-3 text-[0.875rem] text-fg-muted transition-colors duration-300 hover:text-fg"
              >
                <span className="relative">
                  {servicesMenu.allLabel}
                  <span
                    aria-hidden
                    className={cn(navUnderlineClass, 'inset-x-0 -bottom-1 group-hover/all:origin-left group-hover/all:scale-x-100')}
                  />
                </span>
                <ArrowRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 ease-out-quint group-hover/all:translate-x-1"
                />
              </a>
              <OfferLink onNavigate={hide} />
            </motion.div>
          </motion.div>
        </Container>
      </div>
    </li>
  );
}
