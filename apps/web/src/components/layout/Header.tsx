import { getImageProps } from 'next/image';
import { logoFiles } from '@/components/brand/logo-files';
import { HeaderRoot } from './header/HeaderRoot';

/**
 * Header (alle Seiten): Logo · Navigation mit Mega-Dropdown „Leistungen“ · Telefon · Termin-CTA,
 * darunter (< lg) das Vollbild-Menü. Interaktion & Scroll-Verhalten in `header/HeaderRoot`.
 * Das Logo steht frei auf dem dunklen Grund (Hell-Fassung) – auf dem Smartphone nur Auto und Wellen,
 * ab sm mit Schriftzug daneben.
 */
export function Header() {
  return <HeaderRoot logo={<HeaderLogo />} />;
}

/** Art Direction per <picture>: Der Browser lädt genau eine der beiden Dateien. */
function HeaderLogo() {
  const common = { alt: '', quality: 90, loading: 'eager' } as const;
  const mark = getImageProps({ ...common, ...logoFiles.mark, sizes: '86px' }).props;
  const wide = getImageProps({ ...common, ...logoFiles.horizontal, sizes: '(min-width: 1280px) 245px, 220px' }).props;

  return (
    <picture>
      <source
        media="(min-width: 640px)"
        srcSet={wide.srcSet}
        sizes={wide.sizes}
        width={logoFiles.horizontal.width}
        height={logoFiles.horizontal.height}
      />
      <img {...mark} alt="" className="block h-8 w-auto sm:h-9 xl:h-10" />
    </picture>
  );
}
