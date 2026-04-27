'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

interface ProjectImageSliderProps {
  images: string[];
  title: string;
}

const SWIPE_THRESHOLD = 50;

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0.4,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? '-100%' : '100%',
    opacity: 0.4,
  }),
};

const reducedMotionVariants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0 },
};

const transition = {
  x: { type: 'tween' as const, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  opacity: { duration: 0.4, ease: 'easeInOut' as const },
};

const reducedMotionTransition = {
  opacity: { duration: 0.2 },
};

export function ProjectImageSlider({ images, title }: ProjectImageSliderProps) {
  const [[current, direction], setCurrent] = useState([0, 0]);
  const [isDragging, setIsDragging] = useState(false);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const dragStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const total = images.length;
  const activeImage = images[current];
  const activeImageLoaded = activeImage ? loadedImages[activeImage] : true;

  const paginate = useCallback(
    (dir: number) => {
      setCurrent(([prev]) => {
        const next = (prev + dir + total) % total;
        return [next, dir];
      });
    },
    [total],
  );

  const markImageLoaded = useCallback((src: string) => {
    setLoadedImages((currentState) => (
      currentState[src] ? currentState : { ...currentState, [src]: true }
    ));
  }, []);

  // Keyboard navigation — scoped to component focus
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); paginate(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); paginate(1); }
    };
    el.addEventListener('keydown', handleKey);
    return () => el.removeEventListener('keydown', handleKey);
  }, [paginate]);

  // Touch / pointer drag
  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartX.current = e.clientX;
    setIsDragging(true);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const delta = e.clientX - dragStartX.current;
    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      paginate(delta < 0 ? 1 : -1);
    }
  };

  // Single image — no slider chrome needed
  if (total <= 1) {
    return (
      <div className="relative aspect-video overflow-hidden surface-noise" style={{ background: 'var(--bg-surface)' }}>
        {images[0] ? (
          <>
            {!loadedImages[images[0]] && (
              <div className="absolute inset-0 skeleton-block z-[1]" />
            )}
            <img
              src={images[0]}
              alt={title}
              className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
              style={{ opacity: loadedImages[images[0]] ? 1 : 0 }}
              onLoad={() => markImageLoaded(images[0])}
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="text-[12rem] md:text-[20rem] font-bold leading-none select-none"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)', opacity: 0.08 }}
            >
              {title.charAt(0)}
            </span>
          </div>
        )}
      </div>
    );
  }

  const progressFraction = (current + 1) / total;

  return (
    <div
      className="relative select-none"
      ref={containerRef}
      role="region"
      aria-roledescription="Image slider"
      aria-label={`${title} — ${total} images`}
      tabIndex={0}
    >
      {/* Slide viewport */}
      <div
        className="relative aspect-video overflow-hidden surface-noise cursor-grab active:cursor-grabbing"
        style={{ background: 'var(--bg-surface)', touchAction: 'pan-y pinch-zoom' }}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => setIsDragging(false)}
      >
        {!activeImageLoaded && (
          <div className="absolute inset-0 skeleton-block z-[1]" />
        )}
        <AnimatePresence
          initial={false}
          custom={direction}
          mode="popLayout"
        >
          <motion.img
            key={current}
            src={activeImage}
            alt={`${title} — image ${current + 1} of ${total}`}
            className="absolute inset-0 w-full h-full object-contain transition-opacity duration-500"
            draggable={false}
            custom={direction}
            variants={prefersReducedMotion ? reducedMotionVariants : slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={prefersReducedMotion ? reducedMotionTransition : transition}
            style={{ opacity: activeImageLoaded ? 1 : 0 }}
            onLoad={() => markImageLoaded(activeImage)}
          />
        </AnimatePresence>

        {/* Gradient overlays for nav buttons */}
        <div
          className="absolute inset-y-0 left-0 w-24 pointer-events-none"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.15), transparent)' }}
        />
        <div
          className="absolute inset-y-0 right-0 w-24 pointer-events-none"
          style={{ background: 'linear-gradient(to left, rgba(0,0,0,0.15), transparent)' }}
        />

        {/* Prev / Next arrows */}
        <button
          onClick={() => paginate(-1)}
          aria-label="Previous image"
          className="slider-nav-btn left-4 md:left-6"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
          </svg>
        </button>

        <button
          onClick={() => paginate(1)}
          aria-label="Next image"
          className="slider-nav-btn right-4 md:right-6"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>

      {/* Controls bar */}
      <div className="flex items-center justify-between mt-4 gap-4">
        {/* Counter */}
        <span
          className="label-caps tabular-nums"
          style={{ letterSpacing: '0.2em' }}
        >
          {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </span>

        {/* Dot indicators — padded for 44px touch targets */}
        <div className="flex items-center gap-0.5" role="tablist" aria-label="Slide navigation">
          {images.map((_, idx) => (
            <button
              key={idx}
              role="tab"
              aria-selected={idx === current}
              onClick={() => setCurrent([idx, idx > current ? 1 : -1])}
              aria-label={`Go to image ${idx + 1}`}
              className="slider-dot-target"
            >
              <span
                className="slider-dot"
                data-active={idx === current || undefined}
              />
            </button>
          ))}
        </div>

        {/* Progress bar — uses scaleX for GPU-composited animation */}
        <div
          className="hidden sm:block flex-1 max-w-[120px] h-[2px] overflow-hidden"
          style={{ background: 'var(--border)' }}
        >
          <motion.div
            className="h-full w-full origin-left"
            style={{ background: 'var(--accent)' }}
            animate={{ scaleX: progressFraction }}
            transition={prefersReducedMotion ? { duration: 0 } : { duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>
    </div>
  );
}
