import type { CSSProperties } from 'react';

interface SplitTextProps {
  lines: string[];
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  /** Words (without punctuation) to render in the accent colour. */
  accentWords?: string[];
  as?: 'h1' | 'h2' | 'p';
  id?: string;
}

/**
 * Line-masked word reveal driven by CSS keyframes. It runs on first paint
 * with zero JS, so it never waits for hydration. Reduced motion shows text
 * immediately (see globals.css).
 */
export function SplitText({
  lines,
  className,
  delay = 0.1,
  stagger = 0.055,
  accentWords = [],
  as: Tag = 'h1',
  id,
}: SplitTextProps) {
  let index = 0;
  return (
    <Tag className={className} id={id}>
      {lines.map((line, li) => (
        <span key={li} className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
          {line.split(' ').map((word, wi, arr) => {
            const style = { '--d': `${delay + index++ * stagger}s` } as CSSProperties;
            const accent = accentWords.includes(word.replace(/[^\p{L}\p{N}]/gu, ''));
            return (
              <span key={wi} className="split-word inline-block" style={style}>
                <span className={accent ? 'em-accent' : undefined}>{word}</span>
                {wi < arr.length - 1 ? ' ' : ''}
              </span>
            );
          })}
        </span>
      ))}
    </Tag>
  );
}
