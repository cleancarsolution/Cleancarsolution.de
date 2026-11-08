import { bannerFilm, videoLabels } from './media';

export const hero = {
  /** Teil der H1 (SEO), visuell als Eyebrow über der Headline. */
  eyebrow: 'Fahrzeugaufbereitung & Autohandwäsche in Düsseldorf',
  /** Jede Zeile wird einzeln animiert. */
  headline: ['Showroom-Glanz.', 'Von Hand gemacht.'],
  /** Das eine Akzentwort (Verlaufstext) der Headline – die Handarbeit ist der Kern der Marke. */
  accent: 'Hand',
  lead: 'Professionelle Handwäsche, Polster- & Lederpflege und Aufbereitung für Fahrzeuge, die mehr verdienen als eine Waschstraße.',
  primaryCta: { label: 'Termin anfragen', href: '/#kontakt' },
  secondaryCta: { label: 'Leistungen entdecken', href: '/#leistungen' },
  offer: {
    label: 'Handwäsche innen & außen',
    prefix: 'ab',
    price: 89,
    /** Das rote Preis-Badge der Banner, neu interpretiert – führt zur Preis-Sektion. */
    href: '/#preise',
  },
  /** H.264, ohne Ton, 17,6 s Loop – Hero-Banner (siehe content/media.ts). */
  video: {
    ...bannerFilm,
    pauseLabel: videoLabels.pause,
    playLabel: videoLabels.play,
  },
  scrollCue: { label: 'Scrollen', href: '/#ueber-uns', srLabel: 'Weiter zu „Über uns“' },
} as const;

/** Laufband direkt unter dem Hero: alle Leistungen (aus @ccs/shared) plus zwei Verfahren. */
export const marquee = {
  label: 'Leistungen im Überblick',
  extras: ['Trockendampf', 'Versiegelung'],
} as const;
