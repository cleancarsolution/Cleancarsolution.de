import type { ReactNode } from 'react';
import { site } from '@ccs/shared';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { ArrowUpRight, Instagram, TikTok } from '@/components/ui/icons';
import { Reveal } from '@/components/ui/Reveal';
import { RevealText } from '@/components/ui/RevealText';
import { contact } from '@/content/contact';
import { ContactForm } from './contact/ContactForm';

const SOCIAL_ICONS: Record<string, ReactNode> = {
  Instagram: <Instagram className="size-[1.125rem]" />,
  TikTok: <TikTok className="size-4" />,
};

/** „Bereit für Showroom-Glanz?“ → ["Bereit für", "Showroom-Glanz?"] – der Akzent trägt den Verlaufstext. */
function splitAccent(title: string, accent: string): [string, string] {
  const index = title.lastIndexOf(accent);
  if (index <= 0) return [title, ''];
  return [title.slice(0, index).trim(), accent];
}

/**
 * 08 — KONTAKT. Links der direkte Draht wie ein Datenblatt, rechts die Terminanfrage.
 * Licht fällt „motiviert“ von rechts hinter die Formularkarte.
 */
export function Contact() {
  const [lead, accent] = splitAccent(contact.title, contact.titleAccent);

  return (
    <section id="kontakt" aria-labelledby="kontakt-title" className="relative isolate overflow-hidden bg-ink-950 py-24 sm:py-32 lg:py-40">
      <Backdrop />
      <Container>
        <div className="grid gap-y-16 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-5">
            <Eyebrow index="08">{contact.eyebrow}</Eyebrow>
            <h2 id="kontakt-title" className="mt-6 text-display-lg font-medium text-balance">
              <RevealText text={lead} />
              {accent ? (
                <>
                  {' '}
                  <RevealText text={accent} wordClassName="text-wave" delay={0.12} />
                </>
              ) : null}
            </h2>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[44ch] text-lead text-fg-muted lg:mt-8">{contact.text}</p>
            </Reveal>
            <Reveal delay={0.18} className="mt-12 lg:mt-16">
              <Methods />
            </Reveal>
          </div>

          <Reveal className="lg:col-span-7 lg:col-start-6 xl:col-span-6 xl:col-start-7" y={40} amount={0.12}>
            <div className="relative bg-[linear-gradient(200deg,rgb(132_208_250/0.4)_0%,rgb(255_255_255/0.08)_30%,rgb(255_255_255/0.04)_70%,rgb(0_72_206/0.35)_100%)] p-px shadow-[0_60px_120px_-60px_rgb(0_0_0/0.9)]">
              <div className="bg-[linear-gradient(200deg,var(--color-ink-800)_0%,var(--color-ink-900)_55%,var(--color-ink-950)_100%)] p-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.08)] sm:p-10 xl:p-12">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-2 border-b border-line py-5 sm:grid-cols-[8.5rem_1fr] sm:gap-6">
      <dt className="pt-1 text-eyebrow font-medium text-fg-subtle uppercase font-expanded">{label}</dt>
      <dd className="text-fg">{children}</dd>
    </div>
  );
}

function Methods() {
  const m = contact.methods;
  return (
    <div>
      <p className="text-eyebrow font-medium text-sky-400 uppercase font-expanded">{m.title}</p>
      <dl className="mt-4 border-t border-line">
        <Row label={m.phone}>
          <ul className="space-y-1.5">
            {site.phones.map((phone) => (
              <li key={phone.href}>
                <a href={phone.href} className="group inline-flex items-baseline gap-3">
                  <span className="text-lg font-medium tracking-[-0.01em] tabular transition-colors duration-300 group-hover:text-sky-300">
                    {phone.display}
                  </span>
                  <span className="text-xs text-fg-subtle">{phone.label}</span>
                </a>
              </li>
            ))}
          </ul>
        </Row>
        <Row label={m.email}>
          <a href={`mailto:${site.email}`} className="text-lg font-medium tracking-[-0.01em] transition-colors duration-300 hover:text-sky-300">
            {site.email}
          </a>
        </Row>
        <Row label={m.address}>
          <address className="not-italic leading-relaxed">
            {site.address.street}
            <br />
            {site.address.postalCode} {site.address.city}
          </address>
          <a
            href={site.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sky-300 transition-colors hover:text-sky-200"
          >
            {m.route}
            <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            <span className="sr-only">{contact.form.newTab}</span>
          </a>
        </Row>
        <Row label={m.appointment}>
          <p>{site.appointmentNote}</p>
        </Row>
        <Row label={m.social}>
          <ul className="flex gap-3">
            {site.socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.label} ${social.handle} ${contact.form.newTab}`}
                  className="grid size-11 place-items-center rounded-full border border-line-strong text-fg-muted transition-[border-color,color,background-color] duration-300 hover:border-sky/60 hover:bg-sky/[0.06] hover:text-sky-300"
                >
                  {SOCIAL_ICONS[social.label]}
                </a>
              </li>
            ))}
          </ul>
        </Row>
      </dl>
    </div>
  );
}

function Backdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      <div className="absolute inset-x-0 top-0 h-px hairline-wave opacity-40" />
      <div className="absolute top-[12%] -right-[18%] size-[52rem] rounded-full bg-[radial-gradient(closest-side,rgb(0_72_206/0.26),rgb(38_171_246/0.08)_55%,transparent)]" />
      <div className="absolute -bottom-[30%] -left-[20%] size-[40rem] rounded-full bg-[radial-gradient(closest-side,rgb(1_13_97/0.5),transparent)]" />
      <div className="absolute inset-0 bg-grain opacity-[0.05] mix-blend-overlay" />
    </div>
  );
}
