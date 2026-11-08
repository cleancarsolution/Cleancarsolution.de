import type { InquiryFieldErrors } from './inquiry';

/** Antworten der Formular-Route `POST /api/inquiries` (apps/web) – vom Browser-Client ausgewertet. */
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
