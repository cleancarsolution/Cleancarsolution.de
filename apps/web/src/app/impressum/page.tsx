import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';

export const metadata: Metadata = {
  title: 'Impressum',
  alternates: { canonical: '/impressum' },
  robots: { index: false },
};

/** TODO(Kunde): Impressum (§ 5 DDG) einfügen – bewusst leer gelassen. */
export default function ImpressumPage() {
  return <LegalPage eyebrow="Rechtliches" title="Impressum" />;
}
