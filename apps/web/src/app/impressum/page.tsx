import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { SmartLink } from '@/components/ui/SmartLink';

export const metadata: Metadata = {
  title: 'Impressum',
  alternates: { canonical: '/impressum' },
  robots: { index: false },
};

/** Impressum – Text vom Kunden (bisherige Seite „Rechtliches“); Anschrift, § 5 DDG und Webdesign aktualisiert. */
export default function ImpressumPage() {
  return (
    <LegalPage eyebrow="Rechtliches" title="Impressum">
      <h2>Angaben gemäß § 5 DDG</h2>
      <p>
        Cleancarsolution
        <br />
        Julia Milena Mertens
        <br />
        Himmelgeister Str. 35
        <br />
        40225 Düsseldorf
      </p>
      <p>
        <strong>Vertreten durch:</strong>
        <br />
        Julia Milena Mertens
      </p>
      <p>
        <strong>Kontakt:</strong>
        <br />
        E-Mail:{' '}
        <SmartLink href="mailto:info@cleancarsolution.de">info@cleancarsolution.de</SmartLink>
        <br />
        Telefon: <SmartLink href="tel:+4917624024079">017624024079</SmartLink>
      </p>

      <h2>Webdesign</h2>
      <p>Webdesign, Webdevelopment, Satz und Layout:</p>
      <p>Palmer Digital</p>
    </LegalPage>
  );
}
