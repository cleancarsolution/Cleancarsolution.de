'use client';

import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { LoopVideoMedia } from '@/components/media/LoopVideoMedia';
import { useLoopVideo } from '@/components/media/useLoopVideo';
import { PORTRAIT_QUERY, VideoPoster } from '@/components/media/VideoPoster';
import { VideoToggle } from '@/components/media/VideoToggle';
import { Sparkle } from '@/components/ui/Sparkle';
import { studioFilm, videoLabels } from '@/content/media';
import { cn } from '@/lib/cn';

interface StudioBandProps {
  caption: string;
  className?: string;
}

const SIZES = '(min-width: 1440px) 1344px, (min-width: 640px) 92vw, 100vw';

const SOURCES = [
  { src: studioFilm.sources.portrait, media: PORTRAIT_QUERY },
  { src: studioFilm.sources.medium, media: '(max-width: 1100px)' },
  { src: studioFilm.sources.large },
];

/**
 * Cinematisches Filmband mit dem Studio-Video: öffnet sich beim Hineinscrollen wie eine
 * Blende (clip-path), das Bild zieht leicht nach (Parallax ≤ 12 %). Das Video lädt erst kurz vorher und
 * läuft nur, solange es sichtbar ist; Pause/Play unten rechts. Bei „Bewegung reduzieren“: Standbild.
 */
export function StudioBand({ caption, className }: StudioBandProps) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { frameRef, videoRef, video } = useLoopVideo();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });

  const clipPath = useTransform(scrollYProgress, [0, 0.38], ['inset(7% 5% 7% 5%)', 'inset(0% 0% 0% 0%)']);
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);
  const scale = useTransform(scrollYProgress, [0, 0.38], [1.08, 1]);

  return (
    <figure ref={ref} className={cn('relative aspect-[4/5] sm:aspect-[16/9] lg:aspect-[2.35/1]', className)}>
      <motion.div
        ref={frameRef}
        className="absolute inset-0 overflow-hidden bg-ink-850"
        style={reduce ? undefined : { clipPath }}
      >
        <motion.div className="absolute inset-x-0 -top-[6%] h-[112%]" style={reduce ? undefined : { y, scale }}>
          <LoopVideoMedia
            videoRef={videoRef}
            video={video}
            sources={SOURCES}
            className="object-[60%_50%] sm:object-center"
            poster={
              <VideoPoster
                alt={studioFilm.alt}
                sizes={SIZES}
                poster={studioFilm.poster}
                posterPortrait={studioFilm.posterPortrait}
                still={studioFilm.still}
                stillPortrait={studioFilm.stillPortrait}
                className="object-[60%_50%] sm:object-center"
              />
            }
          />
        </motion.div>

        {/* Lesbarkeit & Tiefe: Studio-Dunkel von unten, leichte Vignette, Korn */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgb(3_5_15/0.55)_100%)]"
        />
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-950/85 to-transparent" />
        <div aria-hidden className="absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" />
        <div aria-hidden className="absolute inset-0 ring-1 ring-white/[0.06] ring-inset" />

        <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-6 p-5 sm:p-8 lg:p-10">
          <span className="flex items-center gap-3 text-eyebrow font-medium text-fg/85 uppercase font-expanded">
            <Sparkle className="size-2.5 text-sky-400" />
            {caption}
          </span>
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
        </figcaption>
      </motion.div>
    </figure>
  );
}
