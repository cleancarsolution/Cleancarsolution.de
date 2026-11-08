'use client';

import { VideoToggle as Toggle } from '@/components/media/VideoToggle';
import { useHero } from './HeroStage';

interface VideoToggleProps {
  pauseLabel: string;
  playLabel: string;
  className?: string;
}

/** Pause/Play des Hero-Videos – Zustand aus der Hero-Bühne. */
export function VideoToggle({ pauseLabel, playLabel, className }: VideoToggleProps) {
  const { video, videoRef } = useHero();

  return (
    <Toggle
      videoRef={videoRef}
      shouldPlay={video.shouldPlay}
      playing={video.playing}
      mounted={video.mounted}
      onToggle={video.toggle}
      pauseLabel={pauseLabel}
      playLabel={playLabel}
      className={className}
    />
  );
}
