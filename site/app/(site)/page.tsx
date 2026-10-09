import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { ProofStrip } from '@/components/sections/ProofStrip';
import { StackMarquee } from '@/components/sections/StackMarquee';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { Services } from '@/components/sections/Services';
import { Process } from '@/components/sections/Process';
import { AboutTeaser } from '@/components/sections/AboutTeaser';
import { Testimonials } from '@/components/sections/Testimonials';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { getContact, getProjects, getProofStats, getStackRows, getTestimonials } from '@/lib/content';
import { copy } from '@/lib/copy';
import { about, contact as contactCopy, hero, person, process, proof, sections, seo, services } from '@/content/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: { absolute: seo.home.title },
  description: seo.home.description,
  alternates: { canonical: '/' },
};

export default async function HomePage() {
  const [projects, proofStats, stackRows, contact] = await Promise.all([
    getProjects(),
    getProofStats(),
    getStackRows(),
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
          { label: 'Currently', value: `${person.currentCompany.name} · ${person.currentCompany.country}` },
          { label: 'Based in', value: person.location },
          { label: 'Focus', value: hero.focus },
        ]}
      />
      <ProofStrip stats={proofStats.stats} companies={proofStats.companies} companiesHeading={proof.companiesHeading} />
      <SelectedWork heading={sections.work} featured={featured} rest={rest} />
      <StackMarquee heading={sections.stack.heading} hint={sections.stack.hint} rows={stackRows} />
      <Services heading={sections.services} services={services} projectTitles={projectTitles} />
      <Process heading={sections.process} steps={process} />
      <AboutTeaser
        heading={sections.about}
        body={about.short}
        principles={about.principles}
        portrait={{ src: '/profile.png', alt: `Portrait of ${person.fullName}` }}
        facts={[
          { label: 'Education', value: `${person.education.degree}, ${person.education.school} ’${person.education.year.slice(2)}` },
          { label: 'Time zone', value: 'PKT (UTC+5)' },
        ]}
      />
      <Testimonials heading={sections.testimonials} items={getTestimonials()} />
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
