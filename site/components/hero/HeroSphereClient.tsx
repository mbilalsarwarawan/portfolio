'use client';

import dynamic from 'next/dynamic';

const HeroSphere = dynamic(() => import('./HeroSphere').then((m) => m.HeroSphere), {
  ssr: false,
  loading: () => null,
});

export function HeroSphereClient() {
  return <HeroSphere />;
}
