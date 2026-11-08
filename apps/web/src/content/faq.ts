/** TODO(Kunde): Antworten (v. a. Dauer) bestätigen. */
export const faq = {
  eyebrow: 'FAQ',
  title: 'Häufige Fragen.',
  lead: 'Ihre Frage ist nicht dabei? Rufen Sie uns an oder schreiben Sie uns – wir beraten Sie gerne.',
  /** Direkte Kontaktwege in der linken Spalte (Werte kommen aus `site`). */
  quickContact: {
    title: 'Lieber persönlich?',
    phone: 'Anrufen',
    email: 'Schreiben',
  },
  items: [
    {
      question: 'Brauche ich einen Termin?',
      answer:
        'Ja. Damit wir uns ausreichend Zeit für Ihr Fahrzeug nehmen können, arbeiten wir nach Terminvereinbarung. Fragen Sie Ihren Wunschtermin einfach online, telefonisch oder per E-Mail an.',
    },
    {
      question: 'Was kostet eine Fahrzeugaufbereitung?',
      answer:
        'Die Handwäsche innen & außen erhalten Sie ab 89 €. Für alle weiteren Leistungen erstellen wir Ihnen nach einer kostenlosen und unverbindlichen Fahrzeuganalyse ein individuelles Angebot.',
    },
    {
      question: 'Wie lange dauert die Aufbereitung?',
      answer:
        'Das hängt von Leistung, Fahrzeuggröße und Zustand ab. Eine Handwäsche ist deutlich schneller erledigt als eine umfassende Aufbereitung mit Politur und Versiegelung. Bei der Terminvereinbarung nennen wir Ihnen eine verlässliche Einschätzung.',
    },
    {
      question: 'Welche Produkte verwenden Sie?',
      answer:
        "Wir setzen auf hochwertige Reiniger, Pflegeprodukte und Versiegelungen namhafter Hersteller wie SONAX, 3M und Meguiar's – für Ergebnisse, die halten.",
    },
    {
      question: 'Was ist Trockendampf – und warum nutzen Sie ihn?',
      answer:
        'Trockendampf ist sehr heißer Dampf mit geringem Wasseranteil. Er löst Schmutz selbst in Fugen und Poren und reduziert Bakterien, Keime und Gerüche – materialschonend und weitgehend ohne Chemie. Ideal für die hygienische Innenraumreinigung.',
    },
    {
      question: 'Behandeln Sie auch Cabrio-Verdecke?',
      answer:
        'Ja. Wir reinigen Stoffverdecke schonend von Hand und imprägnieren sie anschließend, damit Wasser abperlt und das Verdeck vor Schmutz und Witterung geschützt ist.',
    },
    {
      question: 'Wo finde ich Sie?',
      answer: 'Sie finden uns in der Himmelgeister Str. 35, 40225 Düsseldorf.',
    },
  ],
} as const;
