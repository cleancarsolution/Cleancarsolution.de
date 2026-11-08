/**
 * Leistungskatalog – genutzt von Header-Dropdown, Leistungs-Sektion, Footer und Kontaktformular.
 *
 * `eyebrow` + `title` spiegeln die zweizeilige Typografie der Banner wider
 * (obere Zeile in Sky-Blau, untere Zeile in Weiß), z. B. „POLSTER & LEDER / REINIGUNG“.
 *
 * TODO(Kunde): Leistungsdetails (highlights) bestätigen.
 */

export const serviceSlugs = [
  'fahrzeugaufbereitung',
  'handwaesche',
  'innen-aussen',
  'polster-leder',
  'smart-repair',
  'cabrioverdeck',
] as const;

export type ServiceSlug = (typeof serviceSlugs)[number];

export interface Service {
  slug: ServiceSlug;
  /** Zweistellige Nummer für die Darstellung, z. B. „01“. */
  index: string;
  /** Obere Bannerzeile (Akzentfarbe). */
  eyebrow: string;
  /** Untere Bannerzeile (Hauptwort). */
  title: string;
  /** Vollständiger Name für Fließtext, Selects und SEO. */
  name: string;
  /** Einzeiler für Dropdown und Karten. */
  summary: string;
  /** 2–3 Sätze für die Leistungs-Sektion. */
  description: string;
  highlights: readonly string[];
  /**
   * Foto der Leistung. Fehlt es, zeigt die Website einen Platzhalter.
   * TODO(Kunde): eigene Fotos aus der Werkstatt folgen – dann hier eintragen.
   */
  image?: { src: string; alt: string };
  /** Startpreis in Euro, falls kommuniziert. */
  priceFrom?: number;
  priceLabel?: string;
}

export const services: readonly Service[] = [
  {
    slug: 'fahrzeugaufbereitung',
    index: '01',
    eyebrow: 'Fahrzeug',
    title: 'Aufbereitung',
    name: 'Fahrzeugaufbereitung',
    summary: 'Politur, Lackpflege und Versiegelung für Neuwagen-Optik und echten Werterhalt.',
    description:
      'Zerkratzter, stumpfer Lack und verlorener Glanz? Mit fachgerechter Politur und hochwertigen Versiegelungen bringen wir Ihr Fahrzeug zurück in Neuwagen-Optik – und schützen den Lack langfristig vor Abnutzung und Umwelteinflüssen.',
    highlights: [
      'Mehrstufige Lackpolitur',
      'Entfernung von Swirls & leichten Kratzern',
      'Hochwertige Lackversiegelung',
      'Werterhalt vor Verkauf oder Leasing-Rückgabe',
    ],
  },
  {
    slug: 'handwaesche',
    index: '02',
    eyebrow: 'Professionelle',
    title: 'Handwäsche',
    name: 'Professionelle Handwäsche',
    summary: 'Schonende Autohandwäsche statt Waschstraße – gründlich, kratzfrei und mit Liebe zum Detail.',
    description:
      'Keine rotierenden Bürsten, keine Kompromisse: Wir waschen Ihr Fahrzeug von Hand – mit Hochdruck-Vorwäsche, hochwertigen Shampoos und weichen Mikrofasertüchern. So bleibt der Lack makellos und der Glanz erhalten.',
    highlights: [
      'Hochdruck-Vorwäsche',
      'Kratzfreie Handwäsche',
      'Felgen- & Reifenreinigung',
      'Trocknung mit Mikrofaser',
    ],
    priceFrom: 89,
    priceLabel: 'Handwäsche innen & außen',
  },
  {
    slug: 'innen-aussen',
    index: '03',
    eyebrow: 'Innen & Außen',
    title: 'Reinigung',
    name: 'Innen- & Außenreinigung',
    summary: 'Das Komplettpaket: gründliche Innenraumreinigung und sorgfältige Außenwäsche in einem Termin.',
    description:
      'Vom Cockpit bis zur Felge: Wir reinigen Ihr Fahrzeug innen wie außen bis ins kleinste Detail – Armaturen, Lüftungsdüsen, Scheiben, Einstiege und Lack. Ideal für alle, die Wert auf ein rundum gepflegtes Fahrzeug legen.',
    highlights: [
      'Innenraum saugen & reinigen',
      'Cockpit- & Kunststoffpflege',
      'Scheiben innen & außen',
      'Handwäsche außen',
    ],
  },
  {
    slug: 'polster-leder',
    index: '04',
    eyebrow: 'Polster & Leder',
    title: 'Reinigung',
    name: 'Polster- & Lederreinigung',
    summary: 'Tiefenreinigung und Pflege für Sitze, Teppiche und Leder – für ein Interieur wie am ersten Tag.',
    description:
      'Flecken, Gerüche und Abnutzung haben bei uns keine Chance. Wir reinigen Polster, Teppiche und Glattleder porentief und pflegen Leder mit hochwertigen Produkten, damit es geschmeidig bleibt und nicht spröde wird.',
    highlights: [
      'Polster- & Teppich-Tiefenreinigung',
      'Schonende Lederreinigung',
      'Lederpflege & Schutz',
      'Geruchsneutralisierung',
    ],
  },
  {
    slug: 'smart-repair',
    index: '05',
    eyebrow: 'Smart Repair',
    title: 'Lackschäden',
    name: 'Smart Repair & Felgenreinigung',
    summary: 'Kleine Lackschäden punktuell beheben und Felgen gründlich von Bremsstaub befreien.',
    description:
      'Kleine Kratzer oder Steinschläge? Mit Smart Repair beheben wir kleinere Schäden punktuell – ohne aufwendige Komplettlackierung. Dazu befreien wir Ihre Felgen gründlich von festsitzendem Bremsstaub und Schmutz.',
    highlights: [
      'Punktuelle Reparatur kleiner Lackschäden',
      'Intensive Felgenreinigung',
      'Entfernung von Bremsstaub',
      'Reifen- & Felgenpflege',
    ],
  },
  {
    slug: 'cabrioverdeck',
    index: '06',
    eyebrow: 'Cabrioverdeck',
    title: 'Imprägnierung',
    name: 'Cabrioverdeck-Imprägnierung',
    summary: 'Reinigung und Imprägnierung von Stoffverdecken – für Schutz vor Nässe, Schmutz und Witterung.',
    description:
      'Ihr Stoffverdeck verdient besondere Aufmerksamkeit. Wir reinigen es schonend von Hand und imprägnieren es anschließend, damit Wasser abperlt, Schmutz weniger haftet und die Farbe lange frisch bleibt.',
    highlights: [
      'Schonende Verdeckreinigung',
      'Professionelle Imprägnierung',
      'Schutz vor Nässe & Schmutz',
      'Farbauffrischung durch Pflege',
    ],
  },
];

export function getService(slug: ServiceSlug): Service {
  const service = services.find((s) => s.slug === slug);
  if (!service) throw new Error(`Unknown service: ${slug}`);
  return service;
}

export function isServiceSlug(value: unknown): value is ServiceSlug {
  return typeof value === 'string' && (serviceSlugs as readonly string[]).includes(value);
}
