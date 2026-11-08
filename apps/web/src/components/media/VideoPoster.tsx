import { getImageProps } from 'next/image';
import { cn } from '@/lib/cn';

export interface ImageAsset {
  src: string;
  width: number;
  height: number;
}

export interface PosterSet {
  /** Erster Frame des Videos (Querformat) – das Video blendet nahtlos darüber. */
  poster: ImageAsset;
  /** Erster Frame des Hochformat-Schnitts. */
  posterPortrait?: ImageAsset;
  /** Standbild für „Bewegung reduzieren“ (Querformat). */
  still?: ImageAsset;
  stillPortrait?: ImageAsset;
}

interface VideoPosterProps extends PosterSet {
  alt: string;
  sizes: string;
  /** Hero: sofort laden (LCP). */
  priority?: boolean;
  className?: string;
}

/** Gleiche Medienabfragen wie die <source>-Elemente der Videos. */
export const PORTRAIT_QUERY = '(max-aspect-ratio: 3/4)';
const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Poster bzw. Standbild unter einem Video als <picture> mit Art Direction:
 * Hochformat/Querformat × erster Frame bzw. Standbild bei „Bewegung reduzieren“.
 * Der Browser lädt genau eine Datei, optimiert über next/image (AVIF/WebP). Füllt den Rahmen (absolut).
 */
export function VideoPoster({ alt, sizes, priority, className, poster, posterPortrait, still, stillPortrait }: VideoPosterProps) {
  const common = { alt: '', sizes, quality: 80 } as const;
  const srcSet = (asset: ImageAsset) => getImageProps({ ...common, ...asset }).props.srcSet;
  const main = getImageProps({
    ...common,
    ...poster,
    ...(priority ? { loading: 'eager', fetchPriority: 'high' } : {}),
  }).props;

  return (
    <picture>
      {stillPortrait ? (
        <source media={`${REDUCED_QUERY} and ${PORTRAIT_QUERY}`} srcSet={srcSet(stillPortrait)} sizes={sizes} />
      ) : null}
      {still ? <source media={REDUCED_QUERY} srcSet={srcSet(still)} sizes={sizes} /> : null}
      {posterPortrait ? <source media={PORTRAIT_QUERY} srcSet={srcSet(posterPortrait)} sizes={sizes} /> : null}
      <img {...main} alt={alt} className={cn('absolute inset-0 size-full object-cover', className)} />
    </picture>
  );
}
