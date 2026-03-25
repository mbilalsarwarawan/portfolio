'use client';

import { motion } from 'framer-motion';

const WORD_VARIANTS: any = {
  hidden: { y: '100%', opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.3 + i * 0.08,
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1] as any,
    },
  }),
};

const FADE_UP: any = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] as any },
  }),
};

function AnimatedWord({ word, index }: { word: string; index: number }) {
  return (
    <span className="inline-block overflow-hidden">
      <motion.span
        className="inline-block"
        variants={WORD_VARIANTS}
        custom={index}
        initial="hidden"
        animate="visible"
      >
        {word}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const headlineWords = ['I', 'build', 'things', 'for', 'the', 'web.'];

  return (
    <section className="relative min-h-[100vh] flex items-end pb-16 md:pb-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Subtle grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.03] dark:opacity-[0.04]"
        style={{
          backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Accent dot */}
      <motion.div
        className="absolute top-[20%] right-[12%] w-3 h-3 rounded-full hidden lg:block"
        style={{ background: 'var(--accent)' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Vertical line accent */}
      <motion.div
        className="absolute top-0 right-[40%] w-px h-[40vh] hidden lg:block"
        style={{ background: 'var(--border)', transformOrigin: 'top' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="max-w-[1400px] mx-auto w-full">
        {/* Top label */}
        <motion.div
          custom={0.1}
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          className="label-caps mb-6 md:mb-8"
        >
          Full-Stack Developer
        </motion.div>

        {/* Main headline — giant, editorial */}
        <h1 className="heading-display text-[clamp(3rem,8vw,8rem)] mb-8 md:mb-12 max-w-[900px]">
          {headlineWords.map((word, i) => (
            <span key={i}>
              <AnimatedWord
                word={word}
                index={i}
              />
              {i < headlineWords.length - 1 && ' '}
            </span>
          ))}
        </h1>

        {/* Subtext + CTA row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 md:gap-16">
          <motion.p
            custom={0.9}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="text-lg md:text-xl max-w-md leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Specializing in high-performance applications, scalable APIs,
            and interfaces that feel fast and look sharp.
          </motion.p>

          <motion.div
            custom={1.1}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="flex gap-4"
          >
            <a href="/projects" className="btn-primary">
              View Work
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
            <a href="/contact" className="btn-outline">
              Contact
            </a>
          </motion.div>
        </div>

        {/* Bottom stats row */}
        <motion.div
          custom={1.4}
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          className="mt-16 md:mt-24 pt-8 flex flex-wrap gap-12 md:gap-20"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          {[
            { value: '6+', label: 'Years Experience' },
            { value: '50+', label: 'Projects Shipped' },
            { value: '30+', label: 'Happy Clients' },
          ].map(({ value, label }) => (
            <div key={label}>
              <div
                className="text-3xl md:text-4xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {value}
              </div>
              <div className="label-caps mt-2">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

