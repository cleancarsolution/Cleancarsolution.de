import type { InquiryServiceValue } from '@ccs/shared';

export const offer = {
  eyebrow: 'Preise',
  title: 'Faire Preise. Kompromisslose Qualität.',
  lead: 'Ein klarer Einstiegspreis für die Handwäsche. Alle weiteren Leistungen kalkulieren wir nach einer kostenlosen Fahrzeuganalyse individuell für Ihr Fahrzeug.',
  featured: {
    badge: 'Angebot',
    name: 'Handwäsche innen & außen',
    /** Banner-Zweizeiler (TwoTone) – wie auf dem roten Preis-Badge des Banners. */
    banner: { top: 'Handwäsche', bottom: 'Innen & Außen' },
    prefix: 'ab',
    price: 89,
    description:
      // geschütztes Leerzeichen vor dem Gedankenstrich: keine Zeile beginnt mit „–“
      'Gründliche Handwäsche außen und Innenraumreinigung in einem Termin – der perfekte Einstieg in die Clean-Car-Pflege.',
    includesTitle: 'Im Termin enthalten',
    /** TODO(Kunde): Leistungsumfang des 89-€-Pakets bestätigen. */
    includes: [
      'Hochdruck-Vorwäsche & Handwäsche',
      'Felgen- & Reifenreinigung',
      'Innenraum saugen',
      'Cockpit- & Kunststoffreinigung',
      'Scheiben innen & außen',
    ],
    note: 'Preis abhängig von Fahrzeuggröße und Verschmutzungsgrad.',
    cta: 'Termin sichern',
    service: 'handwaesche' satisfies InquiryServiceValue,
  },
  custom: {
    eyebrow: 'Alle weiteren Leistungen',
    title: 'Individuelles Angebot',
    text: 'Für Aufbereitung, Polster & Leder, Smart Repair und Cabrioverdeck erhalten Sie nach einer kostenlosen und unverbindlichen Beratung und Fahrzeuganalyse ein individuelles Angebot.',
    /** Beschriftungen der Preisliste (Spaltenköpfe ab Desktop, Preis statt Zahl, Weg zur Anfrage). */
    list: { service: 'Leistung', scope: 'Umfang', price: 'Preis', quote: 'Individuell', request: 'Anfragen' },
    points: ['Kostenlose Beratung', 'Unverbindliche Fahrzeuganalyse', 'Individuelles Angebot'],
    cta: 'Kostenlos beraten lassen',
    service: 'beratung' satisfies InquiryServiceValue,
  },
  /**
   * Produkt-Slider unter der Preisliste. Fotos freigestellt in `/images/produkte/`, auf die deckende Fläche
   * zugeschnitten und gleich hoch auf 880 × 1000 px gebracht (unten bündig) – so stehen alle gleich groß auf derselben
   * Bodenlinie. Reihenfolge wie vom Kunden nummeriert (1–5).
   */
  products: {
    title: 'Wir arbeiten mit hochqualitativen Produkten',
    controls: { prev: 'Zurückblättern', next: 'Weiterblättern' },
    items: [
      { src: '/images/produkte/labocosmetica-derma-cleaner.png', alt: 'Labocosmetica #Derma Cleaner, Lederreiniger' },
      { src: '/images/produkte/3d-one.png', alt: '3D One, Schleif- und Finishpolitur' },
      { src: '/images/produkte/koch-chemie-micro-cut-m2-02.png', alt: 'Koch-Chemie Micro Cut M2.02, Micro-Schleifpolitur' },
      {
        src: '/images/produkte/servfaces-surface-cleaner-pro.png',
        alt: 'ServFaces Surface Cleaner PRO, Entfetter- und Kontrollspray',
      },
      { src: '/images/produkte/koch-chemie-fine-cut-f6-01.png', alt: 'Koch-Chemie Fine Cut F6.01, feine Schleifpolitur' },
    ],
  },
} as const;
