import Link from 'next/link';
import type { CSSProperties } from 'react';

export interface StackItem {
  name: string;
  /** Number of case studies using this tech; 0 renders a plain chip. */
  count: number;
}

interface StackMarqueeProps {
  heading: string;
  hint: string;
  rows: StackItem[][];
}

function Row({ items, reverse, duration }: { items: StackItem[]; reverse?: boolean; duration: number }) {
  const style = { '--marquee-duration': `${duration}s`, '--marquee-direction': reverse ? 'reverse' : 'normal' } as CSSProperties;
  const renderItems = (hidden: boolean) =>
    items.map((item) => {
      const inner = (
        <>
          <span>{item.name}</span>
          {item.count > 0 && (
            <span className="grid min-w-5 place-items-center rounded-full bg-accent-soft px-1.5 text-[0.625rem] text-accent">{item.count}</span>
          )}
        </>
      );
      const cls =
        'chip !text-small !px-5 !py-2.5 transition-[border-color,color,background-color] duration-[var(--dur-base)]';
      return (
        <li key={item.name} className="shrink-0">
          {item.count > 0 && !hidden ? (
            <Link
              href={`/projects?stack=${encodeURIComponent(item.name)}`}
              className={`${cls} hover:border-accent hover:bg-accent-soft hover:text-fg`}
              aria-label={`${item.name}: see ${item.count} project${item.count > 1 ? 's' : ''}`}
            >
              {inner}
            </Link>
          ) : (
            <span className={cls}>{inner}</span>
          )}
        </li>
      );
    });

  return (
    <div className="marquee overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
      <div className="marquee-track gap-3" style={style}>
        <ul className="flex gap-3 pr-3">{renderItems(false)}</ul>
        <ul className="flex gap-3 pr-3" aria-hidden="true">
          {renderItems(true)}
        </ul>
      </div>
    </div>
  );
}

/** Two counter-scrolling rows of tech. Chips backed by case studies link to the filtered project grid. */
export function StackMarquee({ heading, hint, rows }: StackMarqueeProps) {
  return (
    <section aria-labelledby="stack-title" className="py-16 md:py-24">
      <div className="shell mb-8 flex items-end justify-between gap-6">
        <h2 id="stack-title" className="t-eyebrow">
          {heading}
        </h2>
        <p className="hidden text-small text-subtle sm:block">{hint}</p>
      </div>
      <div className="flex flex-col gap-3">
        {rows.map((row, i) => (
          <Row key={i} items={row} reverse={i % 2 === 1} duration={44 + i * 10} />
        ))}
      </div>
    </section>
  );
}
