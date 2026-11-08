'use client';

import { motion, useTransform } from 'motion/react';
import type { CSSProperties, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useHero } from './HeroStage';
import styles from './hero.module.css';

interface HeroMediaProps {
  /** Server-gerendertes <picture>: Poster (erster Frame) bzw. Standbild bei „Bewegung reduzieren“. */
  picture: ReactNode;
  sources: { portrait: string; medium: string; large: string };
  /** Bildausschnitt – das Auto steht rechts, links bleibt Raum für die Headline. */
  objectPosition: string;
}

/**
 * Vollflächiger Banner-Film. Erste Farbe ist sofort da (Poster = erster Frame, CSS-Auftakt aus dem
 * Schwarz mit 1,08 → 1), das Video blendet darüber, sobald es läuft.
 * Beim Herausscrollen zieht das Bild leicht nach (≤ 12 %) und wächst minimal.
 */
export function HeroMedia({ picture, sources, objectPosition }: HeroMediaProps) {
  const { progress, reduceMotion, videoRef, video } = useHero();
  const scrollScale = useTransform(progress, [0, 1], [1, reduceMotion ? 1 : 1.1]);
  const scrollY = useTransform(progress, [0, 1], ['0%', reduceMotion ? '0%' : '12%']);

  return (
    <motion.div style={{ scale: scrollScale, y: scrollY }} className="absolute inset-0 -z-20">
      <div
        className={cn('absolute inset-0', styles.media)}
        style={{ '--hero-object': objectPosition } as CSSProperties}
      >
        {picture}
        {video.mounted ? (
          <video
            ref={videoRef}
            aria-hidden
            tabIndex={-1}
            autoPlay={video.shouldPlay}
            muted
            loop
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            onPlaying={video.onPlaying}
            onPause={video.onPause}
            className={cn(
              'absolute inset-0 size-full object-cover object-(--hero-object) transition-opacity duration-[1400ms] ease-out',
              video.revealed ? 'opacity-100' : 'opacity-0',
            )}
          >
            <source media="(max-aspect-ratio: 3/4)" src={sources.portrait} type="video/mp4" />
            <source media="(max-width: 1100px)" src={sources.medium} type="video/mp4" />
            <source src={sources.large} type="video/mp4" />
          </video>
        ) : null}
      </div>
    </motion.div>
  );
}
