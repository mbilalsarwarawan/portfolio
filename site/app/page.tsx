'use client';

import { useEffect, useState } from 'react';
import { Hero } from '@/components/Hero';
import { Marquee } from '@/components/Marquee';
import { ProjectCard } from '@/components/ProjectCard';

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  image_url: string | null;
  images: string[];
  tags: string[];
  year: string;
  role: string;
}

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/projects').then((r) => r.json()).then(setProjects);
  }, []);
  return (
    <div>
      <Hero />
      <Marquee />

      {/* Featured Projects */}
      <section className="py-20 md:py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Section header — asymmetric layout */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="label-caps mb-4">Selected Work</div>
              <h2 className="heading-section text-[clamp(2rem,4vw,3.5rem)]">
                Featured Projects
              </h2>
              <div className="heading-accent" aria-hidden="true" />
            </div>
            <a
              href="/projects"
              className="btn-outline text-sm"
            >
              All Projects
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
                />
              </svg>
            </a>
          </div>

          {/* Project grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {projects.slice(0, 3).map((project, i) => (
              <ProjectCard
                key={project.slug}
                slug={project.slug}
                title={project.title}
                description={project.description}
                image={(project.images?.[0] || project.image_url) ?? ''}
                tags={project.tags}
                year={project.year}
                role={project.role}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Separator */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="section-divider" />
      </div>

      {/* What I Do section — editorial style */}
      <section className="py-20 md:py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            {/* Left — heading */}
            <div>
              <div className="label-caps mb-4">What I Do</div>
              <h2 className="heading-section text-[clamp(2rem,4vw,3.5rem)] mb-6">
                End-to-end
                <br />
                development
              </h2>
              <p
                className="text-lg leading-relaxed max-w-md"
                style={{ color: 'var(--text-secondary)' }}
              >
                From concept to deployment — I build and ship full-stack
                web applications and AI-powered solutions. MERN stack,
                Python frameworks, and modern DevOps.
              </p>
            </div>

            {/* Right — services grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px" style={{ background: 'var(--border)' }}>
              {[
                {
                  num: '01',
                  title: 'Frontend',
                  desc: 'React.js, JavaScript, HTML5, CSS3, Tailwind CSS — responsive, fast interfaces.',
                },
                {
                  num: '02',
                  title: 'Backend',
                  desc: 'Node.js, Express.js, Django, FastAPI — scalable APIs and server-side systems.',
                },
                {
                  num: '03',
                  title: 'AI / ML',
                  desc: 'Langchain, OpenAI API, RAG systems, TensorFlow — intelligent applications.',
                },
                {
                  num: '04',
                  title: 'DevOps',
                  desc: 'Docker, Nginx, Linux, Git — containerized deployments and CI/CD workflows.',
                },
              ].map((item) => (
                <div
                  key={item.num}
                  className="p-6 md:p-8 transition-colors duration-300 group cursor-default"
                  style={{ background: 'var(--bg)' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'var(--bg-surface)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'var(--bg)';
                  }}
                >
                  <div
                    className="text-sm font-bold mb-4 transition-colors duration-300"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {item.num}
                  </div>
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ fontFamily: 'var(--font-display)' }}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section
        className="py-20 md:py-32 px-6 md:px-12 lg:px-20 relative bg-accent-gradient-subtle"
      >
        <div className="absolute inset-0" aria-hidden="true" style={{ background: 'rgba(255,255,255,0.06)' }} />
        <div className="max-w-[1400px] mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="heading-section text-[clamp(1.75rem,3.5vw,3rem)] mb-3">
              Have a project in mind?
            </h2>
            <p
              className="text-lg"
              style={{ color: 'var(--text-secondary)' }}
            >
              Let&apos;s talk about how I can help bring it to life.
            </p>
          </div>
          <a href="/contact" className="btn-primary shrink-0">
            Start a Conversation
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25"
              />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
