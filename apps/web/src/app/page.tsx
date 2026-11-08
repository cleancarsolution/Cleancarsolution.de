import { About } from '@/components/sections/About';
import { Contact } from '@/components/sections/Contact';
import { Faq } from '@/components/sections/Faq';
import { Gallery } from '@/components/sections/Gallery';
import { Hero } from '@/components/sections/Hero';
import { Hygiene } from '@/components/sections/Hygiene';
import { Marquee } from '@/components/sections/Marquee';
import { Offer } from '@/components/sections/Offer';
import { Process } from '@/components/sections/Process';
import { Reviews } from '@/components/sections/Reviews';
import { Services } from '@/components/sections/Services';

/** Höchstens alle 6 Stunden neu erzeugen – im selben Takt holt `lib/google-reviews.ts` die Google-Rezensionen. */
export const revalidate = 21600;

/**
 * Startseite – Reihenfolge & Rhythmus (dunkel/hell) siehe docs/DESIGN.md.
 * Hero (Video) → Marquee → Über uns → Leistungen → Hygiene (hell) → Preise (schwarz)
 * → Einblick → Ablauf → Kundenstimmen → FAQ (hell) → Kontakt
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Marquee />
      <About />
      <Services />
      <Hygiene />
      <Offer />
      <Gallery />
      <Process />
      <Reviews />
      <Faq />
      <Contact />
    </>
  );
}
