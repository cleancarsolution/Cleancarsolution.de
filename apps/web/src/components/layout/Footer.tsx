import Image from 'next/image';
import type { ReactNode } from 'react';
import { formatAddress, primaryPhone, services, site } from '@ccs/shared';
import { logoFiles } from '@/components/brand/logo-files';
import { PartnerEndorsement } from '@/components/partner/PartnerEndorsement';
import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { ArrowUpRight, Instagram, Mail, Phone, TikTok, WhatsApp } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { SmartLink } from '@/components/ui/SmartLink';
import { contact } from '@/content/contact';
import { faq } from '@/content/faq';
import { headerCta, legalNav, mainNav, serviceHref } from '@/content/navigation';
import { cn } from '@/lib/cn';
import { BackToTop } from './footer/BackToTop';
import { LogoFinale } from './footer/LogoFinale';

/** Kurze Beschriftungen, die es nur im Footer gibt – alles andere kommt aus `content/` und `@ccs/shared`. */
const copy = {
  services: 'Leistungen',
  navigation: 'Navigation',
  legal: 'Rechtliches',
  home: 'zum Seitenanfang',
  whatsapp: 'WhatsApp',
  credit: { lead: 'Erstellt mit Next.js & Turbopack von', studio: 'Palmer Digital' },
} as const;

const SOCIAL_ICONS: Record<string, ReactNode> = {
  Instagram: <Instagram className="size-[1.125rem]" />,
  TikTok: <TikTok className="size-4" />,
};

/** WhatsApp an dieselbe Nummer wie „Anrufen“ (wa.me erwartet sie international, ohne „+“). */
const WHATSAPP_HREF = `https://wa.me/${primaryPhone.e164.replace(/^\+/, '')}`;

const headingClass = 'text-eyebrow font-medium text-fg-subtle uppercase font-expanded';

const linkClass =
  'group/link relative inline-flex items-baseline gap-3 py-1.5 text-[0.9375rem] text-fg-muted transition-colors duration-300 ease-out-quint hover:text-fg';

/** Unterstreichung wie in der Header-Navigation: läuft von links ein, nach rechts aus („Lichtkante“). */
function Underlined({ children }: { children: ReactNode }) {
  return (
    <span className="relative">
      {children}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-0.5 h-px origin-right scale-x-0 bg-current transition-transform duration-500 ease-out-expo group-hover/link:origin-left group-hover/link:scale-x-100"
      />
    </span>
  );
}

function QuickAction({
  href,
  icon,
  label,
  detail,
  className,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  detail: string;
  className?: string;
}) {
  return (
    <a
      href={href}
      className={cn(
        'group/qa inline-flex items-center gap-3 rounded-sm text-[0.9375rem] font-medium text-fg-muted transition-colors duration-300 ease-out-quint outline-offset-4 hover:text-fg',
        className,
      )}
    >
      <span
        aria-hidden
        className="grid size-11 place-items-center rounded-full border border-line-strong transition-colors duration-300 ease-out-quint group-hover/qa:border-white/50"
      >
        {icon}
      </span>
      {label}
      <span className="sr-only">: {detail}</span>
    </a>
  );
}

/**
 * Footer (alle Seiten), schwarz – „Unter einem Dach“.
 * Auftakt: Marke mit Claim und die direkten Wege (Termin, Anrufen, Schreiben – auf dem Smartphone WhatsApp statt
 * Schreiben) – leicht gehalten, damit er
 * die Kontakt-Sektion darüber nicht wiederholt, aber auf Seiten ohne sie (Impressum, Datenschutz) trägt.
 * Darunter der Inhouse-Partner als ruhige Empfehlungs-Karte, dann Leistungen, Navigation, Kontakt und Social.
 * Finale: das Logo in voller Breite auf der Bodenlinie, gespiegelt im Boden – Studiolicht gleitet darüber.
 * Zum Schluss Rechtliches, Credit und „Nach oben“.
 */
export function Footer() {
  const year = new Date().getFullYear();
  const [street, city] = formatAddress('\n').split('\n');
  const taglineWords = site.tagline.split(' ');
  const lastWord = taglineWords.pop();

  return (
    <footer className="relative border-t border-line bg-ink-950 pt-20 sm:pt-24 lg:pt-28">
      <Container>
        {/* ── Auftakt: Marke + direkte Wege ─────────────────────────────── */}
        <div className="grid gap-y-12 lg:grid-cols-12 lg:items-end lg:gap-x-8">
          <Reveal className="lg:col-span-7" y={24}>
            <SmartLink href="/#top" aria-label={`${site.name} – ${copy.home}`} className="block w-fit outline-offset-4">
              <Image {...logoFiles.vertical} alt="" sizes="176px" quality={90} className="block h-24 w-auto sm:h-28" />
            </SmartLink>
            <p className="mt-10 text-display-sm font-medium text-balance lg:mt-12">
              {taglineWords.join(' ')} <span className="text-sky-300">{lastWord}</span>
            </p>
            <p className="mt-4 font-mono text-[0.6875rem] tracking-[0.18em] text-fg-subtle uppercase">
              {site.claim} <span className="whitespace-nowrap">· {site.address.city}</span>
            </p>
          </Reveal>

          <Reveal className="lg:col-span-5 lg:justify-self-end" y={24} delay={0.08}>
            <p className={headingClass}>{site.appointmentNote}</p>
            <div className="mt-5 flex flex-col gap-5 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-7">
              <ButtonLink href={headerCta.href} size="lg" arrow className="w-full sm:w-auto">
                {headerCta.label}
              </ButtonLink>
              <div className="flex items-center gap-7">
                <QuickAction
                  href={primaryPhone.href}
                  icon={<Phone className="size-[1.125rem]" />}
                  label={faq.quickContact.phone}
                  detail={primaryPhone.display}
                />
                <QuickAction
                  href={`mailto:${site.email}`}
                  icon={<Mail className="size-[1.125rem]" />}
                  label={faq.quickContact.email}
                  detail={site.email}
                  className="max-sm:hidden"
                />
                <QuickAction
                  href={WHATSAPP_HREF}
                  icon={<WhatsApp className="size-4" />}
                  label={copy.whatsapp}
                  detail={primaryPhone.display}
                  className="sm:hidden"
                />
              </div>
            </div>
          </Reveal>
        </div>

        {/* ── Inhouse-Partner ───────────────────────────────────────────── */}
        <Reveal className="mt-16 lg:mt-24" y={32} amount={0.3}>
          <PartnerEndorsement />
        </Reveal>

        {/* ── Spalten ───────────────────────────────────────────────────── */}
        <div className="mt-16 grid grid-cols-2 gap-x-6 gap-y-12 sm:gap-x-8 lg:mt-24 lg:grid-cols-12">
          <Reveal className="col-span-2 sm:col-span-1 lg:col-span-4" y={20}>
            <nav aria-labelledby="footer-services-title">
              <h2 id="footer-services-title" className={headingClass}>
                {copy.services}
              </h2>
              <ul className="mt-5">
                {services.map((service) => (
                  <li key={service.slug}>
                    <SmartLink href={serviceHref(service.slug)} className={linkClass}>
                      <span
                        aria-hidden
                        className="font-mono text-[0.75rem] text-fg-subtle tabular transition-colors duration-300 group-hover/link:text-sky-400"
                      >
                        {service.index}
                      </span>
                      <Underlined>{service.name}</Underlined>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          <Reveal className="col-span-1 lg:col-span-2" y={20} delay={0.07}>
            <nav aria-label="Seitennavigation">
              <h2 className={headingClass}>
                {copy.navigation}
              </h2>
              <ul className="mt-5">
                {[...mainNav, { label: contact.eyebrow, href: headerCta.href }].map((item) => (
                  <li key={item.href}>
                    <SmartLink href={item.href} className={linkClass}>
                      <Underlined>{item.label}</Underlined>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
          </Reveal>

          {/* Reihenfolge im DOM = sichtbare Reihenfolge (Fokus): mobil Navigation | Social, ab lg Social vor Kontakt */}
          <Reveal className="col-span-1 lg:col-span-3" y={20} delay={0.1}>
            <h2 className={headingClass}>{contact.methods.social}</h2>
            <ul className="mt-6 space-y-4">
              {site.socials.map((social) => (
                // TikTok erst ab Tablet – auf dem Smartphone nicht
                <li key={social.href} className={social.label === 'TikTok' ? 'max-sm:hidden' : undefined}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group/social flex items-center gap-4 rounded-sm outline-offset-4"
                  >
                    <span
                      aria-hidden
                      className="grid size-11 shrink-0 place-items-center rounded-full border border-line-strong text-fg-muted transition-colors duration-300 ease-out-quint group-hover/social:border-white/50 group-hover/social:text-fg"
                    >
                      {SOCIAL_ICONS[social.label]}
                    </span>
                    <span className="flex min-w-0 flex-col leading-snug">
                      <span className="text-[0.9375rem] text-fg">{social.label}</span>
                      {/* Handle nur, wo die Spalte breit genug ist (nicht mobil, nicht bei lg) – vorgelesen wird es immer über sr-only */}
                      <span
                        aria-hidden
                        className="hidden truncate text-[0.8125rem] text-fg-subtle transition-colors duration-300 group-hover/social:text-fg-muted sm:block lg:hidden xl:block"
                      >
                        {social.handle}
                      </span>
                    </span>
                    <span className="sr-only">
                      {social.handle} {contact.form.newTab}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal className="col-span-2 sm:col-span-1 lg:col-span-3" y={20} delay={0.14}>
            <h2 className={headingClass}>{contact.eyebrow}</h2>
            <address className="mt-6 text-[0.9375rem] leading-relaxed text-fg not-italic">
              {street}
              <br />
              {city}
            </address>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group/route mt-2 inline-flex items-center gap-1.5 rounded-sm py-1 text-[0.9375rem] font-medium text-sky-300 transition-colors duration-300 hover:text-sky-200"
            >
              {contact.methods.route}
              <ArrowUpRight
                aria-hidden
                className="size-4 transition-transform duration-300 ease-out-quint group-hover/route:translate-x-0.5 group-hover/route:-translate-y-0.5"
              />
              <span className="sr-only">{contact.form.newTab}</span>
            </a>
            <ul className="mt-5 border-t border-line pt-4">
              {site.phones.map((phone) => (
                <li key={phone.href}>
                  <a href={phone.href} className={cn(linkClass, 'tabular')}>
                    <Underlined>{phone.display}</Underlined>
                    <span className="text-[0.8125rem] text-fg-subtle">{phone.label}</span>
                  </a>
                </li>
              ))}
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  <Underlined>{site.email}</Underlined>
                </a>
              </li>
            </ul>
          </Reveal>
        </div>

        {/* ── Finale: Logo auf der Bodenlinie ──────────────────────────── */}
        <LogoFinale className="mt-20 sm:mt-24 lg:mt-32" />

        {/* ── Rechtliches · Credit · Nach oben ─────────────────────────── */}
        <div className="flex flex-col gap-5 pt-6 pb-8 text-sm text-fg-subtle sm:pt-7 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:pb-10">
          <div className="flex items-center justify-between gap-4 sm:gap-6 lg:order-last lg:justify-end lg:gap-10">
            <nav aria-label={copy.legal}>
              <ul className="flex gap-4 sm:gap-6">
                {legalNav.map((item) => (
                  <li key={item.href}>
                    <SmartLink href={item.href} className={cn(linkClass, 'py-1 text-sm text-fg-subtle')}>
                      <Underlined>{item.label}</Underlined>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>
            <BackToTop />
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-x-8">
            <p>
              © {year} {site.name}
            </p>
            <p>
              {copy.credit.lead} <span className="font-medium whitespace-nowrap text-fg">{copy.credit.studio}</span>
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
