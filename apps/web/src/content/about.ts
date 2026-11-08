export const about = {
  eyebrow: 'Über uns',
  /** Großes Statement – Wörter werden beim Scrollen nacheinander hervorgehoben. */
  statement:
    'Clean Car Solution ist Ihr Experte für professionelle Fahrzeugaufbereitung in Düsseldorf. Mit jahrelanger Erfahrung und einer Leidenschaft für Perfektion bringen wir jedes Fahrzeug von Hand in Bestform – Klasse statt Masse.',
  /** Wortfolgen im Statement, die beim Aufleuchten kurz in Sky glühen und dann weiß werden. */
  statementGlow: ['Clean Car Solution'],
  /** Das Motto – bleibt nach dem Aufleuchten in Sky stehen. */
  statementHighlight: 'Klasse statt Masse.',
  /** Der Claim des Kunden als drei Säulen. */
  pillars: [
    {
      index: '01',
      title: 'Erfahrung',
      text: 'Jahrelange Praxis in der Fahrzeugpflege. Wir wissen, was Lack, Leder und Stoff brauchen – und was ihnen schadet.',
    },
    {
      index: '02',
      title: 'Vertrauen',
      text: 'Ehrliche Beratung, eine kostenlose Fahrzeuganalyse und ein individuelles Angebot, bevor wir loslegen.',
    },
    {
      index: '03',
      title: 'Exzellenz',
      text: 'Hochwertige Reiniger, Pflegeprodukte und Versiegelungen führender Hersteller – und Sorgfalt bis ins letzte Detail.',
    },
  ],
  facts: [
    { value: '100 %', label: 'Handwäsche statt Waschstraße' },
    { value: 'ab 89 €', label: 'Handwäsche innen & außen' },
    { value: '0 €', label: 'Beratung & Fahrzeuganalyse' },
    { value: '6', label: 'Leistungen unter einem Dach' },
  ],
  /** Bildunterschrift des Filmbands (Video: Studiofilm aus dem Hero, siehe content/media.ts). */
  filmCaption: 'Einblick ins Studio',
  /** Zeile über den Produkt-Wortmarken (Marken selbst: `site.brands`). */
  brandsLabel: 'Wir arbeiten mit Produkten von',
} as const;
