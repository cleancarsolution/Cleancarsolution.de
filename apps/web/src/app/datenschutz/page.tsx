import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';

export const metadata: Metadata = {
  title: 'Datenschutz',
  alternates: { canonical: '/datenschutz' },
  robots: { index: false },
};

/** TODO(Kunde): Datenschutzerklärung einfügen – bewusst leer gelassen. */
export default function DatenschutzPage() {
  return <LegalPage eyebrow="Rechtliches" title="Datenschutz" />;
}
