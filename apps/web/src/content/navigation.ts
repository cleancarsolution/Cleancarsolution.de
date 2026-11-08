import type { ServiceSlug } from '@ccs/shared';

/**
 * Sektions-Anker der Startseite (Vertrag zwischen Navigation und Sektionen):
 * #top · #ueber-uns · #leistungen (+ je Leistung #<slug>) · #hygiene · #preise
 * #einblick · #ablauf · #kundenstimmen · #faq · #kontakt
 */
export const mainNav = [
  { label: 'Leistungen', href: '/#leistungen', menu: 'services' },
  { label: 'Über uns', href: '/#ueber-uns' },
  { label: 'Preise', href: '/#preise' },
  { label: 'Ablauf', href: '/#ablauf' },
  { label: 'FAQ', href: '/#faq' },
] as const;

export const headerCta = { label: 'Termin anfragen', href: '/#kontakt' } as const;

export const legalNav = [
  { label: 'Impressum', href: '/impressum' },
  { label: 'Datenschutz', href: '/datenschutz' },
] as const;

/** Leistungen verlinken (vorerst) auf ihren Anker in der Leistungs-Sektion der Startseite. */
export function serviceHref(slug: ServiceSlug): string {
  return `/#${slug}`;
}

/** Texte des Mega-Dropdowns „Leistungen“ (Desktop) und des Leistungs-Akkordeons im Mobile-Menü. */
export const servicesMenu = {
  label: 'Leistungen',
  listLabel: 'Unsere Leistungen',
  /** Link in der Vorschau-Fläche des Mega-Dropdowns. */
  previewCta: 'Mehr erfahren',
  allLabel: 'Alle Leistungen ansehen',
  allHref: '/#leistungen',
  /**
   * Angebotszeile – wählt im Kontaktformular die Leistung vor.
   * Bezeichnung und Startpreis kommen aus dem Katalog (`priceLabel` / `priceFrom` in @ccs/shared).
   */
  offer: { service: 'handwaesche' satisfies ServiceSlug, prefix: 'ab' },
} as const;

/** Texte des Mobile-Menüs. */
export const mobileMenu = {
  openLabel: 'Menü öffnen',
  closeLabel: 'Menü schließen',
  navLabel: 'Hauptnavigation',
  contactTitle: 'Direkt erreichen',
  socialTitle: 'Folgen',
} as const;
