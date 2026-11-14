'use client';

import { stagger, useAnimate } from 'motion/react';
import Image from 'next/image';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { EASE_IN_OUT_QUART, EASE_OUT_EXPO } from '@/lib/motion';
import { useHero } from './HeroStage';
import styles from './hero.module.css';

export interface BrandLogo {
  /** Name des Herstellers (Alt-Text). */
  name: string;
  src: string;
  width: number;
  height: number;
  /** Höhe relativ zur Logoreihe (Standard 1) – breite oder sehr kräftige Marken kleiner, damit sie nicht größer wirken. */
  scale?: number;
}

/** Höchste Logohöhe in px (Reihe ab xl, 5,5rem) – Grundlage für `sizes`. */
const LOGO_MAX_HEIGHT = 88;

export interface ProductLine {
  /** Auftakt, klein wie die Eyebrow. */
  lead: string;
  /** Der große Teil des Satzes (in Versalien gesetzt). */
  statement: string;
  /** Das eine Wort mit Verlaufstext. */
  accent?: string;
  /** Herstellerlogos unter dem Satz – erscheinen ab `scene.logos` nacheinander. */
  logos?: readonly BrandLogo[];
}

interface HeroCopyProps {
  /** Der Hero-Text (Plakette, <h1>, Lead, CTAs) – unverändert gerendert. */
  children: ReactNode;
  /** Sekunden der Film-Schleife: Produkte im Bild (`start`–`end`), Logos ab `logos`. */
  scene: { readonly start: number; readonly logos?: number; readonly end: number };
  /** Dateien des Banner-Films – nur dort gibt es die Szene (auf dem Smartphone läuft der Handwäsche-Film). */
  films: readonly string[];
  line: ProductLine;
  className?: string;
}

/** 0 = Hero-Text · 1 = Produktzeile · 2 = Produktzeile mit Logos. */
type Stage = 0 | 1 | 2;

/** Rückkehr des Hero-Texts im Takt des Auftakts: Eyebrow, Lead, CTAs (Wörter dazwischen, siehe unten). */
const BLOCK_RETURN_DELAYS = [0.3, 0.75, 0.85];

/**
 * Text des Hero im Takt des Banner-Films. Solange die Produkte im Bild sind, treten Eyebrow, Headline, Lead und
 * CTAs zurück – die Wörter gleiten aus ihren Masken nach oben, der Rest blendet aus – und an ihrer Stelle erscheint
 * die Produktzeile: Eine Lichtlinie zieht auf, der Auftakt blendet ein, die großen Wörter steigen aus ihren Masken;
 * ab `scene.logos` steigen darunter die Herstellerlogos nacheinander auf. Danach kehrt der Hero-Text zurück wie beim
 * Laden.
 * Gekoppelt an `currentTime`: Pause hält den Zustand, jede Schleife wiederholt ihn. Die <h1> bleibt im DOM (SEO,
 * Screenreader), die Produktzeile ist rein visuell. Tastatur-Fokus im Hero-Text holt ihn zurück und hält ihn.
 */
export function HeroCopy({ children, scene, films, line, className }: HeroCopyProps) {
  const { videoRef, video, reduceMotion } = useHero();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const [filmStage, setFilmStage] = useState<Stage>(0);
  const [introDone, setIntroDone] = useState(false);
  const [focusHold, setFocusHold] = useState(false);
  const stage: Stage = video.mounted && introDone && !focusHold ? filmStage : 0;

  /* Erst tauschen, wenn der CSS-Auftakt von Wörtern und Blöcken durch ist (läuft ab dem ersten Paint). */
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    let active = true;
    const done = () => {
      if (active) setIntroDone(true);
    };
    const intro = [...root.querySelectorAll(`.${styles.word}, .${styles.rise}`)].flatMap((el) => el.getAnimations());
    Promise.all(intro.map((animation) => animation.finished)).then(done, done);
    return () => {
      active = false;
    };
  }, [scope]);

  /* Filmzeit mitlesen – pro Bild, solange das Video läuft; sonst einmal (Pause, Neuladen). */
  useEffect(() => {
    const element = videoRef.current;
    if (!video.mounted || !element) return;
    let current: Stage | null = null;
    const check = () => {
      const src = element.currentSrc;
      const time = element.currentTime;
      const onFilm = src !== '' && films.some((film) => src.endsWith(film));
      const next: Stage =
        !onFilm || time < scene.start || time >= scene.end ? 0 : scene.logos !== undefined && time >= scene.logos ? 2 : 1;
      if (next !== current) {
        current = next;
        setFilmStage(next);
      }
    };
    let frame = 0;
    const loop = () => {
      check();
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(video.playing ? loop : check);
    element.addEventListener('seeked', check);
    element.addEventListener('loadeddata', check);
    return () => {
      cancelAnimationFrame(frame);
      element.removeEventListener('seeked', check);
      element.removeEventListener('loadeddata', check);
    };
  }, [videoRef, video.mounted, video.playing, films, scene.start, scene.logos, scene.end]);

  /* Tastatur-Fokus (Tab) im Hero-Text: Text zurückholen und halten, bis der Fokus ihn verlässt. */
  useEffect(() => {
    const root = scope.current;
    if (!root) return;
    const onFocusIn = (event: FocusEvent) => {
      if (event.target instanceof Element && event.target.matches(':focus-visible')) setFocusHold(true);
    };
    const onFocusOut = (event: FocusEvent) => {
      if (!(event.relatedTarget instanceof Node && root.contains(event.relatedTarget))) setFocusHold(false);
    };
    root.addEventListener('focusin', onFocusIn);
    root.addEventListener('focusout', onFocusOut);
    return () => {
      root.removeEventListener('focusin', onFocusIn);
      root.removeEventListener('focusout', onFocusOut);
    };
  }, [scope]);

  /* Der Wechsel selbst – nur bei echtem Zustandswechsel, nie beim ersten Rendern. */
  const shown = useRef<Stage>(0);
  useEffect(() => {
    const from = shown.current;
    if (stage === from) return;
    shown.current = stage;
    const root = scope.current;
    if (!root) return;

    const words = [...root.querySelectorAll<HTMLElement>(`.${styles.word}`)];
    const blocks = [...root.querySelectorAll<HTMLElement>(`.${styles.rise}`)];
    const rule = root.querySelector<HTMLElement>('[data-line-rule]');
    const lead = root.querySelector<HTMLElement>('[data-line-lead]');
    const lineWords = [...root.querySelectorAll<HTMLElement>('[data-line-word]')];
    const logos = [...root.querySelectorAll<HTMLElement>('[data-line-logo]')];
    if (!rule || !lead || lineWords.length === 0) return;

    // „Bewegung reduzieren“ (Video nur auf Wunsch): nur überblenden
    const fade = { duration: 0.45, ease: EASE_IN_OUT_QUART };
    /** Logos: nacheinander weich nach oben. */
    const showLogos = (startDelay: number) => {
      if (logos.length === 0) return;
      if (reduceMotion) animate(logos, { opacity: [0, 1], y: 0 }, { ...fade, delay: startDelay });
      else
        animate(
          logos,
          { opacity: [0, 1], y: [16, 0] },
          { duration: 1, ease: EASE_OUT_EXPO, delay: stagger(0.12, { startDelay }) },
        );
    };
    const hideLogos = () => {
      if (logos.length > 0) animate(logos, reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }, fade);
    };

    // Produktzeile steht schon – nur die Logos kommen bzw. gehen (Sekunde `scene.logos`, Spulen)
    if (from !== 0 && stage !== 0) {
      if (stage === 2) showLogos(0);
      else hideLogos();
      return;
    }

    if (stage !== 0) {
      blocks.forEach((block) => (block.style.pointerEvents = 'none'));
      if (reduceMotion) {
        animate([...words, ...blocks], { opacity: 0 }, fade);
        animate([rule, lead, ...lineWords], { opacity: [0, 1], y: 0, scaleX: 1 }, fade);
        if (stage === 2) showLogos(0.35);
        return;
      }
      // Hero-Text geht: Wörter nach oben aus den Masken, Eyebrow/Lead/CTAs blenden aus
      animate(words, { y: '-112%' }, { duration: 0.6, ease: EASE_IN_OUT_QUART, delay: stagger(0.04) });
      animate(blocks, { opacity: 0, y: -14 }, { duration: 0.5, ease: EASE_IN_OUT_QUART, delay: stagger(0.06) });
      // Produktzeile kommt: Lichtlinie, Auftakt, große Wörter steigen aus ihren Masken (ohne `filter` – Unschärfe
      // über dem Video hinterließ beim Unterbrechen dunkle Rechtecke)
      rule.style.transformOrigin = 'left center';
      animate(rule, { scaleX: [0, 1], opacity: 1 }, { duration: 1.1, ease: EASE_OUT_EXPO, delay: 0.45 });
      animate(lead, { opacity: [0, 1], y: [10, 0] }, { duration: 0.9, ease: EASE_OUT_EXPO, delay: 0.6 });
      animate(
        lineWords,
        { y: ['112%', '0%'], opacity: 1 },
        { duration: 1.2, ease: EASE_OUT_EXPO, delay: stagger(0.1, { startDelay: 0.55 }) },
      );
      // Direkt in die Logo-Phase (erster Durchlauf, Spulen): Logos erst, wenn die Wörter stehen
      if (stage === 2) showLogos(1.5);
      return;
    }

    blocks.forEach((block) => (block.style.pointerEvents = ''));
    hideLogos();
    if (reduceMotion) {
      animate([rule, lead, ...lineWords], { opacity: 0 }, fade);
      animate([...words, ...blocks], { opacity: 1, y: 0 }, { ...fade, delay: 0.35 });
      return;
    }
    // Produktzeile geht: Wörter nach oben, Auftakt blendet aus, die Linie zieht nach rechts ab
    animate(lineWords, { y: '-112%' }, { duration: 0.55, ease: EASE_IN_OUT_QUART, delay: stagger(0.05) });
    animate(lead, { opacity: 0, y: -10 }, { duration: 0.45, ease: EASE_IN_OUT_QUART });
    rule.style.transformOrigin = 'right center';
    animate(rule, { scaleX: 0 }, { duration: 0.6, ease: EASE_IN_OUT_QUART });
    // Hero-Text kommt zurück wie beim Laden: Wörter steigen aus den Masken, Eyebrow/Lead/CTAs gleiten hoch
    animate(
      words,
      { y: ['112%', '0%'], opacity: 1 },
      { duration: 1.2, ease: EASE_OUT_EXPO, delay: stagger(0.07, { startDelay: 0.4 }) },
    );
    animate(
      blocks,
      { opacity: [0, 1], y: [18, 0] },
      { duration: 1, ease: EASE_OUT_EXPO, delay: (i) => BLOCK_RETURN_DELAYS[i] ?? 0.85 },
    );
  }, [stage, reduceMotion, animate, scope]);

  const accent = line.accent?.toLowerCase();
  const statement = line.statement.split(' ');

  return (
    <div ref={scope} className={className}>
      {children}

      {/* Produktzeile – an der Stelle des Hero-Texts, unten bündig; bis zum ersten Wechsel unsichtbar */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0">
        <p className="flex items-center gap-4 text-eyebrow leading-none font-medium text-sky-300 uppercase [text-shadow:0_0_2px_rgb(3_5_15/0.7),0_1px_18px_rgb(3_5_15/0.95)] font-expanded">
          <span
            data-line-rule
            className="h-px w-10 shrink-0 bg-[linear-gradient(90deg,var(--color-sky-300),var(--color-royal-400))] sm:w-14"
            style={{ transform: 'scaleX(0)' }}
          />
          <span data-line-lead style={{ opacity: 0 }}>
            {line.lead}
          </span>
        </p>
        <p className="mt-5 text-[clamp(1.5rem,3.9vw,3.75rem)] leading-[0.95] font-medium text-fg uppercase font-expanded sm:mt-6">
          {statement.map((word, i) => (
            <span key={`${word}-${i}`}>
              <span className="-mx-[0.06em] -mb-[0.14em] inline-block overflow-hidden px-[0.06em] pb-[0.14em] align-bottom">
                <span
                  data-line-word
                  className={cn('inline-block', word.toLowerCase() === accent && 'text-wave')}
                  style={{ transform: 'translateY(112%)' }}
                >
                  {word}
                </span>
              </span>
              {i < statement.length - 1 ? ' ' : null}
            </span>
          ))}
        </p>
        {line.logos && line.logos.length > 0 ? (
          <ul className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-4 [--logo-h:3.5rem] sm:mt-7 sm:[--logo-h:4rem] lg:gap-x-10 lg:[--logo-h:5rem] xl:[--logo-h:5.5rem]">
            {line.logos.map((logo) => (
              <li key={logo.src} data-line-logo style={{ opacity: 0 }}>
                <Image
                  src={logo.src}
                  alt={logo.name}
                  width={logo.width}
                  height={logo.height}
                  // größte Breite (ab xl), auf 10 px aufgerundet
                  sizes={`${Math.ceil((LOGO_MAX_HEIGHT * (logo.scale ?? 1) * logo.width) / logo.height / 10) * 10}px`}
                  quality={90}
                  className="h-[calc(var(--logo-h)*var(--logo-scale,1))] w-auto"
                  style={logo.scale ? ({ '--logo-scale': logo.scale } as CSSProperties) : undefined}
                />
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
}
