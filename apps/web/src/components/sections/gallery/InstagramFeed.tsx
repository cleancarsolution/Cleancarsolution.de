'use client';

import { useState } from 'react';
import { ButtonLink, buttonClasses } from '@/components/ui/Button';
import { Instagram } from '@/components/ui/icons';
import { SliderControls, useSnapSlider } from '@/components/ui/SnapSlider';
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
  const { trackRef, thumbRef, atStart, atEnd, step } = useSnapSlider();
  const [consent, setConsent] = useState(false);

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
