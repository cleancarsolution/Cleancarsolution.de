export const howItWorks = {
  eyebrow: 'Ablauf',
  title: 'In vier Schritten zum perfekten Ergebnis.',
  /** Geschützte Leerzeichen (U+00A0) halten Zusammengehöriges in einer Zeile („auf den ersten Blick“), der Gedankenstrich
   * bleibt am Zeilenende; „E-Mail“ trägt nach dem Bindestrich ein Wortverbindungszeichen (U+2060) und bricht dort nicht.
   * Jede Gruppe muss in die schmalste Spalte passen (Absatz ≈ 200 px bei 1024 px Fensterbreite). */
  steps: [
    {
      index: '01',
      title: 'Anfrage',
      text: 'Online, per Telefon oder E-⁠Mail – schildern Sie uns kurz Ihr Fahrzeug und Ihren Wunsch.',
    },
    {
      index: '02',
      title: 'Analyse & Angebot',
      text: 'Wir begutachten Ihr Fahrzeug kostenlos und unverbindlich und erstellen Ihnen ein individuelles Angebot.',
    },
    {
      index: '03',
      title: 'Aufbereitung',
      text: 'Wir arbeiten von Hand und mit hochwertigen Produkten – sorgfältig, gründlich und termingerecht.',
    },
    {
      index: '04',
      title: 'Übergabe',
      text: 'Sie holen Ihr Fahrzeug in Bestform ab – und sehen den Unterschied auf den ersten Blick.',
    },
  ],
  /** Abschlusszeile unter der Zeitleiste. */
  closing: {
    text: 'Schritt 01 beginnt hier.',
    cta: { label: 'Jetzt Termin anfragen', href: '/#kontakt' },
    phoneLabel: 'Oder direkt anrufen',
  },
} as const;
