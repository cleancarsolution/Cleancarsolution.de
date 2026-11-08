'use client';

import type { ReactNode, RefObject } from 'react';
import { cn } from '@/lib/cn';
import type { LoopVideoState } from './useLoopVideo';

export interface VideoSource {
  src: string;
  /** Medienabfrage für Art Direction, z. B. `(max-aspect-ratio: 3/4)` – die erste passende Quelle gewinnt. */
  media?: string;
}

interface LoopVideoMediaProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  video: LoopVideoState;
  sources: readonly VideoSource[];
  /** Poster/Standbild darunter (füllt den Rahmen), z. B. `<VideoPoster />`. */
  poster: ReactNode;
  className?: string;
}

/**
 * Poster + stummes Schleifen-Video übereinander (beide absolut, rahmenfüllend).
 * Das Video blendet erst über das Poster, wenn das erste Bild läuft – kein schwarzer Blitz.
 */
export function LoopVideoMedia({ videoRef, video, sources, poster, className }: LoopVideoMediaProps) {
  return (
    <>
      {poster}
      {video.mounted ? (
        <video
          ref={videoRef}
          aria-hidden
          tabIndex={-1}
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          onPlaying={video.onPlaying}
          onPause={video.onPause}
          className={cn(
            'absolute inset-0 size-full object-cover transition-opacity duration-[1200ms] ease-out',
            video.revealed ? 'opacity-100' : 'opacity-0',
            className,
          )}
        >
          {sources.map((source) => (
            <source key={source.src} media={source.media} src={source.src} type="video/mp4" />
          ))}
        </video>
      ) : null}
    </>
  );
}
