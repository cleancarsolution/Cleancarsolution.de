import { site } from '@ccs/shared';
import { Container } from '@/components/ui/Container';
import { Eyebrow } from '@/components/ui/Eyebrow';
import { about } from '@/content/about';
import { Brands } from './about/Brands';
import { Facts } from './about/Facts';
import { Pillars } from './about/Pillars';
import { Statement } from './about/Statement';
import { StudioBand } from './about/StudioBand';

/**
 * Über uns (#ueber-uns) – editorialer Auftakt:
 * Statement, das beim Scrollen Wort für Wort ausgeleuchtet wird → Claim als drei Säulen
 * → cinematisches Filmband (Studio-Video) → Datenblatt-Zeile → Produktmarken.
 */
export function About() {
  return (
    <section
      id="ueber-uns"
      aria-labelledby="ueber-uns-title"
      className="relative overflow-x-clip bg-ink-950 py-24 sm:py-32 lg:py-40"
    >
      <Container>
        <div className="grid gap-y-10 lg:grid-cols-12 lg:gap-x-8">
          <div className="lg:col-span-3">
            <h2 id="ueber-uns-title">
              <Eyebrow as="span" index="01">
                {about.eyebrow}
              </Eyebrow>
            </h2>
            <p className="mt-7 hidden font-mono text-[0.6875rem] leading-relaxed tracking-[0.14em] text-fg-subtle uppercase lg:block">
              {site.claim}
              <br />
              {site.address.city}
            </p>
          </div>

          <Statement
            text={about.statement}
            glow={about.statementGlow}
            highlight={about.statementHighlight}
            className="text-[1.75rem] leading-[1.16] font-medium tracking-[-0.03em] text-fg sm:text-display-md sm:leading-[1.1] lg:col-span-9 xl:pr-16"
          />
        </div>

        <Pillars pillars={about.pillars} className="mt-20 sm:mt-24 lg:mt-36" />

        <StudioBand caption={about.filmCaption} className="mt-20 sm:mt-24 lg:mt-32" />

        <Facts facts={about.facts} className="mt-4 sm:mt-6" />

        <Brands label={about.brandsLabel} brands={site.brands} className="mt-10 lg:mt-12" />
      </Container>
    </section>
  );
}
