'use client';

import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useId, useRef, useState, useSyncExternalStore, type ChangeEvent, type FormEvent } from 'react';
import {
  CONSULTATION_OPTION,
  primaryPhone,
  services,
  validateInquiry,
  type InquiryInput,
  type InquiryServiceValue,
} from '@ccs/shared';
import { Button } from '@/components/ui/Button';
import { Check, Phone } from '@/components/ui/icons';
import { contact } from '@/content/contact';
import { isApiRequestError, submitInquiry } from '@/lib/api';
import { cn } from '@/lib/cn';
import { onServiceRequest, readServiceFromUrl } from '@/lib/events';
import { EASE_OUT_EXPO } from '@/lib/motion';
import { DateField, FieldError, SelectField, TextAreaField, TextField, errorId } from './fields';

interface Values {
  name: string;
  email: string;
  phone: string;
  vehicle: string;
  service: string;
  preferredDate: string;
  message: string;
  consent: boolean;
  website: string;
}

type Field = Exclude<keyof Values, 'website'>;
type Errors = Partial<Record<Field, string>>;
type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success' }
  | { kind: 'error'; reason: 'network' | 'rateLimited' | 'server' };

const EMPTY: Values = {
  name: '',
  email: '',
  phone: '',
  vehicle: '',
  service: '',
  preferredDate: '',
  message: '',
  consent: false,
  website: '',
};

/** Reihenfolge für Fokus & Fehlerzusammenfassung. */
const FIELDS: readonly Field[] = ['name', 'email', 'phone', 'vehicle', 'service', 'preferredDate', 'message', 'consent'];

const SERVICE_OPTIONS = [
  ...services.map((service) => ({ value: service.slug, label: service.name })),
  { value: CONSULTATION_OPTION, label: contact.form.consultationLabel },
];

const f = contact.form;

function todayIso(): string {
  const now = new Date();
  return new Date(now.getTime() - now.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

/** Heutiges Datum (lokal) – auf dem Server leer, damit die Hydration übereinstimmt. */
const noSubscription = () => () => {};
function useToday(): string {
  return useSyncExternalStore(noSubscription, todayIso, () => '');
}

function toInput(values: Values): InquiryInput {
  return {
    ...values,
    service: values.service as InquiryServiceValue | '',
    consent: values.consent as true,
  };
}

/** Client-Validierung mit demselben Zod-Schema wie die API – erste Meldung je Feld. */
function collectErrors(values: Values, today: string): Errors {
  const result = validateInquiry(toInput(values));
  const errors: Errors = {};
  if (!result.success) {
    for (const field of FIELDS) {
      const message = result.fieldErrors[field]?.[0];
      if (message) errors[field] = message;
    }
  }
  if (today && values.preferredDate && values.preferredDate < today && !errors.preferredDate) {
    errors.preferredDate = f.errors.dateInPast;
  }
  return errors;
}

/**
 * Terminanfrage → `POST /v1/inquiries` (apps/api).
 * Leistungen lassen sich von überall vorwählen (`requestService`, `?leistung=`).
 * Eingaben bleiben bei jedem Fehler erhalten.
 */
export function ContactForm() {
  const uid = useId();
  const id = (field: keyof Values) => `${uid}-${field}`;
  const reduce = useReducedMotion();
  const successRef = useRef<HTMLHeadingElement>(null);

  const [values, setValues] = useState<Values>(EMPTY);
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [serverErrors, setServerErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [summary, setSummary] = useState('');
  const [highlightKey, setHighlightKey] = useState(0);
  const today = useToday();

  useEffect(() => {
    const preselect = (service: InquiryServiceValue) => {
      setValues((current) => ({ ...current, service }));
      setHighlightKey((key) => key + 1);
      setStatus((current) => (current.kind === 'success' ? { kind: 'idle' } : current));
    };
    const fromUrl = readServiceFromUrl();
    if (fromUrl) preselect(fromUrl);
    // Per Klick angefordert („Anfragen“, „Termin sichern“ …): Fokus wandert mit ins Formular, ohne das weiche
    // Scrollen zu stören – Tastatur und Screenreader landen direkt auf der vorgewählten Leistung.
    return onServiceRequest((service) => {
      preselect(service);
      window.requestAnimationFrame(() => document.getElementById(`${uid}-service`)?.focus({ preventScroll: true }));
    });
  }, [uid]);

  useEffect(() => {
    if (status.kind === 'success') successRef.current?.focus();
  }, [status.kind]);

  const clientErrors = collectErrors(values, today);
  const errorFor = (field: Field) => (touched[field] ? (serverErrors[field] ?? clientErrors[field]) : undefined);

  const update =
    (field: keyof Values) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      const target = event.target;
      const value = field === 'consent' && target instanceof HTMLInputElement ? target.checked : target.value;
      setValues((current) => ({ ...current, [field]: value }));
      if (field !== 'website' && serverErrors[field]) {
        setServerErrors((current) => {
          const next = { ...current };
          delete next[field];
          return next;
        });
      }
      // Checkbox & Auswahl sofort prüfen, Textfelder beim Verlassen
      if (field === 'consent' || field === 'service') setTouched((current) => ({ ...current, [field]: true }));
    };

  const blur = (field: Field) => () => setTouched((current) => ({ ...current, [field]: true }));

  const focusField = (field: Field) => document.getElementById(id(field))?.focus();

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.kind === 'submitting') return;

    setTouched(Object.fromEntries(FIELDS.map((field) => [field, true])));
    const errors = collectErrors(values, today || todayIso());
    const firstInvalid = FIELDS.find((field) => errors[field]);
    if (firstInvalid) {
      setSummary(f.errors.invalid);
      focusField(firstInvalid);
      return;
    }

    setSummary('');
    setStatus({ kind: 'submitting' });
    try {
      const result = await submitInquiry(toInput(values));
      if (result.ok) {
        setStatus({ kind: 'success' });
        return;
      }
      if (result.error === 'validation_error' && result.fieldErrors) {
        const mapped: Errors = {};
        for (const field of FIELDS) {
          const message = result.fieldErrors[field]?.[0];
          if (message) mapped[field] = message;
        }
        setServerErrors(mapped);
        setStatus({ kind: 'idle' });
        setSummary(f.errors.invalid);
        const first = FIELDS.find((field) => mapped[field]);
        if (first) focusField(first);
        return;
      }
      setStatus({ kind: 'error', reason: result.error === 'rate_limited' ? 'rateLimited' : 'server' });
    } catch (error) {
      setStatus({ kind: 'error', reason: isApiRequestError(error) ? 'network' : 'server' });
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setTouched({});
    setServerErrors({});
    setSummary('');
    setStatus({ kind: 'idle' });
  };

  const submitting = status.kind === 'submitting';
  const failure =
    status.kind === 'error'
      ? status.reason === 'network'
        ? f.errors.network
        : status.reason === 'rateLimited'
          ? f.errors.rateLimited
          : f.error
      : null;

  return (
    <div className="relative">
      <p role="status" aria-live="polite" className="sr-only">
        {submitting ? f.submitting : summary}
      </p>

      <AnimatePresence mode="wait" initial={false}>
        {status.kind === 'success' ? (
          <motion.div
            key="success"
            className="flex min-h-[34rem] flex-col items-start justify-center py-6"
            initial={reduce ? { opacity: 0 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
          >
            <span className="grid size-16 place-items-center rounded-full bg-royal/20 ring-1 ring-sky/40">
              <svg viewBox="0 0 24 24" className="size-8 text-sky-300" fill="none" aria-hidden>
                <motion.path
                  d="m5 12.5 4.5 4.5L19 7.5"
                  stroke="currentColor"
                  strokeWidth={1.75}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.9, delay: 0.25, ease: EASE_OUT_EXPO }}
                />
              </svg>
            </span>
            <h3 ref={successRef} tabIndex={-1} className="mt-8 text-display-sm font-medium outline-none">
              {f.success.title}
            </h3>
            <p className="mt-4 max-w-[42ch] leading-relaxed text-fg-muted">{f.success.text}</p>
            <Button variant="secondary" className="mt-10" onClick={reset}>
              {f.success.reset}
            </Button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            noValidate
            onSubmit={onSubmit}
            aria-labelledby={`${uid}-title`}
            initial={false}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 id={`${uid}-title`} className="text-display-sm font-medium">
              {f.title}
            </h3>
            <p className="mt-3 max-w-[48ch] text-[0.9375rem] leading-relaxed text-fg-muted">{f.intro}</p>

            <div className="mt-9 grid gap-x-4 gap-y-5 sm:grid-cols-2">
              <TextField
                id={id('name')}
                name="name"
                label={f.fields.name}
                required
                autoComplete="name"
                value={values.name}
                onChange={update('name')}
                onBlur={blur('name')}
                error={errorFor('name')}
              />
              <TextField
                id={id('email')}
                name="email"
                type="email"
                inputMode="email"
                label={f.fields.email}
                required
                autoComplete="email"
                value={values.email}
                onChange={update('email')}
                onBlur={blur('email')}
                error={errorFor('email')}
              />
              <TextField
                id={id('phone')}
                name="phone"
                type="tel"
                inputMode="tel"
                label={f.fields.phone}
                autoComplete="tel"
                value={values.phone}
                onChange={update('phone')}
                onBlur={blur('phone')}
                error={errorFor('phone')}
              />
              <TextField
                id={id('vehicle')}
                name="vehicle"
                label={f.fields.vehicle}
                value={values.vehicle}
                onChange={update('vehicle')}
                onBlur={blur('vehicle')}
                error={errorFor('vehicle')}
              />
              <SelectField
                id={id('service')}
                name="service"
                label={f.fields.service}
                placeholder={f.fields.servicePlaceholder}
                options={SERVICE_OPTIONS}
                highlightKey={highlightKey}
                value={values.service}
                onChange={update('service')}
                onBlur={blur('service')}
                error={errorFor('service')}
              />
              <DateField
                id={id('preferredDate')}
                name="preferredDate"
                label={f.fields.preferredDate}
                min={today || undefined}
                value={values.preferredDate}
                onChange={update('preferredDate')}
                onBlur={blur('preferredDate')}
                error={errorFor('preferredDate')}
              />
              <TextAreaField
                id={id('message')}
                name="message"
                label={f.fields.message}
                className="sm:col-span-2"
                value={values.message}
                onChange={update('message')}
                onBlur={blur('message')}
                error={errorFor('message')}
              />

              {/* Honeypot – für Menschen unsichtbar, Bots füllen es aus */}
              <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <label htmlFor={id('website')}>{f.fields.website}</label>
                <input
                  id={id('website')}
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.website}
                  onChange={update('website')}
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor={id('consent')} className="flex cursor-pointer items-start gap-3.5 text-sm leading-relaxed text-fg-muted">
                  <span className="relative mt-0.5 grid size-5 shrink-0 place-items-center">
                    <input
                      id={id('consent')}
                      name="consent"
                      type="checkbox"
                      checked={values.consent}
                      onChange={update('consent')}
                      onBlur={blur('consent')}
                      aria-required
                      aria-invalid={errorFor('consent') ? true : undefined}
                      aria-describedby={errorFor('consent') ? errorId(id('consent')) : undefined}
                      className={cn(
                        'peer size-5 cursor-pointer appearance-none rounded-md border bg-white/[0.04] transition-[background-color,border-color,box-shadow] duration-300 ease-out-quint checked:border-royal checked:bg-royal hover:border-white/30 focus-visible:shadow-[0_0_0_4px_rgb(38_171_246/0.18)] focus-visible:outline-none',
                        errorFor('consent') ? 'border-red-400/70' : 'border-line-strong',
                      )}
                    />
                    <Check
                      aria-hidden
                      className="pointer-events-none absolute size-3.5 text-white opacity-0 transition-opacity duration-200 peer-checked:opacity-100"
                    />
                  </span>
                  <span>
                    {f.consent}{' '}
                    <a
                      href={f.consentLink.href}
                      className="text-fg underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-sky"
                    >
                      {f.consentLink.label}
                    </a>
                    .
                    <span aria-hidden className="ml-0.5 text-sky-400">
                      *
                    </span>
                  </span>
                </label>
                <div className="pl-[2.125rem]">
                  <FieldError id={id('consent')}>{errorFor('consent')}</FieldError>
                </div>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {failure ? (
                <motion.div
                  key="failure"
                  role="alert"
                  className="mt-8 overflow-hidden border border-red-400/30 bg-red-500/[0.07]"
                  initial={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
                >
                  <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-medium text-red-100">{failure.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-fg-muted">{failure.text}</p>
                    </div>
                    <a
                      href={primaryPhone.href}
                      className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-white/25 px-4 py-2.5 text-sm font-medium text-fg transition-colors hover:border-white/60 hover:bg-white/[0.04]"
                    >
                      <Phone aria-hidden className="size-4" />
                      {f.errors.call}
                    </a>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <div className="mt-9 flex flex-col gap-5 border-t border-line pt-8 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm leading-relaxed text-fg-subtle sm:max-w-[32ch]">
                {summary ? (
                  <span className="text-red-200">{summary}</span>
                ) : (
                  <>
                    <span aria-hidden className="text-sky-400">
                      *
                    </span>{' '}
                    {f.requiredNote}
                  </>
                )}
              </p>
              <Button
                type="submit"
                size="lg"
                arrow={!submitting}
                aria-busy={submitting || undefined}
                icon={submitting ? <Spinner /> : undefined}
                className={cn('w-full sm:w-auto', submitting && 'cursor-progress')}
              >
                {submitting ? f.submitting : f.submit}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}

function Spinner() {
  return (
    <svg viewBox="0 0 24 24" className="size-full animate-spin" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeOpacity="0.25" strokeWidth="2.5" />
      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}
