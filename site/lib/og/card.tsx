import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card in the Ink & Ember style. */
export function ogCard({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 72,
          background: 'radial-gradient(70% 80% at 85% 15%, rgba(255,91,31,0.45), transparent 70%), #0e0d0c',
          color: '#f2eee8',
          fontFamily: 'Georgia, serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', color: '#ff5b1f', fontFamily: 'monospace' }}>
          {eyebrow}
        </div>
        <div style={{ display: 'flex', fontSize: 76, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#b5ada3', fontFamily: 'sans-serif' }}>
          <span>{footer}</span>
          <span style={{ color: '#f2eee8' }}>Bilal Awan ●</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
