'use client';

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react';
import { useMediaPreferences } from '@/lib/media';

/** Zustand des Videos – bewusst ohne Refs, damit er im Render gelesen werden darf. */
export interface LoopVideoState {
  reduceMotion: boolean;
  /** Video-Element ist eingehängt (erst in Reichweite, nie bei „Bewegung reduzieren“ – außer auf Wunsch). */
  mounted: boolean;
  /** Absicht: soll laufen (steuert Button-Zustand und Wiedergabe). */
  shouldPlay: boolean;
  /** Erstes Bild ist da – das Video blendet über das Poster. */
  revealed: boolean;
  /** Tatsächlicher Zustand des Elements (für den Fortschrittsring). */
  playing: boolean;
  toggle: () => void;
  onPlaying: () => void;
  onPause: () => void;
}

export interface LoopVideo {
  /** Am beobachteten Rahmen anbringen (Sichtbarkeit steuert Laden & Wiedergabe). */
  frameRef: RefObject<HTMLDivElement | null>;
  /** Das <video>-Element (getrennt vom Zustand, damit nur Effekte/Handler darauf zugreifen). */
  videoRef: RefObject<HTMLVideoElement | null>;
  video: LoopVideoState;
}

interface LoopVideoOptions {
  /**
   * Von außen gesteuert (z. B. Menü offen): ersetzt die Sichtbarkeits-Beobachtung –
   * eingehängt wird beim ersten `true`, gespielt nur solange `true`.
   */
  active?: boolean;
  /**
   * Zusätzliche Bedingung zur Sichtbarkeit (z. B. Folie einer Bühne liegt vorn):
   * eingehängt wird erst, wenn sie einmal erfüllt ist, gespielt nur solange.
   */
  enabled?: boolean;
  /** Vorlauf, ab dem das Video geladen wird. */
  rootMargin?: string;
}

/**
 * Stummes Schleifen-Video im Seitenfluss: lädt erst kurz bevor es ins Bild kommt, spielt nur sichtbar,
 * respektiert „Bewegung reduzieren“ und Datensparmodus (dann bleibt das Standbild, Abspielen per Button).
 */
export function useLoopVideo({ active, enabled = true, rootMargin = '35% 0px' }: LoopVideoOptions = {}): LoopVideo {
  const frameRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { reduceMotion, autoplay } = useMediaPreferences();
  const controlled = active !== undefined;

  /** Ausdrücklicher Wunsch per Button – `null` = Standardverhalten. */
  const [wantPlay, setWantPlay] = useState<boolean | null>(null);
  const [near, setNear] = useState(false);
  const [wasEnabled, setWasEnabled] = useState(enabled);
  const [inView, setInView] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);

  if (controlled && active && !near) setNear(true);
  if (enabled && !wasEnabled) setWasEnabled(true);

  const visible = (controlled ? Boolean(active) : inView) && enabled;
  const shouldPlay = wantPlay ?? autoplay;
  const mounted = near && wasEnabled && (autoplay || wantPlay !== null);

  /* In Reichweite → einhängen (einmalig) */
  useEffect(() => {
    const frame = frameRef.current;
    if (controlled || !frame) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin },
    );
    observer.observe(frame);
    return () => observer.disconnect();
  }, [controlled, rootMargin]);

  /* Sichtbar → spielen, sonst pausieren (Akku/CPU) */
  useEffect(() => {
    const frame = frameRef.current;
    if (controlled || !frame) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.05,
    });
    observer.observe(frame);
    return () => observer.disconnect();
  }, [controlled]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mounted) return;
    if (shouldPlay && visible) {
      video.muted = true;
      video.play().catch(() => {
        // Autoplay blockiert (z. B. Energiesparmodus) → Button zeigt „abspielen“.
        if (wantPlay === null) setWantPlay(false);
      });
    } else {
      video.pause();
    }
  }, [mounted, shouldPlay, visible, wantPlay]);

  const toggle = useCallback(() => {
    setNear(true);
    setWantPlay(!shouldPlay);
  }, [shouldPlay]);
  const onPlaying = useCallback(() => {
    setRevealed(true);
    setPlaying(true);
  }, []);
  const onPause = useCallback(() => setPlaying(false), []);

  return {
    frameRef,
    videoRef,
    video: { reduceMotion, mounted, shouldPlay, revealed, playing, toggle, onPlaying, onPause },
  };
}
