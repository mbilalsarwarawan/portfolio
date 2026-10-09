'use client';

import { MotionConfig } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';

/**
 * Global motion setup: Framer respects prefers-reduced-motion, and Lenis
 * smooth scrolling is loaded lazily, only for users who haven't asked for
 * reduced motion.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let destroyed = false;
    let lenis: import('lenis').default | null = null;
    let raf = 0;

    import('lenis').then(({ default: Lenis }) => {
      if (destroyed) return;
      lenis = new Lenis({ lerp: 0.12, anchors: { offset: -80 } });
      const loop = (time: number) => {
        lenis?.raf(time);
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
    });

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
