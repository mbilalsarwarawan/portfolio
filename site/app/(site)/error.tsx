'use client';

import Link from 'next/link';
import { useEffect } from 'react';

/** Last-resort boundary: data errors already fall back to the snapshot, so this only catches render bugs. */
export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="shell flex min-h-[70svh] flex-col justify-center pt-24">
      <p className="t-mono mb-6 text-accent">Something broke</p>
      <h1 className="t-h2 max-w-[18ch] text-fg">This section failed to load.</h1>
      <div className="mt-10 flex flex-wrap gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <Link href="/" className="btn-outline">
          Go home
        </Link>
      </div>
    </section>
  );
}
