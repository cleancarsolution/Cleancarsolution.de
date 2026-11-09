'use client';

import { useEffect, useState } from 'react';
import { ButtonLink } from '@/components/ui/Button';
import { Instagram } from '@/components/ui/icons';
import { SliderControls, useSnapSlider } from '@/components/ui/SnapSlider';
import { gallery } from '@/content/gallery';
import { cn } from '@/lib/cn';
import { ReelTile } from './ReelTile';

export interface InstagramPost {
  /** Link zum Beitrag, z. B. `https://www.instagram.com/reel/…/`. */
  url: string;
  /** Instagram schreibt „Auf Instagram ansehen“ selbst in die Vorschau (Reel lässt sich eingebettet nicht abspielen). */
  instagramLabel?: boolean;
}

/** „…/reel/ABC/“ → „Reel“, „…/p/ABC/“ → „Beitrag“. */
function postType(url: string): string {
  const kind = new URL(url).pathname.split('/').filter(Boolean)[0] ?? '';
  return gallery.feed.types[kind as keyof typeof gallery.feed.types] ?? gallery.feed.types.p;
}

/** ~1,3 Folien auf dem Smartphone, ~2,6 ab lg, ~3,2 ab xl – die angeschnittene nächste Folie zeigt, dass es weitergeht. */
const SLIDE = 'w-[72%] sm:w-[40%] lg:w-[36%] xl:w-[30%]';

/** Vorlauf: So nah am Slider laden alle Vorschauen – beim Hinscrollen stehen sie schon da. */
const PRELOAD_MARGIN = '1200px 0px';

interface InstagramFeedProps {
  posts: readonly InstagramPost[];
  profile: { href: string; handle: string };
}

/**
 * Instagram-Reels als Slider – ein Kontaktabzug: Kacheln im Format 4 : 5 zwischen Haarlinien, Wischen mit
 * Einrasten, Blättern per Pfeil-Knöpfen; zum Schluss die Profil-Karte.
 *
 * Jede Kachel führt zum Reel auf Instagram (neuer Tab), abgespielt wird dort. Die Vorschauen kommen von
 * Instagram und laden von selbst, sobald der Slider in die Nähe kommt (`PRELOAD_MARGIN`) – alle auf einmal,
 * auch die noch seitlich verborgenen.
 */
export function InstagramFeed({ posts, profile }: InstagramFeedProps) {
  const feed = gallery.feed;
  const { trackRef, thumbRef, atStart, atEnd, step } = useSnapSlider();
  const [near, setNear] = useState(false);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      { rootMargin: PRELOAD_MARGIN },
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, [trackRef]);

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
                <ReelTile url={post.url} label={`${type} ${index + 1}`} load={near} instagramLabel={post.instagramLabel} />
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

      <SliderControls
        thumbRef={thumbRef}
        atStart={atStart}
        atEnd={atEnd}
        onStep={step}
        labels={feed.controls}
        className="mt-6 sm:mt-8"
      />
    </div>
  );
}
