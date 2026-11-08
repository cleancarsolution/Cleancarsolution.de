export const contact = {
  eyebrow: 'Kontakt',
  title: 'Bereit für Showroom-Glanz?',
  /** Teil des Titels, der als Verlaufstext (`text-wave`) gesetzt wird – max. ein Wort pro Sektion. */
  titleAccent: 'Showroom-Glanz?',
  text: 'Fragen Sie jetzt Ihren Wunschtermin an. Wir melden uns schnellstmöglich mit einer Bestätigung oder einem individuellen Angebot bei Ihnen.',
  /** Beschriftungen der Kontaktwege (Werte kommen aus `site`). */
  methods: {
    title: 'Direkter Draht',
    phone: 'Telefon',
    email: 'E-Mail',
    address: 'Studio',
    route: 'Route planen',
    appointment: 'Termine',
    social: 'Social Media',
  },
  form: {
    title: 'Terminanfrage',
    intro: 'Unverbindlich anfragen – Beratung und Fahrzeuganalyse sind kostenlos.',
    requiredNote: 'Pflichtfeld',
    fields: {
      name: 'Name',
      email: 'E-Mail',
      phone: 'Telefon',
      vehicle: 'Marke & Modell',
      service: 'Gewünschte Leistung',
      servicePlaceholder: 'Bitte auswählen',
      preferredDate: 'Wunschtermin',
      message: 'Ihre Nachricht',
      website: 'Website',
    },
    submit: 'Anfrage senden',
    submitting: 'Wird gesendet …',
    consent: 'Ich stimme zu, dass meine Angaben zur Bearbeitung meiner Anfrage verwendet werden. Details in der',
    consentLink: { label: 'Datenschutzerklärung', href: '/datenschutz' },
    /** Screenreader-Hinweis für Links, die in einem neuen Tab öffnen. */
    newTab: '(öffnet in neuem Tab)',
    preselected: 'Vorausgewählt',
    success: {
      title: 'Vielen Dank für Ihre Anfrage!',
      text: 'Wir haben Ihre Nachricht erhalten und melden uns schnellstmöglich bei Ihnen.',
      reset: 'Neue Anfrage',
    },
    error: {
      title: 'Das hat leider nicht geklappt.',
      text: 'Bitte versuchen Sie es erneut oder rufen Sie uns direkt an.',
    },
    /** Feinere Fehlerfälle beim Senden – Ihre Eingaben bleiben dabei immer erhalten. */
    errors: {
      invalid: 'Bitte prüfen Sie die markierten Felder.',
      dateInPast: 'Bitte wählen Sie ein Datum ab heute.',
      network: {
        title: 'Keine Verbindung zum Server.',
        text: 'Ihre Anfrage konnte gerade nicht übermittelt werden. Ihre Eingaben bleiben erhalten – versuchen Sie es gleich noch einmal oder rufen Sie uns direkt an.',
      },
      rateLimited: {
        title: 'Zu viele Anfragen in kurzer Zeit.',
        text: 'Bitte warten Sie einen Moment und versuchen Sie es dann erneut – oder rufen Sie uns direkt an.',
      },
      call: 'Anrufen',
    },
    consultationLabel: 'Beratung / noch unsicher',
  },
} as const;
