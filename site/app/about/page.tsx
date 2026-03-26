'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { skills, experience } from '@/lib/data';

const FADE_UP = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.7, ease: [0.16, 1, 0.3, 1] as any },
  }),
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      {/* Hero section */}
      <section className="pt-16 pb-20 md:pt-24 md:pb-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto">
        <div className="lg:grid lg:grid-cols-[1fr_auto] lg:gap-12 xl:gap-16 lg:items-end">
          <div>
            <motion.div custom={0} variants={FADE_UP} initial="hidden" animate="visible">
              <div className="label-caps mb-6">About</div>
            </motion.div>

            <motion.h1
              custom={0.1}
              variants={FADE_UP}
              initial="hidden"
              animate="visible"
              className="heading-display text-[clamp(2.5rem,6vw,5rem)] max-w-[800px] mb-10 lg:mb-0"
            >
              I build software that
              <br />
              <span style={{ color: 'var(--accent)' }}>works hard</span> and
              <br />
              looks sharp.
            </motion.h1>
          </div>

          {/* Portrait */}
          <motion.div
            custom={0.2}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="mb-10 lg:mb-0"
          >
            <div className="relative w-[200px] md:w-[240px] xl:w-[280px] aspect-[3/4] overflow-hidden bg-[var(--bg-surface)]">
              <Image
                src="/profile.jpeg"
                alt="Bilal"
                fill
                className="object-cover"
                sizes="(min-width: 1280px) 280px, 240px"
              />
              {/* Cinematic gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
            </div>
          </motion.div>
        </div>

          <motion.div
            custom={0.3}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 gap-12 md:gap-24 max-w-[1000px]"
          >
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              I&apos;m a full-stack developer with 2+ years of experience
              building scalable web applications using MERN stack and Python
              frameworks. I&apos;ve delivered 5+ production-ready applications
              for international clients.
            </p>
            <p className="text-lg leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              I work across the entire stack — from building responsive
              frontends with React to developing robust backend systems with
              Node.js, Django, and FastAPI. I also have hands-on experience
              with AI/ML integration using Langchain, OpenAI, and TensorFlow.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        <div className="section-divider" />
      </div>

      {/* Experience section */}
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
              {experience.map((exp, i) => (
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
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills section */}
      <section className="py-20 md:py-32 px-6 md:px-12 lg:px-20" style={{ background: 'var(--bg-surface)' }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="label-caps mb-4">Skills &amp; Tools</div>
          <h2 className="heading-section text-[clamp(1.75rem,3vw,2.5rem)] mb-16">
            Technologies I use
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16">
            {Object.entries(skills).map(([category, items], ci) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ delay: ci * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div
                  className="text-sm font-bold uppercase tracking-wider mb-5"
                  style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
                >
                  {category}
                </div>
                <div className="space-y-3">
                  {items.map((skill) => (
                    <div
                      key={skill}
                      className="text-sm"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 md:py-32 px-6 md:px-12 lg:px-20">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <div>
            <h2 className="heading-section text-[clamp(1.75rem,3.5vw,3rem)] mb-3">
              Like what you see?
            </h2>
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              I&apos;m always open to new challenges and collaborations.
            </p>
          </div>
          <a href="/contact" className="btn-primary shrink-0">
            Get in Touch
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
            </svg>
          </a>
        </div>
      </section>
    </div>
  );
}
