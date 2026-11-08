import type { ServiceSlug } from '@ccs/shared';
import type { PosterSet } from '@/components/media/VideoPoster';

/**
 * Hero-Banner (`NewBanner_Longer.mp4`, KI-generiert): Handwäsche mit dem Hochdruckreiniger im nebligen Studio –
 * Heck, Kamerafahrt zur Heckscheibe, Kühlergrill, Front im Gegenlicht; 17,6-s-Schleife mit harten Schnitten.
 * Ausschnitt oberhalb der Kennzeichnung „AI generated“ unten rechts, Farbton unverändert (README → Medien).
 */
export const bannerFilm = {
  sources: {
    /** Hochformat-Schnitt (608 × 1080, schwenkt mit dem Motiv) für Smartphones im Hochformat. */
    portrait: '/media/banner-portrait.mp4',
    medium: '/media/banner-720.mp4',
    large: '/media/banner-1080.mp4',
  },
  /** Erster Frame – das Video blendet nahtlos darüber. */
  poster: { src: '/media/banner-poster.jpg', width: 1920, height: 1080 },
  posterPortrait: { src: '/media/banner-poster-portrait.jpg', width: 608, height: 1080 },
  /** Standbilder für „Bewegung reduzieren“: Front im Gegenlicht bzw. (Hochformat) Handwäsche mit dem Strahlrohr. */
  still: { src: '/media/banner-still.jpg', width: 1920, height: 1080 },
  stillPortrait: { src: '/media/banner-still-portrait.jpg', width: 608, height: 1080 },
  alt: 'Eine dunkle Limousine wird im nebligen Studio von Hand mit dem Hochdruckreiniger gewaschen',
} as const;

/**
 * Eigenes Filmmaterial von Clean Car Solution (Quelle: `Inhouse-Partner-Startseite.mp4`, 10-Bit-Original,
 * Grading: Farbton +15° Richtung Marken-Sky). Encodierung siehe README → Medien.
 */

/** 6-s-Schleife: Scheinwerfer gehen an, Wasser perlt, Handwäsche im Sprühnebel, Totale des Studios. */
export const studioFilm = {
  sources: {
    /** Hochformat-Schnitt (608 × 1080) für Smartphones im Hochformat. */
    portrait: '/media/hero-portrait.mp4',
    medium: '/media/hero-720.mp4',
    large: '/media/hero-1080.mp4',
  },
  /** Erster Frame – das Video blendet nahtlos darüber. */
  poster: { src: '/media/hero-poster.jpg', width: 1920, height: 1080 },
  posterPortrait: { src: '/media/hero-poster-portrait.jpg', width: 608, height: 1080 },
  /** Standbilder (Scheinwerfer an) für „Bewegung reduzieren“. */
  still: { src: '/media/hero-still.jpg', width: 1920, height: 1080 },
  stillPortrait: { src: '/media/hero-still-portrait.jpg', width: 608, height: 1080 },
  alt: 'Schwarze Limousine im dunklen, nebligen Studio von Clean Car Solution mit eingeschalteten LED-Scheinwerfern',
} as const;

/**
 * Zeitlupe aus derselben Aufnahme (Hygiene): Handwäsche im feinen Sprühnebel, ⅓ Tempo per
 * Bewegungsinterpolation, nahtlose 4-s-Schleife (Überblendung Ende → Anfang).
 * TODO(Kunde): Sobald eine eigene Trockendampf-Aufnahme vorliegt, hier mit gleichen Dateinamen ersetzen.
 */
export const mistFilm = {
  sources: {
    /** 720 × 900 (4 : 5), Ausschnitt um Düse und Mitarbeiter. */
    portrait: '/media/hygiene-portrait.mp4',
    landscape: '/media/hygiene-720.mp4',
  },
  poster: { src: '/media/hygiene-poster.jpg', width: 1280, height: 720 },
  posterPortrait: { src: '/media/hygiene-poster-portrait.jpg', width: 720, height: 900 },
  still: { src: '/media/hygiene-still.jpg', width: 1280, height: 720 },
  stillPortrait: { src: '/media/hygiene-still-portrait.jpg', width: 720, height: 900 },
  alt: 'Mitarbeiter von Clean Car Solution reinigt ein Fahrzeug im feinen Sprühnebel – in Zeitlupe',
} as const;

/** Film einer Leistung: Querformat (Mega-Dropdown, Karte auf Mobile) und Hochformat-Schnitt (Bühne der Leistungs-Sektion). */
export interface ServiceFilm extends Required<PosterSet> {
  sources: { landscape: string; portrait: string };
  /**
   * Bildausschnitt des Querformats (object-position): x für die schmalere Karte auf Mobile,
   * y für das Breitband im Mega-Dropdown – so liegt das Motiv jeweils im Bild bzw. über dem Text.
   */
  position: string;
  alt: string;
}

/*
 * Leistungsfilme: eigenes Material aus demselben Dreh (10-Bit-Originale), jeweils mit 1 s Überblendung
 * Ende → Anfang zur nahtlosen Schleife; der Hochformat-Schnitt (720 × 1080, 2 : 3) schwenkt mit dem Motiv mit.
 */

/** Lackpolitur (`Lackpolitur.mp4`, Grading +15°): Poliermaschine auf dunklem Lack, langsame Kamerafahrt; 9 s. */
export const polishFilm = {
  sources: {
    portrait: '/media/lackpolitur-portrait.mp4',
    landscape: '/media/lackpolitur-720.mp4',
  },
  poster: { src: '/media/lackpolitur-poster.jpg', width: 1280, height: 720 },
  posterPortrait: { src: '/media/lackpolitur-poster-portrait.jpg', width: 720, height: 1080 },
  /** Standbilder (Pad im Polierschleier) für „Bewegung reduzieren“. */
  still: { src: '/media/lackpolitur-still.jpg', width: 1280, height: 720 },
  stillPortrait: { src: '/media/lackpolitur-still-portrait.jpg', width: 720, height: 1080 },
  position: '90% 0%',
  alt: 'Mitarbeiter von Clean Car Solution poliert den dunklen Lack eines Fahrzeugs mit der Poliermaschine',
} as const satisfies ServiceFilm;

/**
 * Handwäsche (`CleanInnen.mp4`, H.264, 1920 × 1080, 15,5 s): Pinsel am Lenkrad, Mikrofaser an Wählhebel und
 * Bedienknopf, Schaumpinsel am Scheinwerfer, Reifenpflege, zum Schluss wieder das Lenkrad. Farbton unverändert.
 * Noch unbearbeitet übernommen (ohne ffmpeg): eine Datei für beide Formate – die Bühne schneidet mittig ins
 * Hochformat –, ohne Überblendung zur Schleife und mit 10 MB deutlich größer als die übrigen Filme (README → Medien).
 */
export const handWashFilm = {
  sources: {
    portrait: '/media/handwaesche-1080.mp4',
    landscape: '/media/handwaesche-1080.mp4',
  },
  /** Erster Frame (Hochformat: mittiger Ausschnitt wie auf der Bühne) – das Video blendet nahtlos darüber. */
  poster: { src: '/media/handwaesche-poster.jpg', width: 1280, height: 720 },
  posterPortrait: { src: '/media/handwaesche-poster-portrait.jpg', width: 720, height: 1080 },
  /** Standbilder (Schaumpinsel am Scheinwerfer) für „Bewegung reduzieren“. */
  still: { src: '/media/handwaesche-still.jpg', width: 1280, height: 720 },
  stillPortrait: { src: '/media/handwaesche-still-portrait.jpg', width: 720, height: 1080 },
  position: '60% 50%',
  alt: 'Handwäsche innen und außen: Pinsel und Mikrofaser im Innenraum, Schaumpinsel am Scheinwerfer und Reifenpflege',
} as const satisfies ServiceFilm;

/**
 * Innenraum (`Innenraumsaugen&Reinigen.mp4`): Bürstendüse auf perforiertem Leder, dann im Fußraum; 7 s.
 * Farbton unverändert – +15° färbte das Cognac-Leder olivgrün.
 */
export const interiorFilm = {
  sources: {
    portrait: '/media/innenraum-portrait.mp4',
    landscape: '/media/innenraum-720.mp4',
  },
  poster: { src: '/media/innenraum-poster.jpg', width: 1280, height: 720 },
  posterPortrait: { src: '/media/innenraum-poster-portrait.jpg', width: 720, height: 1080 },
  /** Standbilder (Bürste auf dem Ledersitz) für „Bewegung reduzieren“. */
  still: { src: '/media/innenraum-still.jpg', width: 1280, height: 720 },
  stillPortrait: { src: '/media/innenraum-still-portrait.jpg', width: 720, height: 1080 },
  position: '55% 45%',
  alt: 'Innenraumreinigung bei Clean Car Solution: Ledersitz und Fußraum werden mit der Bürstendüse abgesaugt',
} as const satisfies ServiceFilm;

/**
 * Polster & Leder (`LederPolishing.mp4`): Mikrofasertuch pflegt die schwarze Leder-Rückbank, die zweite Hand hält
 * das Pflegeprodukt, langsame Kamerafahrt; 7 s. Farbton unverändert – +15° ließ die Hauttöne gelblich kippen.
 */
export const leatherFilm = {
  sources: {
    portrait: '/media/leder-portrait.mp4',
    landscape: '/media/leder-720.mp4',
  },
  poster: { src: '/media/leder-poster.jpg', width: 1280, height: 720 },
  posterPortrait: { src: '/media/leder-poster-portrait.jpg', width: 720, height: 1080 },
  /** Standbilder (Tuch auf dem Leder, daneben das Pflegeprodukt) für „Bewegung reduzieren“. */
  still: { src: '/media/leder-still.jpg', width: 1280, height: 720 },
  stillPortrait: { src: '/media/leder-still-portrait.jpg', width: 720, height: 1080 },
  position: '50% 80%',
  alt: 'Lederpflege bei Clean Car Solution: Die schwarze Leder-Rückbank wird mit Mikrofasertuch und Pflegeprodukt gepflegt',
} as const satisfies ServiceFilm;

/**
 * Smart Repair (`PunktuelleReparaturkleinerLackschäden.mp4`): Makro – ein feiner Applikator füllt einen Kratzer
 * im blauen Metallic-Lack; 6 s. Farbton unverändert – das Blau entspricht schon der Marke, +15° kippte es ins Violett.
 */
export const touchUpFilm = {
  sources: {
    portrait: '/media/lackreparatur-portrait.mp4',
    landscape: '/media/lackreparatur-720.mp4',
  },
  poster: { src: '/media/lackreparatur-poster.jpg', width: 1280, height: 720 },
  posterPortrait: { src: '/media/lackreparatur-poster-portrait.jpg', width: 720, height: 1080 },
  /** Standbilder (Lacktropfen im Kratzer) für „Bewegung reduzieren“. */
  still: { src: '/media/lackreparatur-still.jpg', width: 1280, height: 720 },
  stillPortrait: { src: '/media/lackreparatur-still-portrait.jpg', width: 720, height: 1080 },
  position: '80% 45%',
  alt: 'Punktuelle Lackreparatur: Ein feiner Applikator füllt einen Kratzer im blauen Metallic-Lack',
} as const satisfies ServiceFilm;

/**
 * Cabrioverdeck (`SchonendeVerdeckreinigung&ProfessionelleImprägnierung.mp4`, Grading +15°): Pinsel arbeitet
 * Schaum in den Stoff ein, nach dem Schnitt perlt Wasser vom imprägnierten Verdeck ab; 7 s.
 */
export const softTopFilm = {
  sources: {
    portrait: '/media/verdeck-portrait.mp4',
    landscape: '/media/verdeck-720.mp4',
  },
  poster: { src: '/media/verdeck-poster.jpg', width: 1280, height: 720 },
  posterPortrait: { src: '/media/verdeck-poster-portrait.jpg', width: 720, height: 1080 },
  /** Standbilder (Pinsel im Schaum) für „Bewegung reduzieren“. */
  still: { src: '/media/verdeck-still.jpg', width: 1280, height: 720 },
  stillPortrait: { src: '/media/verdeck-still-portrait.jpg', width: 720, height: 1080 },
  position: '45% 45%',
  alt: 'Cabrioverdeck: Ein Pinsel arbeitet Reinigungsschaum in den Stoff ein, danach perlt Wasser vom imprägnierten Verdeck ab',
} as const satisfies ServiceFilm;

/** Leistungen mit eigenem Film – er läuft im Mega-Dropdown und in der Leistungs-Sektion statt Foto bzw. Platzhalter. */
export const serviceFilms: Partial<Record<ServiceSlug, ServiceFilm>> = {
  fahrzeugaufbereitung: polishFilm,
  handwaesche: handWashFilm,
  'innen-aussen': interiorFilm,
  'polster-leder': leatherFilm,
  'smart-repair': touchUpFilm,
  cabrioverdeck: softTopFilm,
};

/** Beschriftung der Pause/Play-Schalter (WCAG 2.2.2). */
export const videoLabels = {
  pause: 'Video pausieren',
  play: 'Video abspielen',
} as const;
