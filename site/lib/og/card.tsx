import { ImageResponse } from 'next/og';

export const ogSize = { width: 1200, height: 630 };

/** Shared Open Graph card in the Graphite & Cobalt style. */
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
          background: 'radial-gradient(70% 80% at 85% 15%, rgba(54,87,245,0.55), transparent 70%), #0b0d10',
          color: '#e8ecef',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 26, letterSpacing: 4, textTransform: 'uppercase', color: '#6f8cff', fontFamily: 'monospace' }}>
          {eyebrow}
        </div>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, maxWidth: 1000 }}>{title}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#a3acb6', fontFamily: 'sans-serif' }}>
          <span>{footer}</span>
          <span style={{ color: '#e8ecef' }}>Bilal Awan ●</span>
        </div>
      </div>
    ),
    ogSize,
  );
}
