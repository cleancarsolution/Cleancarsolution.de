import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ArrowRight } from './icons';
import { SmartLink, type SmartLinkProps } from './SmartLink';

type Variant = 'primary' | 'white' | 'secondary' | 'navy' | 'ghost';
type Size = 'md' | 'lg';

/**
 * Buttons: flache Flächen, präzise Kanten (Radius wie Formularfelder), keine Schatten, kein Schein, kein Glas.
 * Zustände nur über Farbe – Hover hellt eine Stufe auf, Active dunkelt ab; Fokus = Sky-Outline (globals.css).
 */
const base =
  'group/btn relative inline-flex shrink-0 items-center justify-center gap-3 rounded-sm font-medium tracking-[-0.005em] whitespace-nowrap transition-[background-color,color,border-color] duration-200 ease-out-quint select-none disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  /** Haupt-CTA auf Dunkel: Royal, flach */
  primary: 'bg-royal text-white hover:bg-royal-400 active:bg-royal-600',
  /** Auf Video/Fotos und Schwarz: maximal klar */
  white: 'bg-fg text-ink-950 hover:bg-sky-100 active:bg-sky-200',
  /** Sekundär auf Dunkel: Haarlinie, transparent */
  secondary: 'border border-white/25 text-fg hover:border-white/60 hover:bg-white/[0.04] active:bg-white/[0.08]',
  /** Primär auf hellen Flächen (paper) */
  navy: 'bg-navy text-white hover:bg-royal active:bg-royal-600',
  /** Text-Link mit Pfeil */
  ghost: 'px-0 text-fg hover:text-sky-300',
};

const sizes: Record<Size, string> = {
  md: 'h-11 px-5 text-[0.9375rem]',
  lg: 'h-14 px-7 text-base',
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  /** Pfeil rechts, der beim Hover nach rechts gleitet. */
  arrow?: boolean;
  icon?: ReactNode;
  className?: string;
  children: ReactNode;
}

function Inner({ arrow, icon, children }: Pick<CommonProps, 'arrow' | 'icon' | 'children'>) {
  return (
    <>
      {icon ? <span className="-ml-0.5 inline-flex size-[1.1em] items-center justify-center">{icon}</span> : null}
      <span className="relative">{children}</span>
      {arrow ? (
        <ArrowRight
          aria-hidden
          className="-mr-0.5 size-[1.05em] transition-transform duration-300 ease-out-quint group-hover/btn:translate-x-0.5"
        />
      ) : null}
    </>
  );
}

export function buttonClasses({ variant = 'primary', size = 'md', className }: Pick<CommonProps, 'variant' | 'size' | 'className'>) {
  return cn(base, variants[variant], variant === 'ghost' ? 'h-auto' : sizes[size], className);
}

export function ButtonLink({
  variant,
  size,
  arrow,
  icon,
  className,
  children,
  ...props
}: CommonProps & Omit<SmartLinkProps, 'children' | 'className'>) {
  return (
    <SmartLink className={buttonClasses({ variant, size, className })} {...props}>
      <Inner arrow={arrow} icon={icon}>
        {children}
      </Inner>
    </SmartLink>
  );
}

export function Button({
  variant,
  size,
  arrow,
  icon,
  className,
  children,
  type = 'button',
  ...props
}: CommonProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'className'>) {
  return (
    <button type={type} className={buttonClasses({ variant, size, className })} {...props}>
      <Inner arrow={arrow} icon={icon}>
        {children}
      </Inner>
    </button>
  );
}
