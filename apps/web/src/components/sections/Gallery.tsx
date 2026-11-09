import type { ReactNode } from 'react';
import { site } from '@ccs/shared';
import { buttonClasses } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { Instagram } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { RevealText } from '@/components/ui/RevealText';
import { gallery } from '@/content/gallery';
import { InstagramFeed } from './gallery/InstagramFeed';

const SOCIAL_ICONS: Record<string, ReactNode> = {
  Instagram: <Instagram className="size-[1.125rem]" />,
};

/** Social Media in dieser Sektion – ohne TikTok. */
const socials = site.socials.filter((social) => social.label !== 'TikTok');
const instagram = site.socials.find((social) => social.label === 'Instagram');

/**
 * 05 — EINBLICK. Instagram-Reels im Slider – Titelbilder zwischen Haarlinien wie auf einem Kontaktabzug; jede
 * Kachel führt zum Reel auf Instagram (siehe `InstagramFeed`). Die Profil-Karte schließt den Slider und führt zum
 * Instagram-Profil.
 */
export function Gallery() {
  return (
    <section id="einblick" aria-labelledby="einblick-title" className="relative bg-ink-950 py-24 sm:py-32 lg:py-40">
      <Container>
        <header className="grid grid-cols-12 gap-x-5 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow index="05">{gallery.eyebrow}</Eyebrow>
            <h2 id="einblick-title" className="mt-6 text-display-lg font-medium text-balance">
              <RevealText text={gallery.title} />
            </h2>
          </div>
          <Reveal className="col-span-12 mt-8 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:self-end" delay={0.15}>
            <p className="max-w-[46ch] leading-relaxed text-fg-muted">{gallery.text}</p>
            <ul className="mt-6 flex flex-wrap gap-3">
              {socials.map((social) => (
                <li key={social.href}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={buttonClasses({ variant: 'secondary', className: 'gap-2.5 pr-5 pl-4 text-sm' })}
                  >
                    <span aria-hidden className="text-fg-muted transition-colors group-hover/btn:text-sky-300">
                      {SOCIAL_ICONS[social.label]}
                    </span>
                    {social.handle}
                    <span className="sr-only">auf {social.label} (öffnet in neuem Tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </header>

        {instagram ? (
          <Reveal className="mt-16 lg:mt-24" y={40} amount={0.1}>
            <InstagramFeed posts={gallery.feed.posts} profile={instagram} />
          </Reveal>
        ) : null}
      </Container>
    </section>
  );
}
