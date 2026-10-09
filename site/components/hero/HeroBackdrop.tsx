'use client';

import dynamic from 'next/dynamic';

const MeshCanvas = dynamic(() => import('./MeshCanvas').then((m) => m.MeshCanvas), { ssr: false });

/** Static gradient that paints immediately, with the WebGL mesh fading in on top once idle. */
export function HeroBackdrop() {
  return (
    <div aria-hidden="true" className="grain pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="mesh-fallback absolute inset-0" />
      <MeshCanvas />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />
    </div>
  );
}
