import Link from 'next/link';
import type { Project } from '@/lib/content';
import { Tilt } from '@/components/ui/Tilt';
import { Arrow } from '@/components/ui/Button';
import { ProjectMedia } from './ProjectMedia';

interface FeaturedProjectProps {
  project: Project;
  index: number;
}

/** Large editorial row for a flagship case study. Image and text alternate sides. */
export function FeaturedProject({ project, index }: FeaturedProjectProps) {
  const href = `/projects/${project.slug}`;
  const flip = index % 2 === 1;
  const number = String(index + 1).padStart(2, '0');

  return (
    <article className="group grid gap-8 md:grid-cols-12 md:items-center md:gap-12" aria-labelledby={`fp-${project.slug}`}>
      <Link
        href={href}
        tabIndex={-1}
        aria-hidden="true"
        data-cursor="view"
        className={`block md:col-span-7 ${flip ? 'md:order-2' : ''}`}
      >
        <Tilt>
          <ProjectMedia
            slug={project.slug}
            cover={project.cover}
            hover={project.gallery[1]}
            title={project.title}
            sizes="(min-width: 1360px) 760px, (min-width: 768px) 58vw, 100vw"
            className="aspect-[16/10] shadow-3"
          />
        </Tilt>
      </Link>

      <div className={`md:col-span-5 ${flip ? 'md:order-1' : ''}`}>
        <div className="mb-5 flex items-center gap-4">
          <span className="t-mono text-accent">{number}</span>
          <span className="h-px w-10 bg-line-strong" aria-hidden="true" />
          <span className="t-eyebrow">{project.kicker}</span>
        </div>
        <h3 id={`fp-${project.slug}`} className="t-h2 mb-5 text-fg">
          <Link href={href} className="transition-colors duration-[var(--dur-base)] hover:text-accent">
            {project.title}
          </Link>
        </h3>
        <p className="mb-6 max-w-[44ch] text-muted">{project.summary}</p>
        <ul className="mb-8 flex flex-wrap gap-2" aria-label="Stack">
          {project.stack.slice(0, 5).map((t) => (
            <li key={t} className="chip">
              {t}
            </li>
          ))}
        </ul>
        <Link href={href} className="group/link inline-flex items-center gap-2 text-small font-medium text-fg">
          <span className="border-b border-accent pb-0.5">Read the case study</span>
          <Arrow />
          <span className="sr-only">: {project.title}</span>
        </Link>
      </div>
    </article>
  );
}
