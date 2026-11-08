import type { ReviewSummary } from '@/lib/google-reviews';

/**
 * 07 — Kundenstimmen: Gesamtnote und die neuesten Rezensionen aus dem Google-Unternehmensprofil.
 * Daten: `lib/google-reviews.ts` (alle 6 Stunden neu) · Links zu Google: `site.reviews` in @ccs/shared.
 */
export const reviews = {
  eyebrow: 'Google-Rezensionen',
  title: 'Zufriedene Kundenstimmen.',
  /** Hinter der Gesamtnote und den Sternen jeder Rezension – nur für Screenreader („5,0 von 5 Sternen“). */
  outOf: 'von 5 Sternen',
  total: { one: 'Rezension auf Google', other: 'Rezensionen auf Google' },
  /** Statt des Namens bei anonymen Rezensionen. */
  anonymous: 'Google-Nutzer',
  /** Unter gekürzten Rezensionen – führt zum Profil in Google Maps. */
  more: 'Vollständige Rezension ansehen',
  /** Beschriftung des Sliders und seiner Pfeil-Knöpfe. */
  slider: { label: 'Rezensionen auf Google', prev: 'Zurückblättern', next: 'Weiterblättern' },
  /** Pflichtangabe nach § 5b Abs. 3 UWG: Herkunft und Auswahl der Rezensionen und ob ihre Echtheit geprüft wird. */
  notice:
    'Gezeigt wird eine Auswahl der Rezensionen aus unserem Google-Unternehmensprofil, gekürzt und mit abgekürztem Namen – vollständig lesen Sie sie auf Google. Ob sie von Personen stammen, die unsere Leistungen tatsächlich in Anspruch genommen haben, prüfen wir nicht.',
  /** Solange keine Rezensionen geladen sind (lokal ohne Zugangsdaten, vor der Freischaltung durch Google). */
  fallback: 'Was unsere Kunden über uns schreiben, lesen Sie direkt in unserem Google-Profil.',
  read: 'Alle Rezensionen lesen',
  write: 'Rezension schreiben',
  newTab: '(öffnet Google in neuem Tab)',
  /**
   * Bis Google die Business Profile API freischaltet: echte Rezensionen aus dem Google-Profil, von Hand übernommen
   * (Stand 8. November 2026, Gesamtnote 5,0 aus 53 Rezensionen). Ohne Datum – Google zeigt nur „vor x Wochen“.
   * Sobald die API Daten liefert, werden diese Angaben nicht mehr angezeigt.
   */
  preview: {
    rating: 5,
    total: 53,
    reviews: [
      {
        id: 'louise-b',
        author: 'Louise B.',
        rating: 5,
        text: 'Absolut empfehlenswert! Clean Car Solution arbeitet super schnell und sehr sauber. Das Personal ist wirklich unglaublich freundlich und der Chef ist sehr, sehr nett und sympathisch.\n\nDie Preise sind fair und realistisch, die Arbeit wird schnell erledigt und am Ende ist der Kunde einfach zufrieden – mehr kann man sich wirklich nicht wünschen.\n\nWenn ihr euer Auto reinigen lassen wollt, geht zu Clean Car Solution! Ich kann den Laden wirklich jedem weiterempfehlen. Ich würde persönlich nirgendwo anders hingehen. 👍🏼',
      },
      {
        id: 'mike-k',
        author: 'Mike K.',
        rating: 5,
        text: 'Bin sehr zufrieden. Top Job und sehr gute Beratung.',
      },
      {
        id: 'ashley-g',
        author: 'Ashley G.',
        rating: 5,
        text: 'Ich bin wirklich begeistert! Ich habe mein Auto zur Aufbereitung innen und außen inklusive Wäsche gebracht und bin mehr als zufrieden mit dem Ergebnis. Besonders toll finde ich, dass mein Auto jetzt wieder frisch und sauber riecht.\nAuch die Beratung war super!! Absolut empfehlenswert :)',
      },
      {
        id: 'alex-b',
        author: 'Alex B.',
        rating: 5,
        text: 'Habe ein Auto für die Leasingrückgabe aufbereiten lassen. Die Jungs sind super nett, haben einen tollen Job gemacht und als kleines Goodie noch den Innenraum gereinigt, obwohl ich das gar nicht beauftragt hatte. Wenn ihr vorbeifahrt um nach einer Einschätzung zu fragen, geht die Toreinfahrt bis nach ganz hinten durch, hab es beim ersten Mal nicht gefunden.',
      },
    ],
  } satisfies ReviewSummary,
} as const;
