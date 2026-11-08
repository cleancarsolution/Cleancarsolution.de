'use client';

import { useSyncExternalStore } from 'react';

/*
 * Medien-Präferenzen als externe Stores – ohne Effekt-Flackern.
 * Server-Snapshot: „Bewegung reduzieren“ und Datensparmodus gelten als aktiv → kein Video im HTML.
 */

const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}
const getReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;
const getServerTrue = () => true;

type NavigatorWithConnection = Navigator & { connection?: { saveData?: boolean } };
const subscribeNothing = () => () => {};
const getSaveData = () => Boolean((navigator as NavigatorWithConnection).connection?.saveData);

export interface MediaPreferences {
  /** „Bewegung reduzieren“ ist aktiv. */
  reduceMotion: boolean;
  /** Hintergrundvideos dürfen von selbst laufen (keine reduzierte Bewegung, kein Datensparmodus). */
  autoplay: boolean;
}

export function useMediaPreferences(): MediaPreferences {
  const reduceMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, getServerTrue);
  const saveData = useSyncExternalStore(subscribeNothing, getSaveData, getServerTrue);
  return { reduceMotion, autoplay: !reduceMotion && !saveData };
}
