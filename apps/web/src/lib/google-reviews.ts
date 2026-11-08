import { unstable_cache } from 'next/cache';

/**
 * Google-Rezensionen aus dem eigenen Unternehmensprofil – Business Profile API, nur lesend, nur auf dem Server.
 *
 * Abgerufen wird beim Build und danach höchstens alle 6 Stunden (Zwischenspeicher unten, dazu `revalidate` in
 * `app/page.tsx`); Google erlaubt das Zwischenspeichern bis 30 Tage. Besucher haben dabei keinen Kontakt zu
 * Google. Zugang: OAuth-Client aus dem Google-Cloud-Projekt des Kunden und Refresh-Token des Inhaber-Kontos
 * (siehe `.env.example`).
 */

const TOKEN_URL = 'https://oauth2.googleapis.com/token';
const API_URL = 'https://mybusiness.googleapis.com/v4';

/** 6 Stunden – wie `revalidate` in `app/page.tsx` (dort muss die Zahl als Literal stehen). */
const REFRESH_SECONDS = 21600;

const STARS = { ONE: 1, TWO: 2, THREE: 3, FOUR: 4, FIVE: 5 } as const;

/** Markierungen, mit denen Google übersetzte Rezensionen versieht – angezeigt wird der Originaltext. */
const TRANSLATED = /\((?:Translated by Google|Übersetzt von Google|Von Google übersetzt)\)/;
const ORIGINAL = /\(Original\)/;

interface ApiReview {
  reviewId: string;
  reviewer?: { displayName?: string; isAnonymous?: boolean };
  starRating?: keyof typeof STARS | 'STAR_RATING_UNSPECIFIED';
  comment?: string;
  createTime: string;
}

interface ApiReviewList {
  reviews?: ApiReview[];
  averageRating?: number;
  totalReviewCount?: number;
}

export interface Review {
  id: string;
  /** Vorname und Initiale des Nachnamens („Max M.“); `null` bei anonymen Rezensionen. */
  author: string | null;
  /** 1 … 5 Sterne */
  rating: number;
  text: string;
  /** Zeitpunkt der Rezension (ISO 8601) – fehlt bei von Hand übernommenen Rezensionen. */
  createdAt?: string;
}

export interface ReviewSummary {
  /** Durchschnitt aller Rezensionen (1 … 5). */
  rating: number;
  total: number;
  /** Die neuesten Rezensionen mit Text, neueste zuerst. */
  reviews: readonly Review[];
}

/**
 * Gesamtnote und die `count` neuesten Rezensionen mit Text. `null`, solange der Zugang nicht eingerichtet ist
 * (lokal, Preview) oder beim Build ein Fehler auftritt – die Sektion zeigt dann nur die Links zu Google.
 */
export async function getReviews(count: number): Promise<ReviewSummary | null> {
  if (!credentials()) return null;

  try {
    return await cachedReviews(count);
  } catch (error) {
    console.error(`[Google-Rezensionen] ${error instanceof Error ? error.message : String(error)}`);
    // Bei der Neuerzeugung im Betrieb weiterwerfen: Next.js zeigt dann weiter den letzten erfolgreichen Stand
    // und versucht es beim nächsten Aufruf erneut. Beim Build und lokal geht es ohne Rezensionen weiter.
    if (
      process.env.NODE_ENV === 'production' &&
      process.env.NEXT_PHASE !== 'phase-production-build'
    ) {
      throw error;
    }
    return null;
  }
}

/**
 * Zwischengespeichert wird nur das fertige Ergebnis. Die Abrufe darin legt Next.js so nicht einzeln ab – sonst
 * würde ein Build ein abgelaufenes Zugriffstoken (1 Stunde gültig) aus einem früheren Build wiederverwenden.
 * Fehler werden nicht gespeichert.
 */
const cachedReviews = unstable_cache(
  async (count: number): Promise<ReviewSummary | null> => {
    const env = credentials();
    if (!env) return null;
    const token = await accessToken(env);
    const data = await getJson<ApiReviewList>(`${API_URL}/${env.location}/reviews?pageSize=50`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!data.averageRating || !data.totalReviewCount) return null;
    const reviews = (data.reviews ?? [])
      .toSorted((a, b) => Date.parse(b.createTime) - Date.parse(a.createTime))
      .map(toReview)
      .filter((review): review is Review => review !== null);
    return {
      rating: data.averageRating,
      total: data.totalReviewCount,
      reviews: reviews.slice(0, count),
    };
  },
  ['google-reviews', process.env.GOOGLE_BUSINESS_LOCATION ?? ''],
  { revalidate: REFRESH_SECONDS },
);

function credentials() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
  const location = process.env.GOOGLE_BUSINESS_LOCATION;
  if (!clientId || !clientSecret || !refreshToken || !location) return null;
  return { clientId, clientSecret, refreshToken, location };
}

/** Kurzlebiges Zugriffstoken (1 Stunde) aus dem dauerhaften Refresh-Token. */
async function accessToken(env: NonNullable<ReturnType<typeof credentials>>) {
  const { access_token: token } = await getJson<{ access_token?: string }>(TOKEN_URL, {
    method: 'POST',
    body: new URLSearchParams({
      client_id: env.clientId,
      client_secret: env.clientSecret,
      refresh_token: env.refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!token) throw new Error('Google hat kein Zugriffstoken geliefert');
  return token;
}

/** Fehlertexte von Google (z. B. `invalid_grant` bei widerrufenem Zugang) landen gekürzt im Log. */
async function getJson<T>(url: string, init: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    const detail = (await response.text()).slice(0, 300);
    throw new Error(`${new URL(url).pathname}: HTTP ${response.status} ${detail}`);
  }
  return (await response.json()) as T;
}

function toReview(review: ApiReview): Review | null {
  const rating =
    review.starRating && review.starRating !== 'STAR_RATING_UNSPECIFIED'
      ? STARS[review.starRating]
      : 0;
  const text = originalText(review.comment ?? '');
  if (!rating || !text) return null;
  return {
    id: review.reviewId,
    author: shortName(review.reviewer),
    rating,
    text,
    createdAt: review.createTime,
  };
}

/** „(Translated by Google) … (Original) …“ bzw. „… (Translated by Google) …“ → nur der Text des Verfassers. */
function originalText(comment: string): string {
  const original = comment.split(ORIGINAL)[1];
  if (original !== undefined) return original.trim();
  return comment.split(TRANSLATED)[0]?.trim() ?? '';
}

/** „Max Mustermann“ → „Max M.“ – nur so viel vom Namen wie nötig (Datensparsamkeit). */
function shortName(reviewer: ApiReview['reviewer']): string | null {
  if (!reviewer || reviewer.isAnonymous) return null;
  const [first, ...rest] = (reviewer.displayName ?? '').trim().split(/\s+/).filter(Boolean);
  if (!first) return null;
  const initial = Array.from(rest.at(-1) ?? '')[0];
  return initial ? `${first} ${initial.toUpperCase()}.` : first;
}
