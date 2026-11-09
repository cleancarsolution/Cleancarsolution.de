/**
 * 05 — Einblick: Instagram-Reels im Slider (Titelbild mit Link zu Instagram oder eigene Videodatei),
 * zum Schluss die Profil-Karte.
 */
export const gallery = {
  eyebrow: 'Einblick',
  title: 'Leidenschaft, die man sieht.',
  text: 'Ein Blick hinter die Kulissen unserer Arbeit in Düsseldorf. Mehr Ergebnisse, Vorher-Nachher-Vergleiche und Reels finden Sie auf Instagram.',
  feed: {
    /**
     * Beiträge im Slider – Link aus „Teilen → Link kopieren“ bzw. dem Einbettungs-Code (`data-instgrm-permalink`),
     * ohne `?utm_…`. Reihenfolge = Reihenfolge im Slider; neue Beiträge einfach ergänzen.
     *
     * Jede Kachel zeigt das Reel als Vorschau von Instagram (lädt von selbst, kurz bevor der Slider ins Bild kommt)
     * und führt zum Reel auf Instagram – abgespielt wird dort. Unter dem Play-Zeichen steht „Auf Instagram ansehen“.
     * Spielt Instagram ein Reel eingebettet nicht ab, schreibt es den Hinweis selbst hin – dann
     * `instagramLabel: true` setzen, sonst steht er doppelt.
     */
    posts: [
      { url: 'https://www.instagram.com/reel/DMXa50FI_H0/' },
      { url: 'https://www.instagram.com/reel/DMFSWP1I2Lg/' },
      { url: 'https://www.instagram.com/reel/DHGZE8woLd7/', instagramLabel: true },
      { url: 'https://www.instagram.com/reel/DF09ySSIlWL/' },
    ],
    label: 'Beiträge auf Instagram',
    /** Beitragsart aus dem Link (`/reel/…`, `/p/…`, `/tv/…`). */
    types: { reel: 'Reel', p: 'Beitrag', tv: 'Video' },
    /** Pfeil-Knöpfe unter dem Slider. */
    controls: { prev: 'Zurückblättern', next: 'Weiterblättern' },
    /** Hinweis auf jeder Kachel (und für Screenreader) – die ganze Kachel öffnet das Reel. */
    open: 'Auf Instagram ansehen',
    profile: {
      eyebrow: 'Instagram',
      text: 'Neue Ergebnisse, Vorher-Nachher-Vergleiche und Reels aus dem Studio.',
      cta: 'Profil ansehen',
    },
  },
} as const;

/**
 * Standbilder aus dem eigenen Studio-Video von Clean Car Solution (kein Stockmaterial) – der bisherige
 * Filmstreifen der Einblick-Sektion (`sections/gallery/FilmStrip.tsx`), derzeit nicht eingebunden.
 *
 * `timecode` = Position des Bildes im Original-Clip (/media/hero-1080.mp4, 24 fps, HH:MM:SS:FF) –
 * per Bildabgleich ermittelt, damit der Filmstreifen echte Quell-Timecodes zeigt.
 * `focus` = Bildausschnitt (object-position) für den Hochformat-Zuschnitt auf dem Smartphone.
 */
export const studioStills = {
  /** Beschriftung des Filmstreifens für Screenreader. */
  stripLabel: 'Standbilder aus unserem Studio-Film',
  images: [
    {
      src: '/images/gallery/03.jpg',
      caption: 'Vorwäsche',
      alt: 'Mitarbeiter reinigt die Fahrzeugseite mit dem Hochdruckreiniger',
      timecode: '00:00:03:18',
      focus: '78% 50%',
    },
    {
      src: '/images/gallery/04.jpg',
      caption: 'Handwäsche',
      alt: 'Handwäsche im Studio: Mitarbeiter mit Hochdruckreiniger vor einer schwarzen Limousine',
      timecode: '00:00:04:20',
      focus: '58% 50%',
    },
    {
      src: '/images/gallery/02.jpg',
      caption: 'Glanz',
      alt: 'Wasserperlen auf frisch gewaschenem, schwarzem Lack',
      timecode: '00:00:02:15',
      focus: '30% 50%',
    },
    {
      src: '/images/gallery/01.jpg',
      caption: 'Detail',
      alt: 'LED-Scheinwerfer einer schwarzen Limousine leuchtet im dunklen Studio auf',
      timecode: '00:00:01:00',
      focus: '64% 50%',
    },
    {
      src: '/images/gallery/05.jpg',
      caption: 'Finish',
      alt: 'Front einer schwarzen Limousine im Halbdunkel des Studios',
      timecode: '00:00:00:00',
      focus: '62% 50%',
    },
  ],
} as const;
