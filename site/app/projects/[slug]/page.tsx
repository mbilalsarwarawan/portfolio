import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ProjectImageSlider } from '@/components/ProjectImageSlider';

interface ProjectPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: project } = await supabase
    .from('projects')
    .select('title, description')
    .eq('slug', slug)
    .single();
  if (!project) return {};
  return {
    title: `${project.title} — Bilal`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (!project) notFound();

  const { data: allProjects } = await supabase
    .from('projects')
    .select('slug, title')
    .order('display_order');

  const projects = allProjects || [];
  const projectIndex = projects.findIndex((p) => p.slug === slug);
  const nextProject = projects[(projectIndex + 1) % projects.length];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-20 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Back link */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm font-medium mb-12 transition-colors duration-200 hover:opacity-70"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-tertiary)' }}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
            </svg>
            Back to Projects
          </Link>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="label-caps">{project.year}</span>
            <span style={{ color: 'var(--text-tertiary)' }}>—</span>
            <span className="label-caps">{project.role}</span>
          </div>

          {/* Title */}
          <h1 className="heading-display text-[clamp(2.5rem,6vw,5rem)] mb-8 max-w-[800px]">
            {project.title}
          </h1>

          {/* Description */}
          <p
            className="text-xl md:text-2xl leading-relaxed max-w-2xl mb-10"
            style={{ color: 'var(--text-secondary)' }}
          >
            {project.description}
          </p>

          {/* Links */}
          <div className="flex gap-4">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Live Site
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
                </svg>
              </a>
            )}
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                Source Code
              </a>
            )}
          </div>
        </div>
      </section>

      {/* Image slider */}
      {(() => {
        const allImages: string[] = Array.isArray(project.images) && project.images.length > 0
          ? project.images
          : project.image_url?.startsWith('http') ? [project.image_url] : [];

        return (
          <section className="px-6 md:px-12 lg:px-20 mb-20">
            <div className="max-w-[1400px] mx-auto">
              <ProjectImageSlider images={allImages} title={project.title} />
            </div>
          </section>
        );
      })()}

      {/* Project details */}
      <section className="px-6 md:px-12 lg:px-20 pb-20 md:pb-32">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
            {/* Sidebar details */}
            <div className="space-y-8">
              <div>
                <div className="label-caps mb-3">Role</div>
                <div className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                  {project.role}
                </div>
              </div>
              <div>
                <div className="label-caps mb-3">Year</div>
                <div className="text-sm font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                  {project.year}
                </div>
              </div>
              <div>
                <div className="label-caps mb-3">Stack</div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs font-medium px-2.5 py-1"
                      style={{
                        fontFamily: 'var(--font-display)',
                        color: 'var(--text-tertiary)',
                        border: '1px solid var(--border)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Content */}
            <div>
              <p
                className="text-lg leading-[1.8] mb-8"
                style={{ color: 'var(--text-secondary)' }}
              >
                {project.content}
              </p>
              <p
                className="text-lg leading-[1.8]"
                style={{ color: 'var(--text-secondary)' }}
              >
                This project demonstrates my ability to architect complex
                systems that balance performance with developer experience,
                delivering solutions that are production-ready from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Next project */}
      <section style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-20 md:py-32">
          <div className="label-caps mb-6">Next Project</div>
          <Link
            href={`/projects/${nextProject.slug}`}
            className="group block"
          >
            <h2 className="heading-display text-[clamp(2rem,5vw,4rem)] group-hover:text-[var(--accent)] transition-colors duration-300">
              {nextProject.title}
              <svg
                className="inline-block w-8 h-8 md:w-12 md:h-12 ml-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
              </svg>
            </h2>
          </Link>
        </div>
      </section>
    </div>
  );
}

