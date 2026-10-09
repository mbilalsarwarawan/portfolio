'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ThemeToggle } from './ThemeToggle';
import { ease } from '@/lib/motion';

export interface NavItem {
  label: string;
  href: string;
  section: string;
}

interface NavbarProps {
  name: string;
  items: NavItem[];
  cta: { label: string; href: string };
}

/** Tracks which home-page section is in view so the nav pill can follow it. */
function useActiveSection(ids: string[], enabled: boolean) {
  const [active, setActive] = useState<string | null>(null);
  useEffect(() => {
    if (!enabled) return;
    const els = ids.map((id) => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] },
    );
    els.forEach((el) => io.observe(el));
    const onTop = () => window.scrollY < 200 && setActive(null);
    window.addEventListener('scroll', onTop, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', onTop);
    };
  }, [ids, enabled]);
  return enabled ? active : null;
}

export function Navbar({ name, items, cta }: NavbarProps) {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const activeSection = useActiveSection(
    items.map((i) => i.section),
    isHome,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  const isActive = (item: NavItem) => {
    if (isHome) return activeSection === item.section;
    if (item.section === 'work') return pathname.startsWith('/projects');
    return pathname.startsWith(item.href);
  };

  return (
    <header
      className="fixed inset-x-0 top-0 transition-[background-color,border-color,backdrop-filter] duration-[var(--dur-slow)]"
      style={{ zIndex: 'var(--z-nav)' }}
      data-scrolled={scrolled || undefined}
    >
      <div
        className={`absolute inset-0 -z-10 border-b transition-[opacity] duration-[var(--dur-slow)] ${
          scrolled ? 'border-line opacity-100' : 'border-transparent opacity-0'
        }`}
        style={{ background: 'color-mix(in srgb, var(--color-bg) 78%, transparent)', backdropFilter: 'blur(14px) saturate(1.4)' }}
        aria-hidden="true"
      />
      <nav aria-label="Primary" className="shell flex h-[72px] items-center justify-between gap-6">
        <Link href="/" className="group flex items-baseline gap-2 text-fg" aria-label={`${name}, home`}>
          <span className="font-display text-[1.375rem] leading-none tracking-tight" style={{ fontVariationSettings: "'opsz' 48, 'SOFT' 50" }}>
            {name}
          </span>
          <span className="size-1.5 translate-y-[-2px] rounded-full bg-accent transition-transform duration-[var(--dur-slow)] group-hover:scale-150" aria-hidden="true" />
        </Link>

        <ul className="hidden items-center gap-1 rounded-full border border-line p-1 md:flex">
          {items.map((item) => {
            const active = isActive(item);
            return (
              <li key={item.href} className="relative">
                {active && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full bg-surface"
                    transition={{ type: 'spring', stiffness: 400, damping: 34 }}
                    aria-hidden="true"
                  />
                )}
                <Link
                  href={item.href}
                  aria-current={active ? (isHome ? 'location' : 'page') : undefined}
                  className={`relative block rounded-full px-4 py-2 text-small transition-colors duration-[var(--dur-base)] ${
                    active ? 'text-fg' : 'text-muted hover:text-fg'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href={cta.href}
            className="hidden min-h-11 items-center rounded-full bg-fg px-5 text-small font-medium text-bg transition-colors duration-[var(--dur-base)] hover:bg-accent hover:text-accent-fg sm:inline-flex"
          >
            {cta.label}
          </Link>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line md:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <span className="relative block h-3 w-5" aria-hidden="true">
              <span className={`absolute left-0 top-0 h-px w-full bg-fg transition-transform duration-[var(--dur-slow)] ${open ? 'translate-y-[5.5px] rotate-45' : ''}`} />
              <span className={`absolute bottom-0 left-0 h-px w-full bg-fg transition-transform duration-[var(--dur-slow)] ${open ? '-translate-y-[5.5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 bottom-0 top-[72px] bg-bg md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ul className="shell flex flex-col gap-2 pt-10">
              {items.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.6, ease: ease.outExpo }}
                >
                  <Link href={item.href} onClick={() => setOpen(false)} className="flex items-baseline justify-between border-b border-line py-4">
                    <span className="t-h2">{item.label}</span>
                    <span className="t-mono text-subtle">0{i + 1}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
            <div className="shell mt-10">
              <Link href={cta.href} onClick={() => setOpen(false)} className="btn-primary w-full justify-center py-4">
                {cta.label}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
