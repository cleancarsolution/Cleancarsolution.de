/**
 * Inhouse-Partner PKW-Schmiede – beworben im Footer und im Mega-Dropdown „Leistungen“ (Mobil: im Akkordeon).
 * Texte vom Werkstatt-Plakat des Partners, Leistungen wie auf pkw-schmiede.de.
 * Logo: `/partner/pkw-schmiede-light.svg` – aus `logo.svg` (Repo-Root) für dunkle Flächen aufgehellt,
 * Zahnrad und „PKW“ in Blau wie auf dem Plakat. Animiert: `components/partner/PartnerLogoAnimated`.
 */
export const partner = {
  name: 'PKW-Schmiede',
  label: 'Inhouse-Partner',
  tagline: 'Ihr zuverlässiger Service rund ums Auto.',
  text: 'Service, Reparatur und Wartung – alles rund ums Auto bei unserem Inhouse-Partner, der PKW-Schmiede.',
  /** Leistungen in Kurzform (wie auf pkw-schmiede.de) – Partner-Karte im Footer und im Mega-Dropdown. */
  highlights: [
    'Ölwechsel',
    'Klimaservice',
    'Reifen & Felgen',
    'Gutachten',
    'HU/AU',
    'Folierung',
    'Autoglas',
  ],
  href: 'https://www.pkw-schmiede.de',
  hrefLabel: 'www.pkw-schmiede.de',
  visitLabel: 'Website besuchen',
  logo: { src: '/partner/pkw-schmiede-light.svg', width: 180, height: 83 },
} as const;
