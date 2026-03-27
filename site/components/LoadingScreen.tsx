'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

const FULL_TEXT = 'Bilal Awan';
const TYPE_INTERVAL_MS = 90;
const HOLD_AFTER_COMPLETE_MS = 650;

interface LoadingScreenProps {
  onDone: () => void;
}

export function LoadingScreen({ onDone }: LoadingScreenProps) {
  const [displayText, setDisplayText] = useState('');
  const onDoneRef = useRef(onDone);
  onDoneRef.current = onDone;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index += 1;
      setDisplayText(FULL_TEXT.slice(0, index));
      if (index >= FULL_TEXT.length) {
        clearInterval(interval);
        setTimeout(() => {
          onDoneRef.current();
        }, HOLD_AFTER_COMPLETE_MS);
      }
    }, TYPE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      key="loader"
      initial={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: 'var(--bg)' }}
      aria-hidden="true"
    >
      {/* Subtle grid pattern — matches Hero background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(var(--text-primary) 1px, transparent 1px), linear-gradient(90deg, var(--text-primary) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      <div className="relative text-center select-none">
        {/* Small label above — matches Hero label style */}
        <div
          className="label-caps mb-6 opacity-60"
          style={{ letterSpacing: '0.2em' }}
        >
          Portfolio
        </div>

        {/* Typewriter name */}
        <h1
          className="heading-display whitespace-nowrap"
          style={{ fontSize: 'clamp(3rem, 10vw, 7rem)' }}
        >
          {displayText}
          <span className="loader-cursor" aria-hidden="true">|</span>
        </h1>

        {/* Progress bar */}
        <div
          className="mt-8 mx-auto h-px overflow-hidden"
          style={{ background: 'var(--border)', width: 'clamp(200px, 40vw, 400px)' }}
        >
          <motion.div
            className="h-full"
            style={{ background: 'var(--accent)', originX: 0 }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: displayText.length / FULL_TEXT.length }}
            transition={{ duration: TYPE_INTERVAL_MS / 1000, ease: 'linear' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
