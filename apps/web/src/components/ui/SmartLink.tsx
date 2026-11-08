import Link from 'next/link';
import type { AnchorHTMLAttributes } from 'react';

export type SmartLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

/**
 * Ein Link für alles:
 * - Anker (`#id`, `/#id`) → natives <a>; SmoothScroll fängt den Klick ab und scrollt weich
 * - interne Seiten (`/impressum`) → next/link
 * - extern / tel: / mailto: → natives <a> (extern mit target=_blank)
 */
export function SmartLink({ href, children, ...props }: SmartLinkProps) {
  const isHash = href.startsWith('#') || href.startsWith('/#');
  const isExternal = /^https?:\/\//.test(href);
  const isProtocol = /^(tel|mailto):/.test(href);

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }

  if (isHash || isProtocol) {
    return (
      <a href={href} {...props}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} {...props}>
      {children}
    </Link>
  );
}
