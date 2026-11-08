'use client';

import Image from 'next/image';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { Service } from '@ccs/shared';
import { LoopVideoMedia } from '@/components/media/LoopVideoMedia';
import { useLoopVideo } from '@/components/media/useLoopVideo';
import { VideoPoster } from '@/components/media/VideoPoster';
import { VideoToggle } from '@/components/media/VideoToggle';
import { TwoTone } from '@/components/ui/TwoTone';
import { videoLabels, type ServiceFilm } from '@/content/media';
import { cn } from '@/lib/cn';
import { EASE_OUT_EXPO } from '@/lib/motion';

type Slide = Pick<Service, 'slug' | 'eyebrow' | 'title' | 'image'> & { film?: ServiceFilm };

const SIZES = '(min-width: 1024px) 40vw, 1px';

interface ServicesStageProps {
  slides: readonly Slide[];
  /** Server-gerenderter Platzhalter für Leistungen ohne Foto. */
  placeholder: ReactNode;
  className?: string;
  /** Server-gerenderte Leistungsblöcke (`[data-service-block]`). */
  children: ReactNode;
}

/**
 * Beobachtet, welcher Leistungsblock die Bildschirmmitte kreuzt, markiert ihn (`data-active`) und
 * zeigt auf Desktop das passende Bild (oder den Platzhalter) in der Sticky-Bühne – bzw. den Film der Leistung.
 */
export function ServicesStage({ slides, placeholder, className, children }: ServicesStageProps) {
  const listRef = useRef<HTMLOListElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);
  const [previous, setPrevious] = useState<number | null>(null);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const blocks = Array.from(list.querySelectorAll<HTMLElement>('[data-service-block]'));

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = blocks.indexOf(entry.target as HTMLElement);
          if (index < 0 || index === activeRef.current) continue;
          setPrevious(activeRef.current);
          activeRef.current = index;
          setActive(index);
          blocks.forEach((block, i) => {
            block.dataset.active = String(i === index);
          });
        }
      },
      // schmales Band in der Bildschirmmitte
      { rootMargin: '-48% 0px -48% 0px', threshold: 0 },
    );
    blocks.forEach((block) => observer.observe(block));
    return () => observer.disconnect();
  }, []);

  return (
    <div className={cn('lg:grid lg:grid-cols-12 lg:gap-x-8', className)}>
      <div className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-28 h-[calc(100svh-9rem)] max-h-[50rem] min-h-[30rem]">
          <Visual slides={slides} active={active} previous={previous} placeholder={placeholder} />
        </div>
      </div>
      <ol ref={listRef} className="lg:col-span-6 lg:col-start-7">
        {children}
      </ol>
    </div>
  );
}

function Visual({
  slides,
  active,
  previous,
  placeholder,
}: {
  slides: readonly Slide[];
  active: number;
  previous: number | null;
  placeholder: ReactNode;
}) {
  const reduce = useReducedMotion();
  const current = slides[active] ?? slides[0];
  if (!current) return null;

  // Rein dekorativ (wiederholt die Liste) → aria-hidden je Ebene; nur der Pause-Schalter eines Films bleibt bedienbar.
  return (
    <div className="relative h-full overflow-hidden bg-ink-850 shadow-[0_40px_120px_-40px_rgb(0_0_0/0.85)] ring-1 ring-white/[0.06]">
      {slides.map((slide, i) => {
        const isActive = i === active;
        const isPrevious = i === previous;
        return slide.film ? (
          <FilmSlide key={slide.slug} film={slide.film} active={isActive} previous={isPrevious} />
        ) : (
          <StageSlide key={slide.slug} active={isActive} previous={isPrevious}>
            {slide.image ? (
              <Image src={slide.image.src} alt="" fill sizes={SIZES} className="object-cover" />
            ) : (
              placeholder
            )}
          </StageSlide>
        );
      })}

      {/* Lesbarkeit + Filmkorn */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-[linear-gradient(180deg,rgb(3_5_15/0.6)_0%,transparent_26%,transparent_48%,rgb(3_5_15/0.92)_100%)]"
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 bg-grain opacity-[0.06] mix-blend-overlay" />

      {/* Fortschritt */}
      <div aria-hidden className="absolute inset-x-0 top-0 z-20 p-6 xl:p-8">
        <div className="flex gap-1.5">
          {slides.map((slide, i) => (
            <span
              key={slide.slug}
              className={cn(
                'h-[3px] w-5 rounded-full transition-colors duration-500 ease-out-quint',
                i === active ? 'bg-sky' : i < active ? 'bg-white/55' : 'bg-white/20',
              )}
            />
          ))}
        </div>
      </div>

      {/* Name */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 z-20 p-6 xl:p-8">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current.slug}
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, y: -14 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            <TwoTone top={current.eyebrow} bottom={current.title} size="md" />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/** Eine Folie der Bühne: wischt von unten herein (Maske), das Bild darin setzt sich dabei (1,12 → 1). */
function StageSlide({ active, previous, children }: { active: boolean; previous: boolean; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      aria-hidden
      className="absolute inset-0"
      style={{ zIndex: active ? 2 : previous ? 1 : 0 }}
      initial={false}
      animate={{ clipPath: active || previous ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
      transition={active && !reduce ? { duration: 1.1, ease: EASE_OUT_EXPO } : { duration: 0 }}
    >
      <motion.div
        className="absolute inset-0"
        initial={false}
        animate={{ scale: active ? 1 : 1.12 }}
        transition={{ duration: reduce ? 0 : 1.8, ease: EASE_OUT_EXPO }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/**
 * Folie mit eigenem Film (Hochformat-Schnitt): lädt erst, wenn sie zum ersten Mal vorn liegt, und spielt nur
 * dann und nur sichtbar. Pause/Play liegt über Verlauf und Korn rechts neben dem Namen.
 */
function FilmSlide({ film, active, previous }: { film: ServiceFilm; active: boolean; previous: boolean }) {
  const { frameRef, videoRef, video } = useLoopVideo({ enabled: active });

  return (
    <>
      <StageSlide active={active} previous={previous}>
        <div ref={frameRef} className="absolute inset-0">
          <LoopVideoMedia
            videoRef={videoRef}
            video={video}
            sources={[{ src: film.sources.portrait }]}
            poster={<VideoPoster alt="" sizes={SIZES} poster={film.posterPortrait} still={film.stillPortrait} />}
          />
        </div>
      </StageSlide>
      <div
        inert={!active}
        className={cn(
          'absolute right-5 bottom-5 z-30 transition-opacity duration-500 ease-out-quint xl:right-7 xl:bottom-7',
          active ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      >
        <VideoToggle
          videoRef={videoRef}
          shouldPlay={video.shouldPlay}
          playing={video.playing}
          mounted={video.mounted}
          onToggle={video.toggle}
          pauseLabel={videoLabels.pause}
          playLabel={videoLabels.play}
          className="bg-ink-950/60"
        />
      </div>
    </>
  );
}
