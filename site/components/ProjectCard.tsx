'use client';

import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import Link from 'next/link';

interface ProjectCardProps {
  slug: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  year?: string;
  role?: string;
  index?: number;
}

export function ProjectCard({
  slug,
  title,
  description,
  image,
  tags,
  year,
  role,
  index = 0,
}: ProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { stiffness: 200, damping: 20, mass: 0.5 };
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), springConfig);

  function handleMouseMove(e: React.MouseEvent) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
    setHovered(false);
  }

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ delay: index * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformPerspective: 1000,
      }}
      className="tilt-card relative group px-4 md:px-6"
    >
      <Link href={`/projects/${slug}`} className="block">
        {/* Image area */}
        <div
          className="relative aspect-[4/3] overflow-hidden surface-noise"
          style={{ background: 'var(--bg-surface)' }}
        >
          {/* Large project number */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            <span
              className="text-[8rem] md:text-[10rem] font-bold leading-none select-none transition-all duration-500"
              style={{
                color: hovered ? 'var(--accent)' : 'var(--text-tertiary)',
                opacity: hovered ? 0.2 : 0.07,
                transform: hovered ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              {image}
            </span>
          </div>

          {/* Hover overlay line */}
          <motion.div
            className="absolute bottom-0 left-0 h-[3px]"
            style={{ background: 'var(--accent)' }}
            initial={{ width: 0 }}
            animate={{ width: hovered ? '100%' : 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>

        {/* Content */}
        <div className="pt-5 pb-2">
          {/* Meta row */}
          <div className="flex items-center gap-3 mb-3">
            {year && <span className="label-caps">{year}</span>}
            {year && role && (
              <span style={{ color: 'var(--text-tertiary)' }}>—</span>
            )}
            {role && <span className="label-caps">{role}</span>}
          </div>

          {/* Title */}
          <h3
            className="text-xl md:text-2xl font-bold mb-2 transition-colors duration-300"
            style={{
              fontFamily: 'var(--font-display)',
              letterSpacing: '-0.02em',
              color: hovered ? 'var(--accent)' : 'var(--text-primary)',
            }}
          >
            {title}
          </h3>

          {/* Description */}
          <p
            className="text-sm leading-relaxed mb-4 line-clamp-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-2.5 py-1"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-tertiary)',
                  border: '1px solid var(--border)',
                  letterSpacing: '0.02em',
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

