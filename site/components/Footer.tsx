'use client';

import Link from 'next/link';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
];

const socialLinks = [
  { href: 'https://github.com', label: 'GitHub' },
  { href: 'https://twitter.com', label: 'Twitter' },
  { href: 'https://linkedin.com', label: 'LinkedIn' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-0" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 lg:px-20">
        {/* Top section */}
        <div className="py-16 md:py-24 grid md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}
            >
              bilal<span style={{ color: 'var(--accent)' }}>.</span>
            </Link>
            <p
              className="text-sm mt-3 max-w-[240px] leading-relaxed"
              style={{ color: 'var(--text-tertiary)' }}
            >
              Building performant, thoughtful web experiences with modern technologies.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div className="label-caps mb-4">Navigation</div>
            <div className="flex flex-col gap-3">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={label}
                  href={href}
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Socials */}
          <div>
            <div className="label-caps mb-4">Connect</div>
            <div className="flex flex-col gap-3">
              {socialLinks.map(({ href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium transition-colors duration-200"
                  style={{ color: 'var(--text-secondary)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="py-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: '1px solid var(--border)' }}
        >
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            &copy; {currentYear} Bilal. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
            Designed &amp; built with intention.
          </p>
        </div>
      </div>
    </footer>
  );
}
