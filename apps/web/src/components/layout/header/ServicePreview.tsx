'use client';

import { formatEuro, type Service } from '@ccs/shared';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import type { CSSProperties } from 'react';
import { LoopVideoMedia } from '@/components/media/LoopVideoMedia';
import { useLoopVideo } from '@/components/media/useLoopVideo';
import { VideoPoster, type ImageAsset } from '@/components/media/VideoPoster';
import { buttonClasses } from '@/components/ui/Button';
import { ArrowRight } from '@/components/ui/icons';
import { Sparkle } from '@/components/ui/Sparkle';
import { TwoTone } from '@/components/ui/TwoTone';
import { serviceFilms, studioFilm } from '@/content/media';
import { serviceHref, servicesMenu } from '@/content/navigation';
import { servicesSection } from '@/content/services-section';
import { cn } from '@/lib/cn';
import { EASE_OUT_EXPO } from '@/lib/motion';

interface ServicePreviewProps {
  service: Service;
  /** Position in der Liste (0-basiert) und Anzahl – für Zähler und Fortschrittsstriche. */
  index: number;
  total: number;
  /** Menü offen → Video läuft; geschlossen → pausiert. */
  open: boolean;
  /** Menü war schon einmal offen → Medien werden erst dann geladen. */
  seen: boolean;
  onNavigate: () => void;
}

const SIZES = '(min-width: 1440px) 560px, 42vw';

/** Je Leistungsfilm eine eigene Ebene – beim Wechsel blenden die Filme ineinander, statt neu zu laden. */
const FILMS = Object.values(serviceFilms).filter((film) => film !== undefined);

/**
 * Bühne im Mega-Dropdown: das Studio-Video läuft im Hintergrund (nur solange das Menü offen ist);
 * hat die Leistung einen eigenen Film (`serviceFilms`), blendet er stattdessen ein.
 * Darüber die Leistung unter dem Zeiger bzw. im Fokus – Zweizeiler, Kurztext, Leistungsumfang, Preis.
 * Wiederholt nur die Liste daneben → für Screenreader verborgen, der Link ist ein reines Maus-Ziel.
 */
export function ServicePreview({ service, index, total, open, seen, onNavigate }: ServicePreviewProps) {
  const reduce = useReducedMotion();
  const film = serviceFilms[service.slug];
  const number = String(index + 1).padStart(2, '0');

  const enter = reduce ? { opacity: 0 } : { opacity: 0, y: 14 };
  const exit = reduce ? { opacity: 0 } : { opacity: 0, y: -8, transition: { duration: 0.16 } };

  return (
    <div
      aria-hidden
      className="relative isolate flex h-full min-h-[27rem] flex-col overflow-hidden bg-ink-900 shadow-[inset_0_0_0_1px_rgb(255_255_255/0.08)]"
    >
      {seen ? (
        <div className="absolute inset-0 -z-10">
          <StageVideo
            shown={!film}
            open={open}
            src={studioFilm.sources.medium}
            poster={studioFilm.poster}
            still={studioFilm.still}
            position="70% 50%"
            className="inset-0"
          />
          {FILMS.map((entry) => (
            <StageVideo
              key={entry.sources.landscape}
              shown={entry === film}
              open={open}
              src={entry.sources.landscape}
              poster={entry.poster}
              still={entry.still}
              position={entry.position}
              // Breitband (3 : 1) oben in voller Breite: das Motiv liegt über dem Text, unten blendet es ins Studio-Dunkel
              className="inset-x-0 top-0 aspect-[3/1] [mask-image:linear-gradient(180deg,#000_70%,transparent)]"
            />
          ))}
        </div>
      ) : null}
      {/* Lesbarkeit: oben leicht, unten kräftig abdunkeln; kühles Licht von oben rechts */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(3_5_15/0.55)_0%,rgb(3_5_15/0.1)_28%,rgb(3_5_15/0.55)_52%,rgb(3_5_15/0.94)_78%,var(--color-ink-950)_100%)] transition-opacity duration-700 ease-out-quint',
          film && 'opacity-0',
        )}
      />
      {/* Leistungsfilm: oben fast klar, damit man ihn erkennt – ab der Headline kräftig abdunkeln */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(3_5_15/0.45)_0%,rgb(3_5_15/0.08)_15%,rgb(3_5_15/0.1)_23%,rgb(3_5_15/0.74)_34%,rgb(3_5_15/0.9)_48%,var(--color-ink-950)_78%)] transition-opacity duration-700 ease-out-quint',
          !film && 'opacity-0',
        )}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_60%_at_85%_0%,rgb(38_171_246/0.18),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-grain opacity-[0.07] mix-blend-overlay" />

      {/* Kopf: Fortschritt + Zähler */}
      <div className="flex items-center justify-between gap-6 p-6 xl:p-7">
        <div className="flex gap-1.5">
          {Array.from({ length: total }, (_, i) => (
            <span
              key={i}
              className={cn(
                'h-[3px] w-5 rounded-full transition-colors duration-500 ease-out-quint',
                i === index ? 'bg-sky' : i < index ? 'bg-white/55' : 'bg-white/20',
              )}
            />
          ))}
        </div>
        <span className="font-mono text-[0.6875rem] tracking-[0.12em] text-fg/70 tabular">
          {number} / {String(total).padStart(2, '0')}
        </span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={service.slug}
          className="mt-auto flex flex-col p-6 xl:p-7"
          initial={enter}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT_EXPO } }}
          exit={exit}
        >
          <TwoTone top={service.eyebrow} bottom={service.title} size="md" />
          <p className="mt-3 max-w-[44ch] text-[0.9375rem] leading-relaxed text-fg-muted">{service.summary}</p>

          <ul className="mt-5 grid gap-x-5 gap-y-2 sm:grid-cols-2">
            {service.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2.5 text-[0.8125rem] leading-snug text-fg/90">
                <Sparkle className="mt-[0.3rem] size-2 shrink-0 text-sky-400" />
                {highlight}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-end justify-between gap-6 border-t border-white/10 pt-5">
            {service.priceFrom ? (
              <p className="flex items-baseline gap-2">
                <span className="text-sm text-fg-subtle">{servicesMenu.offer.prefix}</span>
                <span className="text-[1.75rem] leading-none font-medium tracking-[-0.03em] tabular">
                  {formatEuro(service.priceFrom)}
                </span>
              </p>
            ) : (
              <p className="max-w-[26ch] text-[0.8125rem] leading-snug text-fg-subtle">{servicesSection.quoteNote}</p>
            )}
            <a
              href={serviceHref(service.slug)}
              tabIndex={-1}
              onClick={onNavigate}
              className={buttonClasses({ variant: 'white', className: 'h-10 gap-2 px-4 text-sm' })}
            >
              {servicesMenu.previewCta}
              <ArrowRight className="size-4 transition-transform duration-300 ease-out-quint group-hover/btn:translate-x-0.5" />
            </a>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

interface StageVideoProps {
  /** Ebene liegt vorn – nur dann läuft das Video (und nur, solange das Menü offen ist). */
  shown: boolean;
  open: boolean;
  src: string;
  poster: ImageAsset;
  still: ImageAsset;
  /** Bildausschnitt von Poster und Video (object-position). */
  position: string;
  /** Lage der Ebene auf der Bühne. */
  className: string;
}

/** Eine Video-Ebene der Bühne: eingehängt beim ersten Zeigen, danach weiche Überblendung statt Neuladen. */
function StageVideo({ shown, open, src, poster, still, position, className }: StageVideoProps) {
  // Vom Menü gesteuert (offen + vorn = sichtbar) – keine eigene Sichtbarkeits-Beobachtung nötig.
  const { videoRef, video } = useLoopVideo({ active: open && shown });

  return (
    <div
      className={cn(
        'absolute transition-opacity duration-700 ease-out-quint',
        shown ? 'opacity-100' : 'opacity-0',
        className,
      )}
      style={{ '--stage-object': position } as CSSProperties}
    >
      <LoopVideoMedia
        videoRef={videoRef}
        video={video}
        sources={[{ src }]}
        className="object-(--stage-object)"
        poster={<VideoPoster alt="" sizes={SIZES} poster={poster} still={still} className="object-(--stage-object)" />}
      />
    </div>
  );
}
