import { services, site } from '@ccs/shared';

/** Strukturierte Daten (schema.org/AutoWash) für Local SEO. */
export function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'AutoWash',
    '@id': `${site.url}/#business`,
    name: site.name,
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    email: site.email,
    telephone: site.phones.map((phone) => phone.e164),
    image: `${site.url}/media/hero-poster.jpg`,
    logo: `${site.url}/brand/logo-color.svg`,
    priceRange: 'ab 89 €',
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressCountry: site.address.country,
    },
    areaServed: { '@type': 'City', name: site.address.city },
    sameAs: site.socials.map((social) => social.href),
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Leistungen',
      itemListElement: services.map((service) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: service.name, description: service.summary },
        ...(service.priceFrom
          ? {
              priceSpecification: {
                '@type': 'PriceSpecification',
                minPrice: service.priceFrom,
                priceCurrency: 'EUR',
              },
            }
          : {}),
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}
