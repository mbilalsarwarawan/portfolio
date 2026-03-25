'use client';

import { motion } from 'framer-motion';
import { projects } from '@/lib/data';
import { ProjectCard } from '@/components/ProjectCard';

export function ProjectsPageClient() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section className="pt-16 pb-12 md:pt-24 md:pb-16 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="label-caps mb-6">Portfolio</div>
            <h1 className="heading-display text-[clamp(2.5rem,6vw,5rem)] mb-6">
              All Projects
            </h1>
            <p
              className="text-lg max-w-lg leading-relaxed"
              style={{ color: 'var(--text-secondary)' }}
            >
              A collection of work spanning frontend, backend, infrastructure,
              and everything in between.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="section-divider" />
      </div>

      {/* Projects grid */}
      <section className="py-16 md:py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
          {/* Count */}
          <div className="label-caps mb-10">
            {projects.length} Projects
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {projects.map((project, i) => (
              <ProjectCard key={project.slug} {...project} index={i} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
