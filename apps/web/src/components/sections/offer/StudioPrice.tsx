import { formatEuro } from '@ccs/shared';
import { cn } from '@/lib/cn';
import styles from './studio.module.css';

interface StudioPriceProps {
  prefix: string;
  price: number;
  className?: string;
}

/**
 * „ab 89 €“ als Chrom-Ziffern auf dem Studioboden.
 * Ebenen der Ziffern (alle deckungsgleich, nur die erste trägt das Layout):
 *   1. Silhouette im Dunkel  2. Chrom (blendet ein, sobald das Licht angeht)
 *   3. Glanzlicht – ein schräges Lichtband zieht einmal herein und folgt danach dem Zeiger.
 * Darunter eine Bodenlinie und die Spiegelung der Ziffern im glänzenden Boden.
 * Screenreader lesen nur „ab 89 €“.
 */
export function StudioPrice({ prefix, price, className }: StudioPriceProps) {
  const formatted = formatEuro(price);
  const amount = formatted.replace(/[^\d.,]/g, '');

  return (
    <p className={cn('relative', className)}>
      <span className="sr-only">{`${prefix} ${formatted}`}</span>

      <span
        aria-hidden
        className="relative flex items-start pb-[0.34em] text-[clamp(8.5rem,4.6rem+13.2vw,19.5rem)] font-medium tracking-[-0.065em] font-wide"
      >
        {/*
          „ab“ und „€“ hängen an der Versalhöhe der Ziffern: Ziffern-Oberkante liegt bei 0,051 em (Zeilenhöhe 0,8),
          Zeilenhöhe 0,7 setzt die Box-Oberkante der kleinen Zeichen auf ihre eigene Versalhöhe.
        */}
        <span className="mt-[0.051em] mr-[0.09em]">
          <span className="block text-eyebrow leading-[0.7] font-medium tracking-[0.22em] text-sky-300 uppercase font-expanded">
            {prefix}
          </span>
        </span>

        <span className="relative">
          <span className={cn(styles.digits, styles.unlit, 'tabular')}>{amount}</span>
          <span data-reveal className={cn(styles.layer, styles.lit)}>
            <span className={cn(styles.digits, styles.chrome, 'tabular')}>{amount}</span>
          </span>
          <span className={cn(styles.layer, styles.sweep)}>
            <span className={cn(styles.layer, styles.follow)}>
              <span className={cn(styles.layer, styles.unfollow)}>
                <span className={cn(styles.layer, styles.unsweep, 'opacity-90')}>
                  <span className={cn(styles.digits, styles.hot, 'tabular')}>{amount}</span>
                </span>
              </span>
            </span>
          </span>

          {/* Spiegelung: die Ziffern, an der Bodenlinie gekippt, laufen nach unten ins Dunkel aus */}
          <span
            data-reveal
            className={cn('absolute inset-x-0 top-full h-[0.34em] overflow-hidden', styles.mirror, styles.reflection)}
          >
            <span className={cn(styles.digits, styles.chrome, styles.flip, 'tabular')}>{amount}</span>
          </span>
        </span>

        <span className="mt-[0.051em] ml-[0.05em]">
          <span className="block text-[0.27em] leading-[0.7] font-light tracking-normal text-sky-300">€</span>
        </span>

        {/* Bodenlinie: die Ziffern stehen darauf wie ein Fahrzeug auf dem Studioboden */}
        <span
          className={cn(
            'absolute inset-x-0 top-[0.8em] h-px bg-[linear-gradient(90deg,transparent,rgb(255_255_255/0.3)_14%,rgb(255_255_255/0.16)_55%,transparent)]',
            styles.floor,
          )}
        />
      </span>
    </p>
  );
}
