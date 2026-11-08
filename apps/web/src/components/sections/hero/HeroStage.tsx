'use client';

import { MotionConfig, useScroll, type MotionValue } from 'motion/react';
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { cn } from '@/lib/cn';
import { useMediaPreferences } from '@/lib/media';

interface HeroVideo {
  /** Video-Element ist eingehängt (nicht bei „Bewegung reduzieren“ / Datensparmodus, außer auf Wunsch). */
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

interface HeroContextValue {
  /** 0 = Hero oben bündig, 1 = Hero komplett herausgescrollt. */
  progress: MotionValue<number>;
  /** „Bewegung reduzieren“ aktiv (Server: true → kein Video im HTML). */
  reduceMotion: boolean;
  /** Das <video>-Element (getrennt vom Zustand, damit nur Effekte/Handler darauf zugreifen). */
  videoRef: RefObject<HTMLVideoElement | null>;
  video: HeroVideo;
}

const HeroContext = createContext<HeroContextValue | null>(null);

export function useHero(): HeroContextValue {
  const value = use(HeroContext);
  if (!value) throw new Error('useHero() muss innerhalb von <HeroStage> verwendet werden.');
  return value;
}

interface HeroStageProps {
  id: string;
  labelledBy: string;
  className?: string;
  children: ReactNode;
}

/**
 * Bühne des Hero: liefert Scroll-Fortschritt (für Drift/Parallax) und die Video-Steuerung
 * (Autoplay nur ohne „Bewegung reduzieren“ und ohne Datensparmodus; pausiert außerhalb des Viewports).
 * `data-paused` am <section> hält auch die rotierende Preis-Plakette an.
 */
export function HeroStage({ id, labelledBy, className, children }: HeroStageProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  const { reduceMotion, autoplay } = useMediaPreferences();

  /** Ausdrücklicher Wunsch per Button – `null` = Standardverhalten. */
  const [wantPlay, setWantPlay] = useState<boolean | null>(null);
  const [inView, setInView] = useState(true);
  const [revealed, setRevealed] = useState(false);
  const [playing, setPlaying] = useState(false);

  const shouldPlay = wantPlay ?? autoplay;
  const mounted = autoplay || wantPlay !== null;

  /* Außerhalb des Viewports pausieren (Akku/CPU), beim Zurückkehren weiterlaufen. */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => setInView(Boolean(entry?.isIntersecting)), {
      threshold: 0.02,
    });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  /* Element mit Absicht & Sichtbarkeit synchronisieren. */
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !mounted) return;
    if (shouldPlay && inView) {
      video.muted = true;
      video.play().catch(() => {
        // Autoplay blockiert (z. B. Energiesparmodus) → Button zeigt „abspielen“.
        if (wantPlay === null) setWantPlay(false);
      });
    } else {
      video.pause();
    }
  }, [mounted, shouldPlay, inView, wantPlay]);

  const toggle = useCallback(() => setWantPlay(!shouldPlay), [shouldPlay]);
  const onPlaying = useCallback(() => {
    setRevealed(true);
    setPlaying(true);
  }, []);
  const onPause = useCallback(() => setPlaying(false), []);

  const value = useMemo<HeroContextValue>(
    () => ({
      progress: scrollYProgress,
      reduceMotion,
      videoRef,
      video: { mounted, shouldPlay, revealed, playing, toggle, onPlaying, onPause },
    }),
    [scrollYProgress, reduceMotion, mounted, shouldPlay, revealed, playing, toggle, onPlaying, onPause],
  );

  return (
    <HeroContext value={value}>
      {/* „Bewegung reduzieren“: Transforms springen sofort ans Ziel, Einblendungen bleiben. */}
      <MotionConfig reducedMotion="user">
        <section
          ref={sectionRef}
          id={id}
          aria-labelledby={labelledBy}
          data-paused={shouldPlay ? undefined : ''}
          className={cn('group/hero', className)}
        >
          {children}
        </section>
      </MotionConfig>
    </HeroContext>
  );
}
