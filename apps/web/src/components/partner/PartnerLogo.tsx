import Image from 'next/image';
import { partner } from '@/content/partner';
import { cn } from '@/lib/cn';

interface PartnerLogoProps {
  /** Leer lassen, wenn der umgebende Link den Namen schon trägt. */
  alt?: string;
  className?: string;
}

/** Logo der PKW-Schmiede (helle Fassung für dunkle Flächen). Größe über die Höhe steuern, z. B. `h-14`. */
export function PartnerLogo({ alt = partner.name, className }: PartnerLogoProps) {
  return (
    <Image
      src={partner.logo.src}
      alt={alt}
      width={partner.logo.width}
      height={partner.logo.height}
      className={cn('block h-12 w-auto', className)}
    />
  );
}
