'use client';

import { useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { ButtonLink, buttonClasses } from '@/components/ui/Button';
import { ArrowLeft, ArrowRight, Instagram } from '@/components/ui/icons';
import { SmartLink } from '@/components/ui/SmartLink';
import { gallery } from '@/content/gallery';
import { legalNav } from '@/content/navigation';
import { cn } from '@/lib/cn';
import { ReelTile } from './ReelTile';

export interface InstagramPost {
  /** Link zum Beitrag, z. B. `https://www.instagram.com/reel/…/`. */
  url: string;
}

const privacy = legalNav.find((item) => item.href === '/datenschutz');

/** „…/reel/ABC/“ → „Reel“, „…/p/ABC/“ → „Beitrag“. */
function postType(url: string): string {
  const kind = new URL(url).pathname.split('/').filter(Boolean)[0] ?? '';
  return gallery.feed.types[kind as keyof typeof gallery.feed.types] ?? gallery.feed.types.p;
}

/** ~1,3 Folien auf dem Smartphone, ~5 ab xl – die angeschnittene nächste Folie zeigt, dass es weitergeht. */
const SLIDE = 'w-[72%] sm:w-[40%] lg:w-[26%] xl:w-[19.5%]';

const NAV =
  'grid size-11 cursor-pointer place-items-center rounded-full border border-line-strong text-fg-muted transition-[border-color,color,background-color,opacity] duration-300 hover:border-sky/60 hover:bg-sky/[0.06] hover:text-sky-300 aria-disabled:pointer-events-none aria-disabled:opacity-35';

interface InstagramFeedProps {
  posts: readonly InstagramPost[];
  profile: { href: string; handle: string };
}

/**
 * Instagram-Reels als Slider – ein Kontaktabzug: Kacheln im Format 4 : 5 zwischen Haarlinien, Wischen mit
 * Einrasten, Blättern per Pfeil-Knöpfen; zum Schluss die Profil-Karte.
 *
 * Jede Kachel führt zum Reel auf Instagram (neuer Tab), abgespielt wird dort. Die Vorschauen kommen per
 * Zwei-Klick-Lösung (DSGVO) von Instagram: Bis zur Einwilligung lädt nichts von Instagram; ein Klick auf
 * „Instagram-Inhalte laden“ lädt alle Vorschauen (Einwilligung gilt bis zum Neuladen).
 */
export function InstagramFeed({ posts, profile }: InstagramFeedProps) {
  const feed = gallery.feed;
  const reduce = useReducedMotion();
  const trackRef = useRef<HTMLUListElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const [consent, setConsent] = useState(false);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  /* Fortschrittslinie und Pfeil-Knöpfe folgen dem Wischen – Breite und Lage der Linie direkt ins DOM, per rAF */
  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;
    let frame = 0;
    const update = () => {
      frame = 0;
      const { scrollLeft, scrollWidth, clientWidth } = track;
      thumb.style.width = `${(clientWidth / scrollWidth) * 100}%`;
      thumb.style.transform = `translateX(${(scrollLeft / clientWidth) * 100}%)`;
      setAtStart(scrollLeft < 2);
      setAtEnd(scrollLeft > scrollWidth - clientWidth - 2);
    };
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    schedule();
    track.addEventListener('scroll', schedule, { passive: true });
    const observer = new ResizeObserver(schedule);
    observer.observe(track);
    return () => {
      window.cancelAnimationFrame(frame);
      track.removeEventListener('scroll', schedule);
      observer.disconnect();
    };
  }, []);

  /** Eine Folie weiter bzw. zurück – rastet an ihrer Vorderkante ein. */
  const step = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const slides = Array.from(track.children) as HTMLElement[];
    const current = track.scrollLeft;
    const target =
      direction > 0
        ? slides.find((slide) => slide.offsetLeft > current + 2)
        : slides.findLast((slide) => slide.offsetLeft < current - 2);
    track.scrollTo({
      left: target?.offsetLeft ?? (direction > 0 ? track.scrollWidth : 0),
      behavior: reduce ? 'auto' : 'smooth',
    });
  };

  const load = () => {
    setConsent(true);
    // Der Knopf verschwindet – der Fokus wandert zum ersten Reel, ohne die Seite zu verschieben
    window.requestAnimationFrame(() => trackRef.current?.querySelector('a')?.focus({ preventScroll: true }));
  };

  return (
    <div>
      <ul
        ref={trackRef}
        aria-label={feed.label}
        /* waagrechtes Wischen (Trackpad) gehört dem Slider, nicht dem Smooth Scrolling der Seite */
        data-lenis-prevent-horizontal
        className="relative scrollbar-none flex snap-x snap-mandatory gap-px overflow-x-auto overscroll-x-contain border border-line bg-line"
      >
        {posts.map((post, index) => {
          const type = postType(post.url);
          return (
            <li
              key={post.url}
              aria-label={`${type} ${index + 1} von ${posts.length}`}
              className={cn('flex shrink-0 snap-start flex-col bg-ink-950', SLIDE)}
            >
              <p className="flex items-center justify-between gap-4 px-5 py-4 sm:px-6">
                <span className="font-mono text-[0.6875rem] text-fg-subtle tabular">{String(index + 1).padStart(2, '0')}</span>
                <span className="text-eyebrow font-medium text-fg-subtle uppercase font-expanded">{type}</span>
              </p>

              <div className="relative aspect-[4/5] flex-1">
                <ReelTile url={post.url} label={`${type} ${index + 1}`} consent={consent} />
              </div>
            </li>
          );
        })}

        <li className="flex w-[82%] shrink-0 snap-end flex-col justify-between gap-12 bg-ink-950 p-6 sm:w-[60%] sm:p-8 lg:w-[40%] xl:w-[34%] xl:p-10">
          <div>
            <p className="flex items-center gap-3 text-eyebrow font-medium text-sky-400 uppercase font-expanded">
              <Instagram aria-hidden className="size-4" />
              {feed.profile.eyebrow}
            </p>
            <p className="mt-6 text-[clamp(1.25rem,0.75rem+1.2vw,1.875rem)] leading-tight font-medium tracking-[-0.025em] [overflow-wrap:anywhere]">
              {profile.handle}
            </p>
            <p className="mt-4 max-w-[40ch] leading-relaxed text-fg-muted">{feed.profile.text}</p>
          </div>
          <ButtonLink href={profile.href} variant="secondary" size="lg" icon={<Instagram />} className="w-full sm:w-auto sm:self-start">
            {feed.profile.cta}
            <span className="sr-only"> auf Instagram (öffnet in neuem Tab)</span>
          </ButtonLink>
        </li>
      </ul>

      {consent ? null : (
        <div className="mt-6 flex flex-col gap-4 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p className="max-w-[64ch] text-[0.8125rem] leading-relaxed text-fg-subtle">
            {feed.consent.note}
            {privacy ? (
              <>
                {' '}
                <SmartLink href={privacy.href} className="underline underline-offset-4 transition-colors duration-300 hover:text-fg">
                  {privacy.label}
                </SmartLink>
              </>
            ) : null}
          </p>
          <button type="button" onClick={load} className={buttonClasses({ variant: 'secondary', className: 'gap-2.5 self-start sm:self-auto' })}>
            <Instagram aria-hidden className="size-4" />
            {feed.consent.load}
          </button>
        </div>
      )}

      <div className="mt-6 flex items-center gap-6 sm:mt-8">
        <div aria-hidden className="h-px flex-1 overflow-hidden bg-line">
          <div ref={thumbRef} className="h-full w-0 bg-gradient-to-r from-sky to-royal-400" />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => step(-1)} aria-disabled={atStart} aria-label={feed.controls.prev} className={NAV}>
            <ArrowLeft aria-hidden className="size-4" />
          </button>
          <button type="button" onClick={() => step(1)} aria-disabled={atEnd} aria-label={feed.controls.next} className={NAV}>
            <ArrowRight aria-hidden className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
