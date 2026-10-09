import Link from 'next/link';
import type { Project } from '@/lib/content';
import { Tilt } from '@/components/ui/Tilt';
import { Arrow } from '@/components/ui/Button';
import { ProjectMedia } from './ProjectMedia';

/** Compact card for the project grid. */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group relative flex h-full flex-col">
      <Tilt max={4}>
        <ProjectMedia
          slug={project.slug}
          cover={project.cover}
          hover={project.gallery[1]}
          title={project.title}
          sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
          className="aspect-[4/3]"
        />
      </Tilt>
      <div className="mt-5 flex items-start justify-between gap-4">
        <div>
          <p className="t-eyebrow mb-2">
            {project.kicker} · {project.year}
          </p>
          <h3 className="t-h4 text-fg">
            <Link href={`/projects/${project.slug}`} data-cursor="view" className="after:absolute after:inset-0 after:content-['']">
              {project.title}
            </Link>
          </h3>
          <p className="mt-2 line-clamp-2 text-small text-muted">{project.summary}</p>
        </div>
        <span className="mt-1 grid size-10 shrink-0 place-items-center rounded-full border border-line text-fg transition-colors duration-[var(--dur-base)] group-hover:border-accent group-hover:bg-accent group-hover:text-accent-fg" aria-hidden="true">
          <Arrow />
        </span>
      </div>
    </article>
  );
}
