import { site } from '@ccs/shared';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ArrowUpRight, Star } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { RevealText } from '@/components/ui/RevealText';
import { SmartLink } from '@/components/ui/SmartLink';
import { reviews } from '@/content/reviews';
import { cn } from '@/lib/cn';
import { getReviews, type Review } from '@/lib/google-reviews';
import { RatingLights } from './reviews/RatingLights';
import { ReviewSlider } from './reviews/ReviewSlider';

/** Höchstens so viele Rezensionen stehen im Slider unter der Gesamtnote. */
const SHOWN = 10;

/**
 * Sichtbare Folien je Breite: 1 · 2 · 3 · 4 – die angeschnittene nächste zeigt, dass es weitergeht.
 * Passen alle hinein, füllen sie die Breite (`grow`).
 */
const SLIDE = 'w-[86%] sm:w-[46%] lg:w-[31.5%] xl:w-[23.6%]';

/** Längere Rezensionen werden nach so vielen Zeichen gekürzt – ganz lesen auf Google. */
const EXCERPT = 160;

/** Kürzt an einer Wortgrenze und hängt „…“ an. */
function excerpt(text: string): { text: string; cut: boolean } {
  if (text.length <= EXCERPT) return { text, cut: false };
  const end = text.lastIndexOf(' ', EXCERPT);
  return {
    text: `${text.slice(0, end > 0 ? end : EXCERPT).replace(/[\s,;:–-]+$/, '')}…`,
    cut: true,
  };
}

const scoreFormat = new Intl.NumberFormat('de-DE', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const monthFormat = new Intl.DateTimeFormat('de-DE', {
  month: 'long',
  year: 'numeric',
  timeZone: 'Europe/Berlin',
});

/** Gesamtnote groß, darunter die Sterne als Lichtleiste und die Zahl der Rezensionen. */
function Score({ rating, total }: { rating: number; total: number }) {
  const rounded = Math.round(rating * 10) / 10;
  return (
    <>
      <p className="text-display-xl font-medium">
        {scoreFormat.format(rounded)}
        <span className="sr-only"> {reviews.outOf}</span>
      </p>
      <RatingLights rating={rounded} className="mt-5 text-[1.75rem]" />
      <p className="mt-4 text-fg-muted">
        <span className="tabular">{total}</span>{' '}
        {total === 1 ? reviews.total.one : reviews.total.other}
      </p>
    </>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <span aria-hidden className="flex gap-0.5 text-[0.9375rem]">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className={i < value ? 'text-star' : 'text-line-strong'} />
      ))}
    </span>
  );
}

function Quote({ review }: { review: Review }) {
  const { text, cut } = excerpt(review.text);
  return (
    <figure className="flex h-full flex-col">
      <p className="flex items-center gap-3">
        <Stars value={review.rating} />
        <span className="sr-only">
          {review.rating} {reviews.outOf}
        </span>
        {review.createdAt ? (
          <time dateTime={review.createdAt} className="font-mono text-xs text-fg-subtle tabular">
            {monthFormat.format(new Date(review.createdAt))}
          </time>
        ) : null}
      </p>
      <div className="mt-6 flex-1">
        <blockquote>
          <p className="text-[1.0625rem] leading-relaxed whitespace-pre-line text-fg">„{text}“</p>
        </blockquote>
        {cut ? (
          <SmartLink
            href={site.reviews.readUrl}
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-sky-300 transition-colors duration-300 hover:text-sky-100"
          >
            {reviews.more}
            <ArrowUpRight aria-hidden className="size-3.5 shrink-0" />
            <span className="sr-only"> {reviews.newTab}</span>
          </SmartLink>
        ) : null}
      </div>
      <figcaption className="mt-6 text-sm font-medium text-fg-muted">
        {review.author ?? reviews.anonymous}
      </figcaption>
    </figure>
  );
}

/**
 * 07 — KUNDENSTIMMEN. Die Gesamtnote aus dem Google-Profil als Lichtleiste: Die fünf Sterne schalten sich beim
 * Hineinscrollen nacheinander ein wie die LED-Leisten im Studio. Darunter die neuesten Rezensionen im Slider
 * zwischen Haarlinien wie im Einblick, zum Schluss der Pflichthinweis und die Wege zu Google. Ohne Daten nur
 * Überschrift und Links.
 */
export async function Reviews() {
  // Bis die API freigeschaltet ist: von Hand übernommene Rezensionen aus dem Google-Profil
  const summary = (await getReviews(SHOWN)) ?? reviews.preview;
  const hasQuotes = Boolean(summary?.reviews.length);

  return (
    <section
      id="kundenstimmen"
      aria-labelledby="kundenstimmen-title"
      className="relative bg-ink-950 py-24 sm:py-32 lg:py-40"
    >
      <Container>
        <header className="grid grid-cols-12 gap-x-5 lg:gap-x-8">
          <div className="col-span-12 lg:col-span-7">
            <Eyebrow index="07">{reviews.eyebrow}</Eyebrow>
            <h2 id="kundenstimmen-title" className="mt-6 text-display-lg font-medium text-balance">
              <RevealText text={reviews.title} />
            </h2>
          </div>
          {summary ? (
            <Reveal
              className="col-span-12 mt-12 lg:col-span-4 lg:col-start-9 lg:mt-0 lg:self-end"
              delay={0.15}
            >
              <Score rating={summary.rating} total={summary.total} />
            </Reveal>
          ) : null}
        </header>

        {summary && hasQuotes ? (
          <Reveal className="mt-16 lg:mt-24" y={40} amount={0.1}>
            <ReviewSlider label={reviews.slider.label} controls={reviews.slider}>
              {summary.reviews.map((review) => (
                <li
                  key={review.id}
                  className={cn('shrink-0 grow snap-start bg-ink-950 p-6 sm:p-8', SLIDE)}
                >
                  <Quote review={review} />
                </li>
              ))}
            </ReviewSlider>
          </Reveal>
        ) : null}

        {/* Unter dem Slider trennt dessen Fortschrittslinie – sonst eine eigene Haarlinie */}
        <Reveal className={hasQuotes ? 'mt-14' : 'mt-16 lg:mt-20'} amount={0.5}>
          <div
            className={cn(
              'flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between',
              !hasQuotes && 'border-t border-line pt-10',
            )}
          >
            {summary ? (
              <p className="max-w-[64ch] text-sm leading-relaxed text-fg-subtle">
                {reviews.notice}
              </p>
            ) : (
              <p className="max-w-[40ch] text-lead text-fg-muted">{reviews.fallback}</p>
            )}
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <ButtonLink href={site.reviews.readUrl} size="lg" arrow className="w-full sm:w-auto">
                {reviews.read}
                <span className="sr-only"> {reviews.newTab}</span>
              </ButtonLink>
              <ButtonLink
                href={site.reviews.writeUrl}
                variant="secondary"
                size="lg"
                className="w-full sm:w-auto"
              >
                {reviews.write}
                <span className="sr-only"> {reviews.newTab}</span>
              </ButtonLink>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
