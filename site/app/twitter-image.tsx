import { ogCard, ogSize } from '@/lib/og/card';
import { hero, person } from '@/content/site';

export const size = ogSize;
export const contentType = 'image/png';
export const alt = `${person.name}: ${person.jobTitle}`;

export default function Image() {
  return ogCard({ eyebrow: person.jobTitle, title: hero.headline.join(' '), footer: person.location });
}
