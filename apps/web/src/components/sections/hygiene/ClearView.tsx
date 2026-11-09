'use client';

import {
  animate,
  motion,
  useInView,
  useMotionValueEvent,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type AnimationPlaybackControls,
} from 'motion/react';
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { LoopVideoMedia } from '@/components/media/LoopVideoMedia';
import { useLoopVideo } from '@/components/media/useLoopVideo';
import { PORTRAIT_QUERY, VideoPoster } from '@/components/media/VideoPoster';
import { VideoToggle } from '@/components/media/VideoToggle';
import { steamFilm, videoLabels } from '@/content/media';
import { cn } from '@/lib/cn';

interface ClearViewProps {
  /** Linke (beschlagene) und rechte (klare) Seite sowie Name des Reglers. */
  labels: { before: string; after: string; slider: string };
  className?: string;
}

const SIZES = '(min-width: 1440px) 900px, (min-width: 1024px) 64vw, 100vw';
const SOURCES = [{ src: steamFilm.sources.portrait, media: PORTRAIT_QUERY }, { src: steamFilm.sources.landscape }];

/** Ruhelage der Trennlinie nach dem Auftakt (Prozent von links). */
const REST = 46;
const clamp = (value: number) => Math.min(100, Math.max(0, value));

/**
 * „Klarsicht“: das Trockendampf-Video liegt links hinter Milchglas – beschlagen, matt, kühl –
 * rechts gestochen klar. Beim Hineinscrollen wischt die Trennlinie das Glas einmal frei wie ein Abzieher;
 * danach lässt sie sich ziehen (Maus/Touch, horizontal) oder per Pfeiltasten verschieben.
 * Ein Video, eine Glasschicht (backdrop-filter) – kein zweites Video, das aus dem Takt laufen könnte.
 */
export function ClearView({ labels, className }: ClearViewProps) {
  const { frameRef, videoRef, video } = useLoopVideo();
  const reduce = useReducedMotion();
  const inView = useInView(frameRef, { once: true, amount: 0.45 });

  const position = useMotionValue(100);
  const [value, setValue] = useState(100);
  const intro = useRef<AnimationPlaybackControls | null>(null);
  const touched = useRef(false);
  const dragging = useRef(false);

  const glassClip = useTransform(position, (p) => `inset(0 ${100 - p}% 0 0)`);
  const handleLeft = useTransform(position, (p) => `${p}%`);
  const beforeOpacity = useTransform(position, [4, 18], [0, 1]);
  const afterOpacity = useTransform(position, [82, 96], [1, 0]);
  useMotionValueEvent(position, 'animationComplete', () => setValue(Math.round(position.get())));

  /* Auftakt: einmal freiwischen (bei „Bewegung reduzieren“ ohne Übergang in die Ruhelage) */
  useEffect(() => {
    if (touched.current || (!reduce && !inView)) return;
    intro.current = animate(
      position,
      REST,
      reduce ? { duration: 0 } : { duration: 2.2, delay: 0.35, ease: [0.65, 0, 0.35, 1] },
    );
    return () => intro.current?.stop();
  }, [inView, reduce, position]);

  const takeOver = () => {
    touched.current = true;
    intro.current?.stop();
  };

  const moveTo = (clientX: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    position.set(clamp(((clientX - rect.left) / rect.width) * 100));
  };

  const onPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || (event.target as HTMLElement).closest('button')) return;
    takeOver();
    dragging.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);
    moveTo(event.clientX, event.currentTarget);
  };
  const onPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (dragging.current) moveTo(event.clientX, event.currentTarget);
  };
  const onPointerEnd = () => {
    if (!dragging.current) return;
    dragging.current = false;
    setValue(Math.round(position.get()));
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const current = position.get();
    const steps: Partial<Record<string, number>> = {
      ArrowLeft: current - 5,
      ArrowDown: current - 5,
      ArrowRight: current + 5,
      ArrowUp: current + 5,
      PageDown: current - 20,
      PageUp: current + 20,
      Home: 0,
      End: 100,
    };
    const next = steps[event.key];
    if (next === undefined) return;
    event.preventDefault();
    takeOver();
    const target = clamp(next);
    animate(position, target, { duration: reduce ? 0 : 0.35, ease: [0.22, 1, 0.36, 1] });
    setValue(Math.round(target));
  };

  return (
    <div
      ref={frameRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerEnd}
      onPointerCancel={onPointerEnd}
      className={cn(
        'group/clear relative isolate cursor-ew-resize touch-pan-y overflow-hidden bg-ink-850 select-none',
        'shadow-[0_60px_120px_-50px_rgb(1_13_97/0.6)]',
        className,
      )}
    >
      <LoopVideoMedia
        videoRef={videoRef}
        video={video}
        sources={SOURCES}
        className="object-[62%_50%]"
        poster={
          <VideoPoster
            alt={steamFilm.alt}
            sizes={SIZES}
            poster={steamFilm.poster}
            posterPortrait={steamFilm.posterPortrait}
            still={steamFilm.still}
            stillPortrait={steamFilm.stillPortrait}
            className="object-[62%_50%]"
          />
        }
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(3_5_15/0.35),transparent_30%,transparent_65%,rgb(3_5_15/0.45))]" />

      {/* Milchglas: weichgezeichnet, aufgehellt, entsättigt – mit feinem Beschlag-Korn */}
      <motion.div
        aria-hidden
        style={{ clipPath: glassClip }}
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(160deg,rgb(255_255_255/0.66),rgb(228_245_254/0.5)_45%,rgb(255_255_255/0.6))] backdrop-blur-[16px] backdrop-brightness-[1.6] backdrop-saturate-[0.35]"
      >
        <span className="absolute inset-0 bg-grain opacity-[0.22] mix-blend-soft-light" />
        {/* Beschlag sammelt sich unten etwas dichter */}
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(0deg,rgb(255_255_255/0.35),transparent)]" />
      </motion.div>

      {/* Beschriftung der beiden Seiten */}
      <motion.span
        aria-hidden
        style={{ opacity: beforeOpacity }}
        className="pointer-events-none absolute top-5 left-5 flex items-center gap-2.5 rounded-full bg-white px-3.5 py-2 text-eyebrow font-medium text-navy uppercase font-expanded sm:top-7 sm:left-7"
      >
        <span className="size-1.5 rounded-full bg-paper-muted/60" />
        {labels.before}
      </motion.span>
      <motion.span
        aria-hidden
        style={{ opacity: afterOpacity }}
        className="pointer-events-none absolute top-5 right-5 flex items-center gap-2.5 rounded-full border border-white/20 bg-ink-950/70 px-3.5 py-2 text-eyebrow font-medium text-fg uppercase font-expanded sm:top-7 sm:right-7"
      >
        <span className="size-1.5 rounded-full bg-sky" />
        {labels.after}
      </motion.span>

      {/* Trennlinie wie ein Abzieher: Lichtkante + Griff */}
      <motion.div style={{ left: handleLeft }} className="pointer-events-none absolute inset-y-0 w-0">
        <span
          aria-hidden
          className="absolute inset-y-0 -left-px w-0.5 bg-white"
        />
        <div
          role="slider"
          tabIndex={0}
          aria-label={labels.slider}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={value}
          aria-valuetext={`${labels.before} ${value} %, ${labels.after} ${100 - value} %`}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          className="pointer-events-auto absolute top-1/2 left-0 grid size-14 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-white text-navy ring-1 ring-black/10 transition-transform duration-300 ease-out-quint group-active/clear:scale-95 hover:scale-105"
        >
          <svg aria-hidden viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
            <path d="m9 7-5 5 5 5M15 7l5 5-5 5" />
          </svg>
        </div>
      </motion.div>

      {/* unten links – rechts unten greift auf Desktop die Vorteils-Karte über das Video */}
      <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6">
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
    </div>
  );
}
