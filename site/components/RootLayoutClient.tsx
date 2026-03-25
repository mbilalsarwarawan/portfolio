'use client';

import { useEffect, ReactNode, useRef } from 'react';

export function RootLayoutClient({ children }: { children: ReactNode }) {
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Mouse-following dot logic (smooth lerp)
    let rafId: number | null = null;
    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const current = { x: target.x, y: target.y };
    const ease = 0.16;

    function onMove(e: MouseEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      if (!rafId) loop();
    }

    function onTouchMove(e: TouchEvent) {
      if (e.touches && e.touches[0]) {
        target.x = e.touches[0].clientX;
        target.y = e.touches[0].clientY;
        if (!rafId) loop();
      }
    }

    function loop() {
      rafId = requestAnimationFrame(() => {
        // lerp
        current.x += (target.x - current.x) * ease;
        current.y += (target.y - current.y) * ease;

        if (dotRef.current) {
          dotRef.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
        }

        // stop the loop when close enough
        if (Math.abs(target.x - current.x) > 0.1 || Math.abs(target.y - current.y) > 0.1) {
          loop();
        } else {
          rafId = null;
        }
      });
    }

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('touchmove', onTouchMove as EventListener);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Global floating accent dot (hidden on small screens) */}
      <div
        ref={dotRef}
        aria-hidden
        className="fixed w-3 h-3 rounded-full pointer-events-none z-50 hidden lg:block"
        style={{ background: 'var(--accent)', transform: 'translate3d(50%,50%,0)' }}
      />

      {children}
    </>
  );
}
