const euro = new Intl.NumberFormat('de-DE', {
  style: 'currency',
  currency: 'EUR',
  maximumFractionDigits: 0,
});

/** 89 → „89 €“ */
export function formatEuro(value: number): string {
  return euro.format(value);
}
