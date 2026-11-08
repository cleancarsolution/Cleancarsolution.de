/**
 * Logo-Dateien des Kunden auf transparentem Grund (`public/brand/`), frei auf den dunklen Flächen – in der
 * Hell-Fassung wie `LOGO_PALETTE.light`: Navy als Weiß, „SOLUTION“ hellblau, Wellen blau (Original-Navy wäre
 * auf Ink unsichtbar). Quellen im Projekt-Root, leere Ränder abgeschnitten.
 */
export const logoFiles = {
  /** `Color-vert.png`: Auto mit Wellen über dem Schriftzug – Footer. */
  vertical: { src: '/brand/logo-vertical-light.png', width: 1750, height: 1114 },
  /** `Color-horiz.png`: Auto und Schriftzug nebeneinander – Header ab sm. */
  horizontal: { src: '/brand/logo-horizontal-light.png', width: 1928, height: 315 },
  /** `mobile-CleanCar.png`: nur Auto und Wellen – Header auf dem Smartphone. */
  mark: { src: '/brand/logo-mark-light.png', width: 502, height: 186 },
} as const;
