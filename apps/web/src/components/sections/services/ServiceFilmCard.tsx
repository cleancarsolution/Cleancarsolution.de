'use client';

import type { CSSProperties } from 'react';
import { LoopVideoMedia } from '@/components/media/LoopVideoMedia';
import { useLoopVideo } from '@/components/media/useLoopVideo';
import { VideoPoster } from '@/components/media/VideoPoster';
import { VideoToggle } from '@/components/media/VideoToggle';
import { videoLabels, type ServiceFilm } from '@/content/media';

const SIZES = '(min-width: 640px) 90vw, 100vw';

/**
 * Film einer Leistung im Bildrahmen ihrer Karte (Mobile/Tablet, Querformat): lädt kurz bevor er ins Bild
 * kommt, spielt nur sichtbar, Pause/Play unten rechts. Bei „Bewegung reduzieren“: Standbild.
 * Füllt den (relativ positionierten) Rahmen vollständig.
 */
export function ServiceFilmCard({ film }: { film: ServiceFilm }) {
  const { frameRef, videoRef, video } = useLoopVideo();

  return (
    <div ref={frameRef} className="absolute inset-0" style={{ '--film-object': film.position } as CSSProperties}>
      <LoopVideoMedia
        videoRef={videoRef}
        video={video}
        sources={[{ src: film.sources.landscape }]}
        className="object-(--film-object)"
        poster={
          <VideoPoster alt={film.alt} sizes={SIZES} poster={film.poster} still={film.still} className="object-(--film-object)" />
        }
      />
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(180deg,transparent_55%,rgb(3_5_15/0.7))]" />
      <div className="absolute right-3 bottom-3 sm:right-4 sm:bottom-4">
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
