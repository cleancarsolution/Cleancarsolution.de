/**
 * Zentrale Firmendaten – Single Source of Truth für Web (Header, Footer, Kontakt, SEO/JSON-LD)
 * und API (E-Mail-Benachrichtigungen).
 *
 * Quelle: bestehende Website cleancarsolution.de, Banner & Roll-ups des Kunden.
 * TODO(Kunde): Öffnungszeiten ergänzen.
 */
export const site = {
  name: 'Clean Car Solution',
  shortName: 'Clean Car',
  claim: 'Professional Car Care',
  tagline: 'Erfahrung. Vertrauen. Exzellenz.',
  description:
    'Professionelle Fahrzeugaufbereitung, Autohandwäsche sowie Polster- und Lederreinigung in Düsseldorf – von Hand, mit Premium-Produkten und hygienischer Trockendampf-Reinigung.',
  url: 'https://cleancarsolution.de',
  locale: 'de-DE',
  address: {
    street: 'Himmelgeister Str. 35',
    postalCode: '40225',
    city: 'Düsseldorf',
    country: 'DE',
  },
  /** Link für „Route planen“ – bewusst ohne eingebettete Karte (DSGVO). */
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Himmelgeister%20Str.%2035%2C%2040225%20D%C3%BCsseldorf',
  phones: [
    { label: 'Mobil', display: '0176 24024079', href: 'tel:+4917624024079', e164: '+4917624024079' },
  ],
  email: 'info@cleancarsolution.de',
  socials: [
    { label: 'Instagram', handle: '@cleancarsolution40233', href: 'https://www.instagram.com/cleancarsolution40233/' },
    { label: 'TikTok', handle: '@cleancarsolution', href: 'https://www.tiktok.com/@cleancarsolution' },
  ],
  /** TODO(Kunde): Öffnungszeiten liefern – bis dahin wird der Hinweis angezeigt. */
  openingHours: null as null | ReadonlyArray<{ days: string; hours: string }>,
  appointmentNote: 'Termine nach Vereinbarung',
  /** Produkte, mit denen laut Banner gearbeitet wird. */
  brands: ['SONAX', '3M', "Meguiar's"],
} as const;

export type Site = typeof site;

export const primaryPhone = site.phones[0];

export function formatAddress(separator = ', '): string {
  const { street, postalCode, city } = site.address;
  return `${street}${separator}${postalCode} ${city}`;
}
