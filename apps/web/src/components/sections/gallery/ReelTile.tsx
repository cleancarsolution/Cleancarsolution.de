import type { CSSProperties } from 'react';
import { gallery } from '@/content/gallery';

/*
 * Geometrie der Einbettung von Instagram: Kopfzeile (HEADER px), darunter das Bild im Format 4 : 5, das Reel
 * (9 : 16) darin mittig mit schwarzen Rändern. FIT = so viel breiter muss die Einbettung sein, damit das Reel
 * selbst genau die Kachelbreite füllt. In Originalgröße gerendert – Instagrams Play-Zeichen bleibt normal groß.
 */
const HEADER = 54;
const FIT = 0.8 / 0.5625;

/** Bezugsgröße `cqw` = Kachelbreite (Container). Oben/seitlich bleibt der Überstand außerhalb der Kachel. */
const PREVIEW_STYLE: CSSProperties = {
  width: `${FIT * 100}cqw`,
  height: `calc(${HEADER}px + ${FIT * 125}cqw)`,
  left: `${((1 - FIT) / 2) * 100}cqw`,
  top: `calc(${((1 - FIT) / 2) * 125}cqw - ${HEADER}px)`,
};

/**
 * Hinweis „Auf Instagram ansehen“ unter dem Play-Zeichen – Lage und Schrift wie bei Instagram, das ihn bei Reels,
 * die es eingebettet nicht abspielt, selbst zeigt: 39–57 px unter der Bildmitte (62,5cqw = Mitte der 4 : 5-Kachel),
 * 14 px Systemschrift, weiß mit leichtem Schatten. Bei solchen Reels (`instagramLabel`) entfällt unserer –
 * Instagrams eigenen kann die Seite nicht überdecken, er liegt je nach Browser verschieden hoch.
 */
const HINT_STYLE: CSSProperties = {
  top: 'calc(62.5cqw + 39px)',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

interface ReelTileProps {
  url: string;
  /** z. B. „Reel 1“ – unterscheidet die gleichlautenden Links für Screenreader. */
  label: string;
  /** Vorschau von Instagram laden (der Slider ist in der Nähe). */
  load: boolean;
  /** Instagram schreibt „Auf Instagram ansehen“ selbst in die Vorschau – dann kein eigener Hinweis. */
  instagramLabel?: boolean;
}

/**
 * Kachel eines Reels: Vorschau von Instagram mit dessen eigenem Play-Zeichen (bis sie geladen ist, die
 * Studiofläche), darunter „Auf Instagram ansehen“ – die ganze Fläche öffnet das Reel auf Instagram, abgespielt wird dort.
 */
export function ReelTile({ url, label, load, instagramLabel }: ReelTileProps) {
  return (
    <div className="@container absolute inset-0 overflow-hidden bg-ink-850">
      {/* Studiolicht von oben, feines Korn – wie die übrigen Bildflächen (auch, solange die Vorschau lädt) */}
      <span aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgb(38_171_246/0.07),transparent_70%)]" />
      <span aria-hidden className="absolute inset-0 bg-grain opacity-[0.05]" />

      {load ? (
        // Nur Ansicht: nicht bedienbar, nicht fokussierbar – der Link darüber führt zu Instagram
        <div inert className="pointer-events-none absolute inset-0">
          <iframe
            src={`${url}embed/`}
            title=""
            sandbox="allow-scripts allow-same-origin"
            className="absolute border-0"
            style={PREVIEW_STYLE}
          />
        </div>
      ) : null}

      <a href={url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 outline-offset-[-3px]">
        {instagramLabel ? null : (
          <span
            aria-hidden
            style={HINT_STYLE}
            className="absolute inset-x-0 text-center text-[14px] leading-[18px] font-semibold text-white [text-shadow:0_1px_2px_rgb(0_0_0/0.5)]"
          >
            {gallery.feed.open}
          </span>
        )}
        <span className="sr-only">{`${gallery.feed.open} (${label}, öffnet in neuem Tab)`}</span>
      </a>
    </div>
  );
}
