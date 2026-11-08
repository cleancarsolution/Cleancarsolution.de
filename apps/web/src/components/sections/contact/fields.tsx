import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ChevronDown } from '@/components/ui/icons';
import { cn } from '@/lib/cn';
import { EASE_OUT_EXPO } from '@/lib/motion';

/**
 * Formularfelder im Haarlinien-Stil mit schwebenden Labels.
 * Fokus: Rahmen in Sky + Lichtlinie, die von links über die Unterkante gleitet.
 * Fehler: aria-invalid + aria-describedby → Meldung unter dem Feld.
 */

const control =
  'peer block w-full rounded-sm border bg-white/[0.035] px-4 text-base text-fg outline-none transition-[border-color,background-color,box-shadow] duration-300 ease-out-quint placeholder:text-transparent hover:bg-white/[0.05] focus:bg-white/[0.06] autofill:shadow-[inset_0_0_0_100px_var(--color-ink-800)] autofill:[-webkit-text-fill-color:var(--color-fg)] disabled:cursor-not-allowed disabled:opacity-60';

const controlStates = {
  ok: 'border-line-strong hover:border-white/25 focus:border-sky/70 focus:shadow-[0_0_0_4px_rgb(38_171_246/0.14)] autofill:focus:shadow-[inset_0_0_0_100px_var(--color-ink-800),0_0_0_4px_rgb(38_171_246/0.14)]',
  error:
    'border-red-400/70 hover:border-red-300/80 focus:border-red-300 focus:shadow-[0_0_0_4px_rgb(248_113_113/0.16)] autofill:focus:shadow-[inset_0_0_0_100px_var(--color-ink-800),0_0_0_4px_rgb(248_113_113/0.16)]',
} as const;

/** Label-Position: ruhend (Feld leer) bzw. schwebend (Fokus/Inhalt). Nur transform – keine Layout-Animation. */
const labelBase =
  'pointer-events-none absolute top-[1.0625rem] left-4 origin-left text-[0.9375rem] leading-5 whitespace-nowrap transition-[translate,scale,color] duration-300 ease-out-quint';
const labelFloated = '-translate-y-[0.6875rem] scale-[0.8]';
const labelAuto =
  'peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-[0.6875rem] peer-focus:scale-[0.8]';

function labelTone(error?: string) {
  return error ? 'text-red-200' : 'text-fg-muted peer-focus:text-sky-300';
}

interface FieldBaseProps {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  className?: string;
}

export function errorId(id: string) {
  return `${id}-fehler`;
}

function a11yProps(id: string, required: boolean | undefined, error: string | undefined) {
  return {
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId(id) : undefined,
    'aria-required': required || undefined,
  } as const;
}

function LabelText({ label, required }: { label: string; required?: boolean }) {
  return (
    <>
      {label}
      {required ? (
        <span aria-hidden className="ml-0.5 text-sky-400">
          *
        </span>
      ) : null}
    </>
  );
}

/** Lichtlinie an der Unterkante – gleitet beim Fokus von links ein. */
function LightLine({ error }: { error?: string }) {
  return (
    <span
      aria-hidden
      className={cn(
        'pointer-events-none absolute inset-x-4 bottom-0 h-px origin-left scale-x-0 transition-transform duration-700 ease-out-expo peer-focus:scale-x-100',
        error ? 'bg-red-300/80' : 'bg-gradient-to-r from-sky-200 via-sky to-royal-400',
      )}
    />
  );
}

export function FieldError({ id, children }: { id: string; children?: ReactNode }) {
  if (!children) return null;
  return (
    <p id={errorId(id)} className="mt-2 flex items-start gap-2 text-[0.8125rem] leading-snug text-red-200">
      <svg aria-hidden viewBox="0 0 16 16" className="mt-px size-3.5 shrink-0 text-red-300" fill="none">
        <circle cx="8" cy="8" r="6.75" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 4.75v3.75" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="11.1" r="0.9" fill="currentColor" />
      </svg>
      <span>{children}</span>
    </p>
  );
}

/* ── Text / E-Mail / Telefon ─────────────────────────────────────────────── */

type TextFieldProps = FieldBaseProps & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'className' | 'placeholder'>;

export function TextField({ id, label, required, error, className, type = 'text', ...props }: TextFieldProps) {
  return (
    <div className={className}>
      <div className="relative">
        <input
          id={id}
          type={type}
          placeholder=" "
          required={required}
          {...a11yProps(id, required, error)}
          {...props}
          className={cn(control, controlStates[error ? 'error' : 'ok'], 'h-14 pt-5 pb-1.5')}
        />
        <label htmlFor={id} className={cn(labelBase, labelFloated, labelAuto, labelTone(error))}>
          <LabelText label={label} required={required} />
        </label>
        <LightLine error={error} />
      </div>
      <FieldError id={id}>{error}</FieldError>
    </div>
  );
}

/* ── Datum ──────────────────────────────────────────────────────────────── */

export function DateField({ id, label, required, error, className, value, ...props }: TextFieldProps) {
  const empty = !value;
  return (
    <div className={className}>
      <div className="relative">
        <input
          id={id}
          type="date"
          required={required}
          value={value}
          {...a11yProps(id, required, error)}
          {...props}
          className={cn(
            control,
            controlStates[error ? 'error' : 'ok'],
            'h-14 appearance-none pt-5 pb-1.5 text-left tabular [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-55 [&::-webkit-calendar-picker-indicator]:transition-opacity hover:[&::-webkit-calendar-picker-indicator]:opacity-90 [&::-webkit-date-and-time-value]:text-left',
            empty && 'text-fg-subtle',
          )}
        />
        <label htmlFor={id} className={cn(labelBase, labelFloated, labelTone(error))}>
          <LabelText label={label} required={required} />
        </label>
        <LightLine error={error} />
      </div>
      <FieldError id={id}>{error}</FieldError>
    </div>
  );
}

/* ── Nachricht ──────────────────────────────────────────────────────────── */

type TextAreaFieldProps = FieldBaseProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'id' | 'className' | 'placeholder'>;

export function TextAreaField({ id, label, required, error, className, rows = 5, ...props }: TextAreaFieldProps) {
  return (
    <div className={className}>
      <div className="relative">
        <textarea
          id={id}
          rows={rows}
          placeholder=" "
          required={required}
          {...a11yProps(id, required, error)}
          {...props}
          className={cn(
            control,
            controlStates[error ? 'error' : 'ok'],
            'max-h-80 min-h-36 resize-none pt-7 pb-3 leading-relaxed field-sizing-content',
          )}
        />
        <label htmlFor={id} className={cn(labelBase, labelFloated, labelAuto, labelTone(error))}>
          <LabelText label={label} required={required} />
        </label>
        <LightLine error={error} />
      </div>
      <FieldError id={id}>{error}</FieldError>
    </div>
  );
}

/* ── Auswahl ────────────────────────────────────────────────────────────── */

export interface SelectOption {
  value: string;
  label: string;
}

type SelectFieldProps = FieldBaseProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'className'> & {
    options: readonly SelectOption[];
    placeholder: string;
    /** Zähler – jede Erhöhung lässt das Feld kurz aufleuchten (Vorauswahl von außen). */
    highlightKey?: number;
  };

export function SelectField({
  id,
  label,
  required,
  error,
  className,
  options,
  placeholder,
  highlightKey = 0,
  value,
  ...props
}: SelectFieldProps) {
  const reduce = useReducedMotion();
  const empty = !value;
  const highlighted = highlightKey > 0;

  return (
    <div className={className}>
      <div className="relative">
        <select
          id={id}
          required={required}
          value={value}
          {...a11yProps(id, required, error)}
          {...props}
          className={cn(
            control,
            controlStates[error ? 'error' : 'ok'],
            'h-14 cursor-pointer appearance-none truncate pt-5 pr-11 pb-1.5',
            empty ? 'text-fg-subtle' : 'text-fg',
          )}
        >
          <option value="" className="bg-ink-850 text-fg-muted">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-ink-850 text-fg">
              {option.label}
            </option>
          ))}
        </select>
        <label htmlFor={id} className={cn(labelBase, labelFloated, labelTone(error))}>
          <LabelText label={label} required={required} />
        </label>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-fg-muted transition-[rotate,color] duration-300 peer-focus:text-sky-300"
        />
        <LightLine error={error} />

        {/* Vorauswahl: Rahmen leuchtet auf, ein Glanzlicht fährt einmal über das Feld */}
        {highlighted ? (
          <span key={highlightKey} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden rounded-sm">
            <motion.span
              className="absolute inset-0 rounded-sm bg-sky/[0.09] shadow-[inset_0_0_0_1px_rgb(38_171_246/0.75),0_0_0_4px_rgb(38_171_246/0.16)]"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0] }}
              transition={{ duration: 2.4, times: [0, 0.12, 0.7, 1], ease: 'easeInOut' }}
            />
            {reduce ? null : (
              <motion.span
                className="absolute inset-y-0 left-0 w-1/3 -skew-x-[20deg] bg-gradient-to-r from-transparent via-white/25 to-transparent"
                initial={{ x: '-120%' }}
                animate={{ x: '380%' }}
                transition={{ duration: 1.3, delay: 0.15, ease: EASE_OUT_EXPO }}
              />
            )}
          </span>
        ) : null}
      </div>
      <FieldError id={id}>{error}</FieldError>
    </div>
  );
}
