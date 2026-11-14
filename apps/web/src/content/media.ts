import type { ServiceSlug } from '@ccs/shared';
import type { PosterSet } from '@/components/media/VideoPoster';

/*
 * Alles unter /media/ wird ein Jahr lang als unveränderlich gecacht (next.config.ts) – von Browsern, CDN und der
 * Bildoptimierung. Neues Material deshalb immer unter neuem Dateinamen ablegen (z. B. banner3-*), nie eine
 * bestehende Datei überschreiben, sonst bleibt die alte sichtbar.
 */

/**
 * Hero-Banner (`New_Edited_Product_Banner.mp4`, 10-Bit-HEVC, 17 s): derselbe Dreh wie die vorige Fassung – ein
 * dunkler Porsche im nebligen Studio: Front mit Scheinwerfern, Schaum in Nahaufnahme, eingeschäumte Seite mit
 * Spiegel, Heck mit Wappen beim Abspülen, Mikrofaser auf der Haube, Poliermaschine –, neu mit eingeblendeten
 * Produkten (3D One, Koch-Chemie, Labocosmetica, ServFaces): Sie fliegen nach gut 1 s vor der Front ein und
 * verschwinden nach gut 6 s an der Seite wieder. 15,25-s-Schleife mit harten Schnitten. Der schwarze Vorlauf
 * (1,8 s) ist abgeschnitten, volles Bild ohne Kennzeichnung, Farbton unverändert, als H.264 (CRF 23) encodiert.
 * Die früheren Fassungen (`banner2-*`, Quelle `Client_Wish_Banner.mp4`, und `banner-*`, Quelle
 * `NewBanner_Longer.mp4`) liegen weiter in `/media/`, sind aber nicht eingebunden.
 */
export const bannerFilm = {
  sources: {
    /**
     * Hochformat-Schnitt (608 × 1080, schwenkt mit dem Motiv) für Tablets im Hochformat; solange die Produkte im
     * Bild sind, steht er mittig auf der Gruppe – die äußeren Flaschen sind dabei angeschnitten.
     */
    portrait: '/media/banner3-portrait.mp4',
    medium: '/media/banner3-720.mp4',
    large: '/media/banner3-1080.mp4',
  },
  /** Erster Frame (Front mit Scheinwerfern, noch ohne Produkte) – das Video blendet nahtlos darüber. */
  poster: { src: '/media/banner3-poster.jpg', width: 1920, height: 1080 },
  posterPortrait: { src: '/media/banner3-poster-portrait.jpg', width: 608, height: 1080 },
  /**
   * Standbilder für „Bewegung reduzieren“: die vier Produkte vor der Front mit Scheinwerfern bzw. (Hochformat)
   * Heck mit Wappen beim Abspülen.
   */
  still: { src: '/media/banner3-still.jpg', width: 1920, height: 1080 },
  stillPortrait: { src: '/media/banner3-still-portrait.jpg', width: 608, height: 1080 },
  /**
   * Produktszene in Sekunden der Schleife: Solange die Produkte im Bild sind, steht im Hero statt des Hero-Texts
   * die Produktzeile (`hero.productLine`), ab `logos` zusätzlich die Herstellerlogos darunter. Im Original sind das
   * Sekunde 3 bis 8 – die Web-Fassung beginnt ohne den schwarzen Vorlauf 1,8 s später.
   */
  productScene: { start: 1.2, logos: 3, end: 6.2 },
  alt: 'Ein dunkler Porsche wird im nebligen Studio von Hand aufbereitet: eingeschäumt, abgespült, mit Mikrofaser getrocknet und poliert – davor die verwendeten Pflegeprodukte',
} as const;

/**
 * Studiofilm (`remaked_video.mp4`, 10-Bit-HEVC, 19,7 s): Hochdruckreiniger am eingeschäumten Wagen, Mikrofaser im
 * Schaum am Kühlergrill, Mikrofasertuch auf dem Armaturenbrett – dieselben Einstellungen wie die vorige Fassung
 * (`newOne.mp4`), aber ohne sichtbaren Mitarbeiter: an der Lanze nur noch der Strahl, die Hände in schwarzen
 * Handschuhen. Harte Schnitte, Farbton unverändert, als H.264 (CRF 23) encodiert. Die ersten vier Bilder (eine
 * stehende Totale) sind abgeschnitten – in der Schleife blitzten sie sonst alle 20 s auf. Die vorige Fassung
 * (`pflege-*`) und der frühere Studiofilm (`hero-*`, Scheinwerfer im Nebel, Quelle `Inhouse-Partner-Startseite.mp4`)
 * liegen weiter in `/media/`, sind aber nicht eingebunden; `hero-poster.jpg` bleibt Vorschaubild für Open Graph und
 * JSON-LD.
 */
export const studioFilm = {
  sources: {
    /**
     * Hochformat-Schnitt (608 × 1080) für Smartphones im Hochformat: erst Strahl und Lanze am Wagen, danach schwenkt
     * er mit Handschuh und Tuch mit (Schwenk wie bei der vorigen Fassung).
     */
    portrait: '/media/pflege2-portrait.mp4',
    medium: '/media/pflege2-720.mp4',
    large: '/media/pflege2-1080.mp4',
  },
  /** Erster Frame – das Video blendet nahtlos darüber. */
  poster: { src: '/media/pflege2-poster.jpg', width: 1920, height: 1080 },
  posterPortrait: { src: '/media/pflege2-poster-portrait.jpg', width: 608, height: 1080 },
  /** Standbilder (Strahl des Hochdruckreinigers am eingeschäumten Wagen) für „Bewegung reduzieren“. */
  still: { src: '/media/pflege2-still.jpg', width: 1920, height: 1080 },
  stillPortrait: { src: '/media/pflege2-still-portrait.jpg', width: 608, height: 1080 },
  alt: 'Handwäsche im Studio: Der eingeschäumte Wagen wird mit dem Hochdruckreiniger abgespült und am Kühlergrill mit Mikrofaser gewaschen, danach wird das Armaturenbrett mit einem Mikrofasertuch gereinigt',
} as const;

/**
 * Trockendampf (Hygiene, `dampf-hygiene.mp4`, 10-Bit-HEVC, 15 s): Pinsel am Lenkrad und Wählhebel (Überblendungen),
 * verschmutzter Ledersitz, Dampfpistole im Trockendampf, Abwischen mit Mikrofaser. Schnitt und Farbton
 * unverändert, nur als H.264 (CRF 25) encodiert. Die frühere Sprühnebel-Zeitlupe (`hygiene-*`) liegt weiter
 * in `/media/`, ist aber nicht mehr eingebunden.
 */
export const steamFilm = {
  sources: {
    /** 720 × 900 (4 : 5), fester Ausschnitt um Düse, Hände und Sitz. */
    portrait: '/media/dampf-hygiene-portrait.mp4',
    landscape: '/media/dampf-hygiene-720.mp4',
  },
  /** Erster Frame – das Video blendet nahtlos darüber. */
  poster: { src: '/media/dampf-hygiene-poster.jpg', width: 1280, height: 720 },
  posterPortrait: { src: '/media/dampf-hygiene-poster-portrait.jpg', width: 720, height: 900 },
  /** Standbilder (Dampfpistole im Trockendampf) für „Bewegung reduzieren“. */
  still: { src: '/media/dampf-hygiene-still.jpg', width: 1280, height: 720 },
  stillPortrait: { src: '/media/dampf-hygiene-still-portrait.jpg', width: 720, height: 900 },
  alt: 'Trockendampf-Reinigung: Ein verschmutzter Ledersitz wird mit der Dampfpistole gereinigt und mit einem Mikrofasertuch abgewischt',
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
 * Leistungsfilme: eigenes Material aus demselben Dreh wie der frühere Studiofilm (10-Bit-Originale), jeweils mit
 * 1 s Überblendung Ende → Anfang zur nahtlosen Schleife; der Hochformat-Schnitt (720 × 1080, 2 : 3) schwenkt mit
 * dem Motiv mit.
 */

/**
 * Lackpolitur (`lackpolitur_new.mp4`, 10-Bit-HEVC, 6 s): Wollpad der Poliermaschine auf dunklem Lack, Hand im
 * schwarzen Handschuh, langsame Kamerafahrt; 5-s-Schleife. Farbton unverändert. Die frühere Fassung
 * (`lackpolitur-*`, Quelle `Lackpolitur.mp4`) liegt weiter in `/media/`, ist aber nicht eingebunden.
 */
export const polishFilm = {
  sources: {
    portrait: '/media/lackpolitur2-portrait.mp4',
    landscape: '/media/lackpolitur2-720.mp4',
  },
  poster: { src: '/media/lackpolitur2-poster.jpg', width: 1280, height: 720 },
  posterPortrait: { src: '/media/lackpolitur2-poster-portrait.jpg', width: 720, height: 1080 },
  /** Standbilder (Pad im Polierschleier) für „Bewegung reduzieren“. */
  still: { src: '/media/lackpolitur2-still.jpg', width: 1280, height: 720 },
  stillPortrait: { src: '/media/lackpolitur2-still-portrait.jpg', width: 720, height: 1080 },
  position: '55% 40%',
  alt: 'Mitarbeiter von Clean Car Solution poliert den dunklen Lack eines Fahrzeugs mit der Poliermaschine',
} as const satisfies ServiceFilm;

/**
 * Handwäsche (`new_one_Remaked.mp4`, 10-Bit-HEVC, 15,4 s): Wählhebel und Bedienknopf, Schaumpinsel am
 * Scheinwerfer, Reifenpflege, Pinsel am Lenkrad – Hände in Handschuhen, weiche Überblendungen. Die Schleife ist
 * schon im Original nahtlos (das Lenkrad blendet in den Wählhebel über); die Web-Fassung beginnt beim klaren
 * Wählhebel (Bild 12) statt mitten in der Überblendung. Farbton unverändert, als H.264 (CRF 23) encodiert; der
 * Hochformat-Schnitt schwenkt durchgehend mit dem Motiv, auch über die Überblendungen hinweg. Die frühere Fassung
 * (`handwaesche-1080.mp4` + `handwaesche-poster/-still*.jpg`, Quelle `CleanInnen.mp4`) liegt weiter in `/media/`,
 * ist aber nicht mehr eingebunden.
 */
export const handWashFilm = {
  sources: {
    portrait: '/media/handwaesche2-portrait.mp4',
    landscape: '/media/handwaesche2-720.mp4',
  },
  /** Erster Frame (Wählhebel) – das Video blendet nahtlos darüber. */
  poster: { src: '/media/handwaesche2-poster.jpg', width: 1280, height: 720 },
  posterPortrait: { src: '/media/handwaesche2-poster-portrait.jpg', width: 720, height: 1080 },
  /** Standbilder (Schaumpinsel am Scheinwerfer) für „Bewegung reduzieren“. */
  still: { src: '/media/handwaesche2-still.jpg', width: 1280, height: 720 },
  stillPortrait: { src: '/media/handwaesche2-still-portrait.jpg', width: 720, height: 1080 },
  position: '55% 40%',
  alt: 'Handwäsche innen und außen: Wählhebel und Bedienknopf, Schaumpinsel am Scheinwerfer, Reifenpflege und Pinsel am Lenkrad',
} as const satisfies ServiceFilm;

/**
 * Hero auf dem Smartphone (< 640 px): Hochformat-Schnitt der früheren Handwäsche-Fassung (`CleanInnen.mp4`,
 * 608 × 1080, H.264 CRF 25, 2,1 MB), der Ausschnitt schwenkt mit dem Motiv – Wählhebel → Schaumpinsel am
 * Scheinwerfer → Reifen → Lenkrad; Anfang und Ende stehen gleich, damit die Schleife ruhig bleibt. Poster = erster
 * Frame, Standbild (Schaumpinsel am Scheinwerfer) für „Bewegung reduzieren“.
 */
export const handWashHero = {
  src: '/media/handwaesche-hero.mp4',
  poster: { src: '/media/handwaesche-hero-poster.jpg', width: 608, height: 1080 },
  still: { src: '/media/handwaesche-hero-still.jpg', width: 608, height: 1080 },
  alt: 'Handwäsche innen und außen: Pinsel und Mikrofaser im Innenraum, Schaumpinsel am Scheinwerfer und Reifenpflege',
} as const;

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
 * Polster & Leder (`leader_polishing.mp4`, 10-Bit-HEVC, 7 s): Hand im schwarzen Handschuh pflegt den gesteppten
 * schwarzen Ledersitz mit dem Applikator-Pad, warmes Seitenlicht, langsame Kamerafahrt; 6-s-Schleife. Farbton
 * unverändert. Die frühere Fassung (`leder-*`, Quelle `LederPolishing.mp4`) liegt weiter in `/media/`, ist aber
 * nicht eingebunden.
 */
export const leatherFilm = {
  sources: {
    portrait: '/media/leder2-portrait.mp4',
    landscape: '/media/leder2-720.mp4',
  },
  poster: { src: '/media/leder2-poster.jpg', width: 1280, height: 720 },
  posterPortrait: { src: '/media/leder2-poster-portrait.jpg', width: 720, height: 1080 },
  /** Standbilder (Pad auf dem gesteppten Leder) für „Bewegung reduzieren“. */
  still: { src: '/media/leder2-still.jpg', width: 1280, height: 720 },
  stillPortrait: { src: '/media/leder2-still-portrait.jpg', width: 720, height: 1080 },
  position: '50% 30%',
  alt: 'Lederpflege bei Clean Car Solution: Ein gesteppter schwarzer Ledersitz wird mit dem Applikator-Pad gepflegt',
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
