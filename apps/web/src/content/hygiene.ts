import type { InquiryServiceValue } from '@ccs/shared';

export const hygiene = {
  eyebrow: 'Hygiene',
  title: 'Sauber ist gut. Hygienisch ist besser.',
  /** `title` in zwei Zeilen – die zweite trägt die Aussage (Navy), die erste tritt zurück. */
  titleLines: ['Sauber ist gut.', 'Hygienisch ist besser.'],
  /** Anfang der zweiten Zeile – im Wellen-Verlauf des Logos (Navy → Royal → Sky). */
  titleAccent: 'Hygienisch',
  lead: 'Gegen Bakterien und Verschmutzungen im Innenraum arbeiten wir mit Trockendampf.',
  text: 'Heißer Trockendampf dringt tief in Polster, Fugen und Lüftungsdüsen ein, löst hartnäckigen Schmutz und reduziert Keime, Bakterien und Gerüche – materialschonend und weitgehend ohne Chemie.',
  benefits: [
    {
      icon: 'leaf',
      title: 'Weitgehend chemiefrei',
      text: 'Heißer Dampf statt aggressiver Reiniger – schonend für empfindliche Materialien.',
    },
    {
      icon: 'steam',
      title: 'Tiefenwirksam',
      text: 'Erreicht Nähte, Fugen und Lüftungsschlitze, an die kein Tuch herankommt.',
    },
    {
      icon: 'shield',
      title: 'Geruchsneutral',
      text: 'Reduziert Keime und unangenehme Gerüche, statt sie nur zu überdecken.',
    },
  ],
  /** Banner-Zweizeiler der Vorteils-Karte – Zitat des Hygiene-Blocks von Banner & Roll-up. */
  badge: {
    title: 'Hygiene',
    text: 'Trockendampf',
  },
  /** „Klarsicht“ über dem Video (Zeitlupe, siehe content/media.ts): links Milchglas, rechts klar. */
  compare: {
    before: 'Sauber',
    after: 'Hygienisch',
    slider: 'Vergleich „Sauber“ und „Hygienisch“ – Trennlinie verschieben',
    hint: 'Trennlinie ziehen – vom Schleier zur klaren Sicht.',
  },
  cta: {
    label: 'Innenraumreinigung anfragen',
    service: 'innen-aussen' satisfies InquiryServiceValue,
  },
} as const;
