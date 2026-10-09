import { person } from '@/content/site';

/** Canonical origin used for metadata, sitemap and JSON-LD. Set NEXT_PUBLIC_SITE_URL in production. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export function absoluteUrl(path = '/') {
  return `${SITE_URL}${path.startsWith('/') ? path : `/${path}`}`;
}

export function personJsonLd(sameAs: string[], email: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': absoluteUrl('/#person'),
    name: person.fullName,
    alternateName: person.name,
    jobTitle: person.jobTitle,
    url: SITE_URL,
    email: `mailto:${email}`,
    image: absoluteUrl('/profile.png'),
    address: { '@type': 'PostalAddress', addressLocality: 'Lahore', addressCountry: 'PK' },
    worksFor: { '@type': 'Organization', name: person.currentCompany.name, url: person.currentCompany.url },
    alumniOf: { '@type': 'CollegeOrUniversity', name: 'Government College University Lahore' },
    knowsAbout: [
      'Full-stack web development',
      'TypeScript',
      'Vue.js',
      'React',
      'Node.js',
      'Python',
      'Retrieval-augmented generation',
      'LLM integration',
      'Chrome extensions',
      'Browser automation',
    ],
    sameAs,
  };
}
