'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ExperienceListSkeleton } from '@/components/Skeleton';

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
}

export function ExperienceSection() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [experienceLoading, setExperienceLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/experience')
      .then((r) => r.json())
      .then((data: Experience[]) => {
        if (!cancelled) {
          setExperience(data);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setExperience([]);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setExperienceLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-20 md:py-32 px-6 md:px-12 lg:px-20">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-[1fr_2fr] gap-12 md:gap-24">
          <div>
            <div className="label-caps mb-4">Experience</div>
            <h2 className="heading-section text-[clamp(1.75rem,3vw,2.5rem)]">
              Where I&apos;ve worked
            </h2>
          </div>

          <div>
            <div aria-busy={experienceLoading}>
              {experienceLoading ? (
                <ExperienceListSkeleton count={3} />
              ) : (
                experience.map((exp, i) => (
                  <motion.div
                    key={exp.company}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="py-8 group"
                    style={{ borderBottom: '1px solid var(--border)' }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-3">
                      <div>
                        <h3
                          className="text-lg font-bold group-hover:text-[var(--accent)] transition-colors duration-300"
                          style={{ fontFamily: 'var(--font-display)' }}
                        >
                          {exp.role}
                        </h3>
                        <div className="label-caps mt-1">{exp.company}</div>
                      </div>
                      <span
                        className="text-sm font-medium shrink-0"
                        style={{ color: 'var(--text-tertiary)', fontFamily: 'var(--font-display)' }}
                      >
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed max-w-lg" style={{ color: 'var(--text-secondary)' }}>
                      {exp.description}
                    </p>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
