'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion, useInView, type Variants } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

function CountUp({ to, suffix = '', delay = 0 }: { to: number; suffix?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!inView) return;
    const timer = setTimeout(() => {
      const start = performance.now();
      const duration = 1800;
      const tick = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 4);
        setDisplay(Math.round(eased * to));
        if (t < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, delay * 1000);
    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(rafRef.current);
    };
  }, [inView, to, delay]);

  return <div ref={ref}>{display}{suffix}</div>;
}

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const WORD_VARIANTS: Variants = {
  hidden: { y: '100%', opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      delay: 0.3 + i * 0.08,
      duration: 0.7,
      ease: EASE_OUT,
    },
  }),
};

const FADE_UP: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay, duration: 0.8, ease: EASE_OUT },
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
  const [desktopPortraitLoaded, setDesktopPortraitLoaded] = useState(false);
  const [mobilePortraitLoaded, setMobilePortraitLoaded] = useState(false);

  return (
    <section className="relative min-h-[100vh] flex items-end pb-16 md:pb-24 px-6 md:px-12 lg:px-20 overflow-hidden">
      {/* Grid pattern */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.08] dark:opacity-[0.14]"
        style={{
          backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Accent dot — visible only on lg (xl+ replaced by portrait) */}
      <motion.div
        className="absolute top-[20%] right-[12%] w-3 h-3 rounded-full hidden lg:block xl:hidden"
        style={{ background: 'var(--accent)' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Profile portrait — desktop */}
      <motion.div
        className="absolute top-[16%] right-[5%] 2xl:right-[8%] hidden xl:block z-[1]"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="relative w-[240px] xl:w-[280px] 2xl:w-[320px]">
          {/* Offset accent frame */}
          <div
            className="absolute -bottom-3 -right-3 w-full h-full"
            style={{ border: '1.5px solid var(--accent)' }}
          />
          {/* Image */}
          <div className="relative aspect-[3/4] overflow-hidden bg-[var(--bg-surface)]">
            {!desktopPortraitLoaded && (
              <div className="absolute inset-0 skeleton-block z-[1]" />
            )}
            <Image
              src="/profile.png"
              alt="Bilal — Full-Stack Developer"
              fill
              className={`object-cover transition-opacity duration-500 ${desktopPortraitLoaded ? 'opacity-100' : 'opacity-0'}`}
              sizes="(min-width: 1536px) 320px, 280px"
              priority
              onLoad={() => setDesktopPortraitLoaded(true)}
            />
            {/* Cinematic gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none" />
          </div>
          {/* Accent dot at corner */}
          <motion.div
            className="absolute -top-2 -left-2 w-3 h-3 rounded-full z-10"
            style={{ background: 'var(--accent)' }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 1.5, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* CTA buttons — desktop, centered under portrait */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-row gap-3 mt-8"
        >
          <Link
            href="/projects"
            className="btn-primary flex-1 justify-center text-center min-w-[140px] md:min-w-[180px]"
          >
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
          </Link>
          <Link
            href="/contact"
            className="btn-outline flex-1 justify-center text-center min-w-[140px] md:min-w-[180px]"
          >
            Contact
          </Link>
        </motion.div>
      </motion.div>

      {/* Vertical line accent */}
      <motion.div
        className="absolute top-0 right-[40%] w-px h-[40vh] hidden lg:block"
        style={{ background: 'var(--border)', transformOrigin: 'top' }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 0.5, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      />

      <div className="max-w-[1400px] mx-auto w-full">
        {/* Profile portrait — mobile/tablet */}
        <motion.div
          custom={0.05}
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          className="xl:hidden mb-6 md:mb-8"
        >
          <div
            className="relative w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden bg-[var(--bg-surface)]"
            style={{ border: '2px solid var(--accent)' }}
          >
            {!mobilePortraitLoaded && (
              <div className="absolute inset-0 skeleton-block z-[1]" />
            )}
            <Image
              src="/profile.png"
              alt="Bilal"
              fill
              className={`object-cover transition-opacity duration-500 ${mobilePortraitLoaded ? 'opacity-100' : 'opacity-0'}`}
              sizes="96px"
              onLoad={() => setMobilePortraitLoaded(true)}
            />
          </div>
        </motion.div>

        {/* Top label */}
        <motion.div
          custom={0.1}
          variants={FADE_UP}
          initial="hidden"
          animate="visible"
          className="mb-4 md:mb-5"
        >
          <span
            className="text-sm font-semibold tracking-widest uppercase"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-tertiary)' }}
          >
            Muhammad Bilal Awan
          </span>
        </motion.div>

        {/* Role label */}
        <motion.div
          custom={0.15}
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
            Full-Stack Developer specializing in MERN stack and Python frameworks — building scalable web apps and AI-powered solutions for international clients.
          </motion.p>

          <motion.div
            custom={1.1}
            variants={FADE_UP}
            initial="hidden"
            animate="visible"
            className="flex gap-4 xl:hidden"
          >
            <Link
              href="/projects"
              className="btn-primary flex-1 justify-center text-center min-w-[120px] md:min-w-[160px]"
            >
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
            </Link>
            <Link
              href="/contact"
              className="btn-outline flex-1 justify-center text-center min-w-[120px] md:min-w-[160px]"
            >
              Contact
            </Link>
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
            { to: 2, suffix: '+ yrs', label: 'Experience' },
            { to: 10, suffix: '+', label: 'Projects Shipped' },
            { to: 100, suffix: '%', label: 'Client Satisfaction' },
          ].map(({ to, suffix, label }) => (
            <div key={label}>
              <div
                className="text-3xl md:text-4xl font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                <CountUp to={to} suffix={suffix} delay={2.4} />
              </div>
              <div className="label-caps mt-2">{label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
