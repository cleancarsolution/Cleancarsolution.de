/**
 * PRODUKTE – Banner für die eigenen Produkte von Clean Car Solution.
 * Sitzt in der Preis-Sektion direkt unter dem Produkt-Slider „Wir arbeiten mit hochqualitativen Produkten“ (Anker
 * `#produkte`). Bewusst leer: Der Inhalt wird vom Kunden selbst eingefügt – solange nichts drinsteht, bleibt die
 * Fläche unsichtbar; sobald Inhalt da ist, hält sie den Abstand zum Produkt-Slider.
 */
export function ProductBanner() {
  return <div id="produkte" className="mt-16 empty:hidden lg:mt-24" />;
}
