'use client';

import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

/**
 * Desktop-only cursor: a small dot that follows the pointer exactly and a ring
 * that trails it and grows over interactive elements. Not rendered on touch
 * devices or when reduced motion is requested.
 */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [state, setState] = useState<'default' | 'link' | 'view' | 'hidden'>('default');
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 500, damping: 40, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 500, damping: 40, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine) and (hover: hover)');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setEnabled(fine.matches && !reduce.matches);
    update();
    fine.addEventListener('change', update);
    reduce.addEventListener('change', update);
    return () => {
      fine.removeEventListener('change', update);
      reduce.removeEventListener('change', update);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;
    const root = document.documentElement;
    root.classList.add('has-cursor');

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const target = (e.target as Element | null)?.closest<HTMLElement>(
        '[data-cursor], a, button, input, textarea, select, [role="button"]',
      );
      if (!target) return setState('default');
      if (target.dataset.cursor === 'view') setState('view');
      else if (target.matches('input, textarea, select')) setState('hidden');
      else setState('link');
    };
    const leave = () => setState('hidden');
    const enter = () => setState('default');

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerleave', leave);
    document.addEventListener('pointerenter', enter);
    return () => {
      root.classList.remove('has-cursor');
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', leave);
      document.removeEventListener('pointerenter', enter);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringScale = state === 'view' ? 2.6 : state === 'link' ? 1.6 : state === 'hidden' ? 0 : 1;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0" style={{ zIndex: 'var(--z-cursor)' }}>
      <motion.div
        className="absolute left-0 top-0 size-1.5 rounded-full bg-accent"
        style={{ x, y, translateX: '-50%', translateY: '-50%' }}
        animate={{ scale: state === 'hidden' || state === 'view' ? 0 : 1 }}
        transition={{ duration: 0.15 }}
      />
      <motion.div
        className="absolute left-0 top-0 grid size-9 place-items-center rounded-full border border-accent/70"
        style={{ x: ringX, y: ringY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          scale: ringScale,
          backgroundColor: state === 'view' ? 'var(--color-accent-solid)' : 'rgba(0,0,0,0)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 26 }}
      >
        <motion.span
          className="font-mono text-[5px] font-semibold uppercase tracking-widest text-accent-fg"
          animate={{ opacity: state === 'view' ? 1 : 0 }}
        >
          View
        </motion.span>
      </motion.div>
    </div>
  );
}
