import type { InquiryFieldErrors } from './inquiry';

/** Routen der API (apps/api) – vom Frontend-Client genutzt. */
export const API_ROUTES = {
  health: '/health',
  services: '/v1/services',
  inquiries: '/v1/inquiries',
} as const;

export interface InquirySuccessResponse {
  ok: true;
  id: string;
  receivedAt: string;
}

export type ApiErrorCode =
  | 'validation_error'
  | 'rate_limited'
  | 'bad_request'
  | 'not_found'
  | 'internal_error';

export interface ApiErrorResponse {
  ok: false;
  error: ApiErrorCode;
  message: string;
  fieldErrors?: InquiryFieldErrors;
}

export type InquiryResponse = InquirySuccessResponse | ApiErrorResponse;
