import type { CSSProperties } from 'react';
import { Play } from '@/components/ui/icons';
import { gallery } from '@/content/gallery';

/*
 * Geometrie der Einbettung von Instagram: Kopfzeile (HEADER px), darunter das Bild im Format 4 : 5, das Reel
 * (9 : 16) darin mittig mit schwarzen Rändern. FIT = so viel breiter muss die Einbettung sein, damit das Reel
 * selbst genau die Kachelbreite füllt; ZOOM = so viel größer wird sie gerendert und wieder verkleinert –
 * Instagrams eigene Bedienelemente schrumpfen mit und verschwinden unter dem Play-Zeichen der Kachel.
 */
const HEADER = 54;
const FIT = 0.8 / 0.5625;
const ZOOM = 3;

/** Bezugsgröße `cqw` = Kachelbreite (Container). Oben/seitlich bleibt der Überstand außerhalb der Kachel. */
const PREVIEW_STYLE: CSSProperties = {
  width: `${ZOOM * FIT * 100}cqw`,
  height: `calc(${HEADER}px + ${ZOOM * FIT * 125}cqw)`,
  left: `${((1 - FIT) / 2) * 100}cqw`,
  top: `calc(${((1 - FIT) / 2) * 125}cqw - ${HEADER / ZOOM}px)`,
  transform: `scale(${1 / ZOOM})`,
};

interface ReelTileProps {
  url: string;
  /** z. B. „Reel 1“ – unterscheidet die gleichlautenden Links für Screenreader. */
  label: string;
  /** Einwilligung erteilt – die Vorschau kommt von Instagram. */
  consent: boolean;
}

/**
 * Kachel eines Reels: Vorschau von Instagram (erst nach Einwilligung, bis dahin die Studiofläche), darüber
 * Play-Zeichen und „Auf Instagram ansehen“ – die ganze Fläche öffnet das Reel auf Instagram, abgespielt wird dort.
 */
export function ReelTile({ url, label, consent }: ReelTileProps) {
  return (
    <div className="group/reel @container absolute inset-0 overflow-hidden bg-ink-850">
      {/* Studiolicht von oben, feines Korn – wie die übrigen Bildflächen (auch, solange die Vorschau lädt) */}
      <span aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_70%_at_50%_0%,rgb(38_171_246/0.07),transparent_70%)]" />
      <span aria-hidden className="absolute inset-0 bg-grain opacity-[0.05]" />

      {consent ? (
        // Nur Ansicht: nicht bedienbar, nicht fokussierbar – der Link darüber führt zu Instagram
        <div inert className="pointer-events-none absolute inset-0">
          <iframe
            src={`${url}embed/`}
            title=""
            loading="lazy"
            sandbox="allow-scripts allow-same-origin"
            className="absolute origin-top-left border-0"
            style={PREVIEW_STYLE}
          />
        </div>
      ) : null}

      <a href={url} target="_blank" rel="noopener noreferrer" className="absolute inset-0 outline-offset-[-3px]">
        {/* Play-Zeichen bleibt auch auf hellen Motiven lesbar */}
        <span aria-hidden className="absolute inset-0 bg-[radial-gradient(55%_40%_at_50%_50%,rgb(3_5_15/0.35),transparent)]" />
        {/* Genau mittig und deckend – darunter liegt Instagrams eigenes Play-Zeichen der Vorschau */}
        <span
          aria-hidden
          className="absolute top-1/2 left-1/2 grid size-16 -translate-1/2 place-items-center rounded-full bg-ink-950/90 text-fg ring-1 ring-white/30 transition-[box-shadow] duration-300 ring-inset group-hover/reel:ring-white/60"
        >
          <Play className="ml-0.5 size-5" />
        </span>
        <span className="absolute inset-x-4 top-[calc(50%+2.75rem)] text-center text-sm font-medium text-fg [text-shadow:0_1px_12px_rgb(3_5_15/0.8)]">
          {gallery.feed.open}
          <span className="sr-only"> ({label}, öffnet in neuem Tab)</span>
        </span>
      </a>
    </div>
  );
}
