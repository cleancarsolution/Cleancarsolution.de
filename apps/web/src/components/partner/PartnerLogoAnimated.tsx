'use client';

import { useInView } from 'motion/react';
import { useId, useRef } from 'react';
import { cn } from '@/lib/cn';
import styles from './partner-logo.module.css';
import {
  GEAR_CLIP_X,
  PARTNER_COLORS,
  PARTNER_LOGO_SIZE,
  PARTNER_LOGO_VIEWBOX,
  PARTNER_PATHS,
} from './partner-logo-paths';

interface PartnerLogoAnimatedProps {
  /**
   * Steuert den Auftakt von außen (z. B. Mega-Dropdown offen). Ohne Angabe startet er einmalig,
   * sobald das Logo ins Bild kommt.
   */
  active?: boolean;
  /**
   * `true` (Standard): das Zahnrad läuft nach dem Auftakt langsam weiter.
   * `false`: es steht still und rückt nur um einen Zahn weiter, solange die umgebende Partner-Karte
   * (`data-partner-card`) überfahren oder per Tastatur fokussiert wird.
   */
  spin?: boolean;
  className?: string;
}

/**
 * Logo der PKW-Schmiede mit Bewegung: das Zahnrad dreht sich ein (sichtbar bleibt – wie im Original – nur
 * die linke Hälfte), Kopf und Schriftzug folgen gestaffelt.
 * Rein dekorativ (`aria-hidden`) – der umgebende Link trägt den Namen. Größe über die Höhe steuern.
 */
export function PartnerLogoAnimated({ active, spin = true, className }: PartnerLogoAnimatedProps) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const clipId = `${useId().replace(/[^a-zA-Z0-9-]/g, '')}-gear`;
  const on = active ?? inView;

  return (
    <svg
      ref={ref}
      viewBox={PARTNER_LOGO_VIEWBOX}
      width={PARTNER_LOGO_SIZE.width}
      height={PARTNER_LOGO_SIZE.height}
      aria-hidden
      data-active={on}
      className={cn('block h-12 w-auto', styles.root, className)}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={GEAR_CLIP_X} height="100" />
        </clipPath>
      </defs>

      {/* data-reveal: ohne JavaScript steht das Logo sofort fertig da (noscript-Regel im Layout) */}
      <g clipPath={`url(#${clipId})`}>
        <g data-reveal className={cn(styles.part, styles.gearIn)}>
          <path
            className={spin ? styles.gearSpin : styles.gearStep}
            d={PARTNER_PATHS.gear}
            fill={PARTNER_COLORS.gear}
            fillRule="evenodd"
          />
        </g>
      </g>

      <path data-reveal className={cn(styles.part, styles.emblem)} d={PARTNER_PATHS.emblem} fill={PARTNER_COLORS.emblem} fillRule="evenodd" />
      <path data-reveal className={cn(styles.part, styles.divider)} d={PARTNER_PATHS.divider} fill={PARTNER_COLORS.emblem} />
      <path data-reveal className={cn(styles.part, styles.pkw)} d={PARTNER_PATHS.pkw} fill={PARTNER_COLORS.pkw} fillRule="evenodd" />
      <path data-reveal className={cn(styles.part, styles.schmiede)} d={PARTNER_PATHS.schmiede} fill={PARTNER_COLORS.schmiede} fillRule="evenodd" />
      <path data-reveal className={cn(styles.part, styles.claim)} d={PARTNER_PATHS.claim} fill={PARTNER_COLORS.claim} />
    </svg>
  );
}
