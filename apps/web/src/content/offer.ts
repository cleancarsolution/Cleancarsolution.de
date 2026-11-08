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
  /** Zeile unter den Karten – Produktmarken laut Banner (site.brands). */
  brandsLabel: 'Wir arbeiten mit Produkten von',
} as const;
