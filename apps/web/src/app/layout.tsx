import type { Metadata, Viewport } from 'next';
import { Geist_Mono, Mona_Sans } from 'next/font/google';
import { site } from '@ccs/shared';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { SmoothScroll } from '@/components/providers/SmoothScroll';
import { JsonLd } from '@/components/seo/JsonLd';
import { cn } from '@/lib/cn';
import 'lenis/dist/lenis.css';
import './globals.css';

/** Mona Sans (variabel: Breite 75–125, Gewicht 200–900) – eine Familie für Headlines, Labels und Text. */
const sans = Mona_Sans({
  subsets: ['latin'],
  axes: ['wdth'],
  variable: '--font-brand-sans',
  display: 'swap',
});

const mono = Geist_Mono({
  subsets: ['latin'],
  variable: '--font-brand-mono',
  display: 'swap',
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
const title = 'Clean Car Solution – Fahrzeugaufbereitung & Autohandwäsche in Düsseldorf';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: title, template: '%s · Clean Car Solution' },
  description: site.description,
  applicationName: site.name,
  keywords: [
    'Fahrzeugaufbereitung Düsseldorf',
    'Autohandwäsche Düsseldorf',
    'Autoaufbereitung',
    'Lederreinigung Auto',
    'Polsterreinigung Auto',
    'Cabrioverdeck imprägnieren',
    'Smart Repair Düsseldorf',
    'Trockendampf Innenraumreinigung',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'de_DE',
    url: '/',
    siteName: site.name,
    title,
    description: site.description,
    images: [{ url: '/media/hero-poster.jpg', width: 1920, height: 1080, alt: 'Clean Car Solution – Handwäsche im Studio' }],
  },
  twitter: { card: 'summary_large_image', title, description: site.description },
  formatDetection: { telephone: false, email: false, address: false },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#03050f',
  colorScheme: 'dark',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={cn(sans.variable, mono.variable)}>
      <body className="min-h-dvh bg-ink-950 font-sans text-fg antialiased">
        <nav aria-label="Sprunglink">
          <a href="#main" className="skip-link">
            Zum Inhalt springen
          </a>
        </nav>
        <noscript>
          <style>{'[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}'}</style>
        </noscript>
        <SmoothScroll />
        <Header />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <Footer />
        <JsonLd />
      </body>
    </html>
  );
}
