import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ProofStrip } from '@/components/sections/ProofStrip';
import { AtAGlance } from '@/components/sections/AtAGlance';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { Testimonials } from '@/components/sections/Testimonials';
import { Faq } from '@/components/sections/Faq';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { getContact, getProjects, getProofStats, getTestimonials } from '@/lib/content';
import { copy } from '@/lib/copy';
import { contact as contactCopy, faq, glance, hero, person, process, proof, sections, seo, services } from '@/content/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: seo.home.title },
  description: seo.home.description,
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const [projects, proofStats, contact] = await Promise.all([
    getProjects(),
    getProofStats(),
    getContact(),
  ]);

  const featured = projects.filter((p) => p.featured).slice(0, 5);
  const rest = projects.filter((p) => !p.featured);
  const projectTitles = Object.fromEntries(projects.map((p) => [p.slug, p.title]));

  return (
    <>
      <Hero
        eyebrow={hero.eyebrow}
        headline={hero.headline}
        valueProp={hero.valueProp}
        primaryCta={hero.primaryCta}
        secondaryCta={hero.secondaryCta}
        availability={person.availability}
        meta={[
          { label: 'Based in', value: person.location },
          { label: 'Works with', value: 'Founders, teams & agencies' },
          { label: 'Builds', value: hero.focus },
        ]}
      />
      <AtAGlance heading={sections.glance} items={glance} />
      <ProofStrip stats={proofStats.stats} companies={proofStats.companies} companiesHeading={proof.companiesHeading} />
      <Services heading={sections.services} services={services} projectTitles={projectTitles} />
      <SelectedWork heading={sections.work} featured={featured} rest={rest} />
      <Testimonials heading={sections.testimonials} items={getTestimonials()} />
      <Process heading={sections.process} steps={process} />
      <Faq heading={sections.faq} items={faq} />
      <ContactCTA
        eyebrow={sections.contact.eyebrow}
        heading={contactCopy.heading}
        body={contactCopy.body}
        responseTime={copy(contactCopy.responseTime)}
        email={contact.email}
        cta={hero.primaryCta}
      />
    </>
  );
}
