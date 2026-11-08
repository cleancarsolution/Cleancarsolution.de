import { z } from 'zod';
import { serviceSlugs } from './services';

/** Zusätzliche Auswahl im Formular, wenn noch keine konkrete Leistung feststeht. */
export const CONSULTATION_OPTION = 'beratung' as const;

export const inquiryServiceValues = [...serviceSlugs, CONSULTATION_OPTION] as const;
export type InquiryServiceValue = (typeof inquiryServiceValues)[number];

/** Formularfelder liefern leere Strings – die werden zu `undefined` normalisiert. */
const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Bitte maximal ${max} Zeichen.`)
    .optional()
    .transform((value) => (value ? value : undefined));

/**
 * Terminanfrage / Kontaktanfrage.
 * Wird im Frontend (Client-Validierung) und in der Formular-Route (Server-Validierung) identisch verwendet.
 */
export const inquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Bitte geben Sie Ihren Namen an.')
    .max(120, 'Bitte maximal 120 Zeichen.'),
  email: z
    .string()
    .trim()
    .max(200, 'Bitte maximal 200 Zeichen.')
    .pipe(z.email('Bitte geben Sie eine gültige E-Mail-Adresse an.')),
  phone: z
    .string()
    .trim()
    .max(40, 'Bitte maximal 40 Zeichen.')
    .regex(/^[+()\d\s/.-]*$/, 'Bitte geben Sie eine gültige Telefonnummer an.')
    .optional()
    .transform((value) => (value ? value : undefined)),
  vehicle: optionalText(120),
  service: z
    .union([z.enum(inquiryServiceValues), z.literal('')])
    .optional()
    .transform((value) => (value ? value : undefined)),
  preferredDate: z
    .union([z.iso.date('Bitte wählen Sie ein gültiges Datum.'), z.literal('')])
    .optional()
    .transform((value) => (value ? value : undefined)),
  message: optionalText(2000),
  consent: z.literal(true, 'Bitte stimmen Sie der Datenschutzerklärung zu.'),
  /** Honeypot – bleibt für echte Nutzer leer (visuell versteckt). */
  website: z.string().max(500).optional(),
});

/** Rohdaten, wie sie das Formular sendet. */
export type InquiryInput = z.input<typeof inquirySchema>;
/** Normalisierte Daten nach erfolgreicher Validierung. */
export type Inquiry = z.output<typeof inquirySchema>;

export type InquiryField = keyof InquiryInput;
export type InquiryFieldErrors = Partial<Record<InquiryField, string[]>>;

/** Validiert und liefert entweder Daten oder feldbezogene Fehlermeldungen. */
export function validateInquiry(
  input: unknown,
): { success: true; data: Inquiry } | { success: false; fieldErrors: InquiryFieldErrors } {
  const result = inquirySchema.safeParse(input);
  if (result.success) return { success: true, data: result.data };
  const { fieldErrors } = z.flattenError(result.error);
  return { success: false, fieldErrors: fieldErrors as InquiryFieldErrors };
}
