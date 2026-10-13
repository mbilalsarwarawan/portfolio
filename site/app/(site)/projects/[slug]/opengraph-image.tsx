import { ogCard, ogSize } from '@/lib/og/card';
import { getProject } from '@/lib/content';
import { person } from '@/content/site';

export const size = ogSize;
export const contentType = 'image/png';
export const alt = 'Case study';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProject(slug);
  return ogCard({
    eyebrow: project ? `Case study · ${project.kicker}` : 'Case study',
    title: project?.title ?? person.name,
    footer: project?.headline ?? person.jobTitle,
  });
}
