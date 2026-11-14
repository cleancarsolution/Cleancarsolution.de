import { bannerFilm, handWashHero, videoLabels } from './media';

export const hero = {
  /** Teil der H1 (SEO), visuell als Eyebrow über der Headline. */
  eyebrow: 'Fahrzeugaufbereitung & Autohandwäsche in Düsseldorf',
  /** Auf dem Smartphone – eine Zeile. */
  eyebrowShort: 'Autohandwäsche in Düsseldorf',
  /** Jede Zeile wird einzeln animiert. */
  headline: ['Showroom-Glanz.', 'Von Hand gemacht.'],
  /** Das eine Akzentwort (Verlaufstext) der Headline – die Handarbeit ist der Kern der Marke. */
  accent: 'Hand',
  lead: 'Professionelle Handwäsche, Polster- & Lederpflege und Aufbereitung für Fahrzeuge, die mehr verdienen als eine Waschstraße.',
  /**
   * Produktszene des Banner-Films (`bannerFilm.productScene`): Eyebrow, Headline, Lead und CTAs treten zurück, an
   * ihrer Stelle steht dieser Satz – Auftakt klein wie die Eyebrow, der Rest groß in Versalien –, darunter ab
   * Sekunde 3 die Logos der Hersteller. Danach kehrt der Hero-Text zurück.
   */
  productLine: {
    lead: 'Wir arbeiten mit',
    statement: 'professionellen Produkten von:',
    /** Das eine Wort mit Verlaufstext. */
    accent: 'professionellen',
    /**
     * Herstellerlogos in einer Reihe (erscheinen nacheinander) – weiß auf transparent, eng beschnitten, unter
     * `/images/marken/` (docs/DESIGN.md §7). Weitere Logos einfach anhängen.
     */
    logos: [{ name: 'ServFaces', src: '/images/marken/servfaces.png', width: 285, height: 340 }],
  },
  primaryCta: { label: 'Termin anfragen', href: '/#kontakt' },
  secondaryCta: { label: 'Leistungen entdecken', href: '/#leistungen' },
  offer: {
    label: 'Handwäsche innen & außen',
    prefix: 'ab',
    price: 89,
    /** Das rote Preis-Badge der Banner, neu interpretiert – führt zur Preis-Sektion. */
    href: '/#preise',
  },
  /** H.264, ohne Ton, 15,3 s Loop – Hero-Banner; auf dem Smartphone der Handwäsche-Film (siehe content/media.ts). */
  video: {
    ...bannerFilm,
    phone: handWashHero,
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
