import { Logo } from '@/components/brand/Logo';
import { Camera } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

/** Sucher-Ecken (oben links, oben rechts, unten rechts, unten links). */
const CORNERS = [
  'top-0 left-0 border-t border-l',
  'top-0 right-0 border-t border-r',
  'right-0 bottom-0 border-r border-b',
  'bottom-0 left-0 border-b border-l',
];

/**
 * Platzhalter für Leistungsfotos, bis die eigenen Aufnahmen aus dem Studio vorliegen:
 * dunkles Studio mit Licht von oben, die Bildmarke als leise Silhouette auf der Bodenlinie,
 * dazu Sucher-Ecken wie im Kamera-Display. Füllt den (relativ positionierten) Rahmen vollständig.
 */
export function ServicePlaceholder({ className }: { className?: string }) {
  return (
    <div aria-hidden className={cn('absolute inset-0 overflow-hidden bg-ink-850', className)}>
      <div className="absolute inset-x-0 top-0 h-3/4 bg-[radial-gradient(55%_75%_at_50%_0%,rgb(38_171_246/0.16),rgb(0_72_206/0.08)_45%,transparent_78%)]" />
      <div className="absolute inset-x-[10%] top-[62%] h-px bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.16),transparent)]" />
      <div className="absolute inset-x-[18%] top-[62%] h-1/5 bg-[radial-gradient(50%_70%_at_50%_0%,rgb(38_171_246/0.1),transparent)]" />

      <div className="absolute inset-x-0 bottom-[38%] flex justify-center">
        <Logo variant="blue" showWordmark={false} title="" className="h-auto w-[52%] max-w-[17rem] opacity-25" />
      </div>

      <span className="absolute inset-x-0 top-[62%] mt-5 flex items-center justify-center gap-2 font-mono text-[0.6875rem] tracking-[0.2em] text-fg/50 uppercase">
        <Camera className="size-3.5 text-sky-400" />
        Foto folgt
      </span>

      <div className="absolute inset-3 sm:inset-4">
        {CORNERS.map((corner) => (
          <span key={corner} className={cn('absolute size-5 border-white/25', corner)} />
        ))}
      </div>

      <div className="absolute inset-0 bg-grain opacity-[0.06] mix-blend-overlay" />
    </div>
  );
}
