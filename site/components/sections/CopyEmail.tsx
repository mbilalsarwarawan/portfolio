'use client';

import { useState } from 'react';

/** Copies the email to the clipboard, falling back to a mailto link if the Clipboard API is unavailable. */
export function CopyEmail({ email, className = '' }: { email: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.location.href = `mailto:${email}`;
    }
  }

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex min-h-12 items-center gap-2 rounded-full border border-line-strong px-6 text-[0.9375rem] font-medium text-fg transition-colors duration-[var(--dur-base)] hover:border-accent hover:text-accent ${className}`}
    >
      <svg viewBox="0 0 20 20" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        {copied ? <path d="m4 10.5 4 4 8-9" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M7 7V4.5A1.5 1.5 0 0 1 8.5 3h7A1.5 1.5 0 0 1 17 4.5v7a1.5 1.5 0 0 1-1.5 1.5H13M4.5 7h7A1.5 1.5 0 0 1 13 8.5v7a1.5 1.5 0 0 1-1.5 1.5h-7A1.5 1.5 0 0 1 3 15.5v-7A1.5 1.5 0 0 1 4.5 7Z" />}
      </svg>
      <span aria-live="polite">{copied ? 'Copied' : 'Copy email'}</span>
    </button>
  );
}
