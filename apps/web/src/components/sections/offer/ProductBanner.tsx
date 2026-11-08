/**
 * PRODUKTE – Banner für die eigenen Produkte von Clean Car Solution.
 * Sitzt in der Preis-Sektion direkt unter der Zeile „Wir arbeiten mit Produkten von …“ (Anker `#produkte`).
 * Bewusst leer: Der Inhalt wird vom Kunden selbst eingefügt – solange nichts drinsteht, bleibt die Fläche
 * unsichtbar; sobald Inhalt da ist, hält sie den Abstand zur Markenzeile.
 */
export function ProductBanner() {
  return <div id="produkte" className="mt-16 empty:hidden lg:mt-24" />;
}
