import type { Metadata } from 'next';
import { Suspense } from 'react';
import { getProjects } from '@/lib/content';
import { ProjectGrid } from '@/components/work/ProjectGrid';
import { ProjectCard } from '@/components/work/ProjectCard';
import { Emphasis } from '@/components/ui/Emphasis';
import { pages, seo } from '@/content/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: seo.projects.title,
  description: seo.projects.description,
  alternates: { canonical: '/projects' },
  openGraph: { title: seo.projects.title, description: seo.projects.description, url: '/projects' },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  // Filter chips: the most-used technologies across all case studies.
  const counts = new Map<string, number>();
  projects.forEach((p) => p.stack.forEach((s) => counts.set(s, (counts.get(s) ?? 0) + 1)));
  const filters = [...counts.entries()]
    .filter(([, n]) => n > 1)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name]) => name);

  return (
    <div className="shell pb-24 pt-36 md:pb-32 md:pt-44">
      <header className="mb-16 max-w-4xl md:mb-20">
        <p className="t-eyebrow fade-up mb-6">{pages.projects.eyebrow}</p>
        <h1 className="t-h1 fade-up text-fg" style={{ ['--d' as string]: '0.08s' }}>
          <Emphasis text={pages.projects.title} />
        </h1>
        <p className="t-lead fade-up mt-6 max-w-[56ch]" style={{ ['--d' as string]: '0.16s' }}>
          {pages.projects.intro}
        </p>
      </header>

      <Suspense
        fallback={
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((p) => (
              <li key={p.slug}>
                <ProjectCard project={p} />
              </li>
            ))}
          </ul>
        }
      >
        <ProjectGrid projects={projects} filters={filters} allLabel={pages.projects.allLabel} emptyLabel={pages.projects.empty} />
      </Suspense>
    </div>
  );
}
