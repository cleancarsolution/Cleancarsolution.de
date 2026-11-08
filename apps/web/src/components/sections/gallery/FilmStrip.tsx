'use client';

import Image from 'next/image';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';

interface Frame {
  src: string;
  caption: string;
  alt: string;
  timecode: string;
  focus: string;
}

interface FilmStripProps {
  images: readonly Frame[];
  label: string;
}

/** Desktop: horizontal gescrollter Streifen (Sticky-Bühne). Mobile & „Bewegung reduzieren“: Wischen mit Einrasten. */
export function FilmStrip({ images, label }: FilmStripProps) {
  const reduce = useReducedMotion();
  return (
    <>
      <SwipeStrip images={images} label={label} className={reduce ? undefined : 'lg:hidden'} />
      {reduce ? null : <ScrollStrip images={images} label={label} />}
    </>
  );
}

function Caption({ frame, index }: { frame: Frame; index: number }) {
  return (
    <figcaption className="mt-4 flex items-center justify-between gap-4 font-mono text-[0.6875rem] tracking-[0.16em] uppercase">
      <span className="flex items-center gap-3">
        <span className="text-sky-400 tabular">{String(index + 1).padStart(2, '0')}</span>
        <span className="text-fg">{frame.caption}</span>
      </span>
      <span className="text-fg-subtle tabular">TC {frame.timecode}</span>
    </figcaption>
  );
}

/* ── Desktop: vertikales Scrollen → horizontale Fahrt ────────────────────── */

function ScrollStrip({ images, label }: FilmStripProps) {
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: stageRef, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance]);
  const drift = useTransform(scrollYProgress, [0, 1], ['3%', '-3%']);
  const progress = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div ref={stageRef} className="relative hidden lg:block" style={{ height: `calc(100svh + ${distance}px)` }}>
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <motion.ul
          ref={trackRef}
          aria-label={label}
          style={{ x }}
          className="flex w-max gap-6 px-12 will-change-transform 2xl:gap-8 2xl:px-16"
        >
          {images.map((frame, i) => (
            <li key={frame.src} className="w-[min(56vw,62rem)] shrink-0">
              <figure>
                <div className="relative aspect-video overflow-hidden bg-ink-850 ring-1 ring-white/[0.06]">
                  <motion.div className="absolute -inset-x-[6%] inset-y-0" style={{ x: drift }}>
                    <Image src={frame.src} alt={frame.alt} fill sizes="60vw" className="object-cover" />
                  </motion.div>
                  <div aria-hidden className="pointer-events-none absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" />
                </div>
                <Caption frame={frame} index={i} />
              </figure>
            </li>
          ))}
        </motion.ul>

        <div aria-hidden className="mx-12 mt-12 h-px bg-line 2xl:mx-16">
          <motion.div className="h-full origin-left bg-gradient-to-r from-sky to-royal-400" style={{ scaleX: progress }} />
        </div>
      </div>
    </div>
  );
}

/* ── Mobile: Wischen mit Einrasten ───────────────────────────────────────── */

function SwipeStrip({ images, label, className }: FilmStripProps & { className?: string }) {
  return (
    <div className={cn('pt-12 pb-24 sm:pt-16 sm:pb-32', className)}>
      {/* fokussierbar, damit sich der Streifen auch per Tastatur (Pfeiltasten) scrollen lässt */}
      <ul
        aria-label={label}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-5 px-5 scrollbar-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-sky sm:scroll-px-8 sm:px-8"
      >
        {images.map((frame, i) => (
          <li key={frame.src} className="w-[82vw] max-w-[34rem] shrink-0 snap-start">
            <figure>
              <div className="relative aspect-[4/5] overflow-hidden bg-ink-850 ring-1 ring-white/[0.06] sm:aspect-[4/3]">
                <Image
                  src={frame.src}
                  alt={frame.alt}
                  fill
                  sizes="(min-width: 640px) 34rem, 82vw"
                  className="object-cover"
                  style={{ objectPosition: frame.focus }}
                />
              </div>
              <Caption frame={frame} index={i} />
            </figure>
          </li>
        ))}
      </ul>
    </div>
  );
}
