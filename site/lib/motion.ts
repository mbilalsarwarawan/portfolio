/** Motion tokens for Framer Motion, mirroring the CSS custom properties in styles/tokens.css. */
export const duration = { fast: 0.12, base: 0.24, slow: 0.48, slower: 0.9 } as const;

export const ease = {
  outExpo: [0.16, 1, 0.3, 1],
  inOutQuart: [0.76, 0, 0.24, 1],
  standard: [0.2, 0, 0, 1],
} as const;

export const spring = {
  soft: { type: 'spring', stiffness: 150, damping: 18, mass: 0.4 },
  snappy: { type: 'spring', stiffness: 380, damping: 30 },
} as const;
