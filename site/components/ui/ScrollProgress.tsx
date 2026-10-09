'use client';

import { motion, useScroll, useSpring } from 'framer-motion';

/** Thin accent bar at the top of the viewport showing page scroll progress (scaleX only). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 h-[2px] origin-left bg-accent"
      style={{ scaleX, zIndex: 'var(--z-progress)' }}
    />
  );
}
