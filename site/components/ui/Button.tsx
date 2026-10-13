import Link from 'next/link';
import type { ReactNode } from 'react';
import { Magnetic } from './Magnetic';

type Variant = 'primary' | 'ghost';

const base =
  'group relative inline-flex items-center gap-3 rounded-full font-medium transition-[background-color,border-color,color] duration-[var(--dur-base)] ease-[var(--ease-standard)] px-6 py-3.5 text-[0.9375rem] min-h-12';

const variants: Record<Variant, string> = {
  primary: 'bg-accent-solid text-accent-fg hover:brightness-110 shadow-glow',
  ghost: 'border border-line-strong text-fg hover:border-accent hover:text-accent',
};

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: Variant;
  external?: boolean;
  magnetic?: boolean;
  className?: string;
}

export function Arrow({ className = '' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={`size-4 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-out-expo)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
    >
      <path d="M5 15 15 5M7 5h8v8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ButtonLink({ href, children, variant = 'primary', external, magnetic = true, className = '' }: ButtonLinkProps) {
  const cls = `${base} ${variants[variant]} ${className}`;
  const content = (
    <>
      <span>{children}</span>
      <Arrow />
    </>
  );
  const link = external ? (
    <a href={href} className={cls} target="_blank" rel="noopener noreferrer" data-cursor="link">
      {content}
    </a>
  ) : (
    <Link href={href} className={cls} data-cursor="link">
      {content}
    </Link>
  );
  return magnetic ? <Magnetic>{link}</Magnetic> : link;
}
