const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** Alle per Tab erreichbaren, sichtbaren Elemente in DOM-Reihenfolge. */
export function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
    (element) =>
      element.tabIndex >= 0 &&
      !element.closest('[inert]') &&
      element.getClientRects().length > 0 &&
      getComputedStyle(element).visibility !== 'hidden',
  );
}

/**
 * Hält den Tab-Fokus innerhalb von `root` (Fokusfalle für das Mobile-Menü).
 * Gibt `true` zurück, wenn das Event behandelt wurde.
 */
export function trapTab(event: KeyboardEvent, root: HTMLElement | null): boolean {
  if (event.key !== 'Tab') return false;
  const items = getFocusable(root);
  const first = items[0];
  const last = items[items.length - 1];
  if (!first || !last) return false;

  const active = document.activeElement;
  const outside = !(active instanceof Node) || !root?.contains(active);

  if (event.shiftKey && (active === first || outside)) {
    event.preventDefault();
    last.focus();
    return true;
  }
  if (!event.shiftKey && (active === last || outside)) {
    event.preventDefault();
    first.focus();
    return true;
  }
  return false;
}

/**
 * Setzt alle Geschwister von `keep` unter <body> auf `inert` (Hintergrund bei offenem Vollbild-Menü)
 * und liefert eine Funktion, die den vorherigen Zustand wiederherstellt.
 */
export function inertSiblings(keep: HTMLElement): () => void {
  const touched: HTMLElement[] = [];
  for (const child of Array.from(document.body.children)) {
    if (!(child instanceof HTMLElement) || child === keep || child.contains(keep)) continue;
    if (child.tagName === 'SCRIPT' || child.hasAttribute('inert')) continue;
    child.setAttribute('inert', '');
    touched.push(child);
  }
  return () => {
    for (const child of touched) child.removeAttribute('inert');
  };
}
