'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';

const navLinks = [
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <nav
      className="sticky top-0 z-50 transition-all duration-500"
      style={{
        background: scrolled ? 'var(--bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
      }}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative group">
          <span
            className="text-lg font-bold tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
          >
            bilal
            <span style={{ color: 'var(--accent)' }}>.</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative text-sm font-medium transition-colors duration-200"
                style={{
                  fontFamily: 'var(--font-display)',
                  color: isActive ? 'var(--accent)' : 'var(--text-secondary)',
                  letterSpacing: '0.01em',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-primary)';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = 'var(--text-secondary)';
                }}
              >
                {label}
                {isActive && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-0 right-0 h-[2px]"
                    style={{ background: 'var(--accent)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <ThemeToggle />
        </div>

        {/* Mobile controls */}
        <div className="md:hidden flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((o) => !o)}
            className="w-10 h-10 flex flex-col items-center justify-center gap-[5px] transition-colors"
            aria-label="Toggle menu"
          >
            <span
              className="block w-5 h-[1.5px] transition-all duration-300"
              style={{
                background: 'var(--text-primary)',
                transform: mobileOpen ? 'rotate(45deg) translate(2.3px, 2.3px)' : 'none',
              }}
            />
            <span
              className="block w-5 h-[1.5px] transition-all duration-300"
              style={{
                background: 'var(--text-primary)',
                opacity: mobileOpen ? 0 : 1,
              }}
            />
            <span
              className="block w-5 h-[1.5px] transition-all duration-300"
              style={{
                background: 'var(--text-primary)',
                transform: mobileOpen ? 'rotate(-45deg) translate(2.3px, -2.3px)' : 'none',
              }}
            />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden overflow-hidden"
            style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}
          >
            <div className="px-6 py-6 flex flex-col gap-5">
              {navLinks.map(({ href, label }, i) => (
                <motion.div
                  key={href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}
                >
                  <Link
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className="text-2xl font-bold transition-colors"
                    style={{
                      fontFamily: 'var(--font-display)',
                      color: pathname === href ? 'var(--accent)' : 'var(--text-primary)',
                    }}
                  >
                    {label}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
