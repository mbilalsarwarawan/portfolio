'use client';

import { useSyncExternalStore } from 'react';

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  return () => observer.disconnect();
}

const getIsDark = () => document.documentElement.classList.contains('dark');

/** Dark-first theme toggle. The `dark` class is set on <html> before paint by the inline script in app/layout.tsx. */
export function ThemeToggle() {
  const isDark = useSyncExternalStore(subscribe, getIsDark, () => true);

  function toggle() {
    const next = !isDark;
    const apply = () => {
      document.documentElement.classList.toggle('dark', next);
      try {
        localStorage.setItem('theme', next ? 'dark' : 'light');
      } catch {}
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && 'startViewTransition' in document) {
      (document as Document & { startViewTransition: (cb: () => void) => void }).startViewTransition(apply);
    } else {
      apply();
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={!isDark}
      className="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors duration-[var(--dur-base)] hover:border-line-strong hover:text-fg"
    >
      <svg viewBox="0 0 24 24" className="size-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <circle cx="12" cy="12" r="8.25" />
        <path d="M12 3.75a8.25 8.25 0 0 1 0 16.5Z" fill="currentColor" stroke="none" />
      </svg>
    </button>
  );
}
