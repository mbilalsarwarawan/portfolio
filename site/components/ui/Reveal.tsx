'use client';

import { motion, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { duration, ease } from '@/lib/motion';

const container: Variants = {
  hidden: {},
  show: (stagger: number) => ({ transition: { staggerChildren: stagger, delayChildren: 0.05 } }),
};

const item: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: duration.slower, ease: ease.outExpo } },
};

type Tag = 'div' | 'section' | 'ul' | 'ol' | 'li' | 'dl' | 'header' | 'article';

interface RevealProps {
  children: ReactNode;
  className?: string;
  as?: Tag;
  stagger?: number;
  /** Fraction of the element that must be visible before revealing. */
  amount?: number;
}

/** Reveals its <RevealItem> children with a stagger once scrolled into view. */
export function Reveal({ children, className, as = 'div', stagger = 0.08, amount = 0.2 }: RevealProps) {
  const Component = motion[as];
  return (
    <Component
      className={className}
      variants={container}
      custom={stagger}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
    >
      {children}
    </Component>
  );
}

export function RevealItem({ children, className, as = 'div' }: { children: ReactNode; className?: string; as?: Tag }) {
  const Component = motion[as];
  return (
    <Component className={className} variants={item}>
      {children}
    </Component>
  );
}
