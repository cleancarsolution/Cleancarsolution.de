import { isServiceSlug, CONSULTATION_OPTION, type InquiryServiceValue } from '@ccs/shared';
import { scrollToId } from './scroll';

/**
 * Entkoppelte Kommunikation „Leistung anfragen“ → Kontaktformular.
 * Header-Dropdown, Leistungs- und Preis-Sektion rufen `requestService()` auf;
 * das Kontaktformular abonniert via `onServiceRequest()` und wählt die Leistung vor.
 * Zusätzlich wird `?leistung=<slug>` in der URL beim Laden ausgewertet.
 */

export const SERVICE_REQUEST_EVENT = 'ccs:service-request';
export const SERVICE_QUERY_PARAM = 'leistung';

export function requestService(service: InquiryServiceValue): void {
  window.dispatchEvent(new CustomEvent<InquiryServiceValue>(SERVICE_REQUEST_EVENT, { detail: service }));
  scrollToId('kontakt');
}

export function onServiceRequest(handler: (service: InquiryServiceValue) => void): () => void {
  const listener = (event: Event) => handler((event as CustomEvent<InquiryServiceValue>).detail);
  window.addEventListener(SERVICE_REQUEST_EVENT, listener);
  return () => window.removeEventListener(SERVICE_REQUEST_EVENT, listener);
}

export function readServiceFromUrl(): InquiryServiceValue | undefined {
  const value = new URLSearchParams(window.location.search).get(SERVICE_QUERY_PARAM);
  if (value === CONSULTATION_OPTION) return value;
  return isServiceSlug(value) ? value : undefined;
}
