import type { ReactNode } from 'react';
import { Reveal, RevealItem } from './Reveal';
import { Emphasis } from './Emphasis';

export interface SectionHeading {
  eyebrow: string;
  title: string;
  intro?: string;
}

interface SectionHeaderProps {
  id: string;
  index: string;
  heading: SectionHeading;
  aside?: ReactNode;
}

/** Numbered section header: "01 / Work", a large serif title, optional intro and right-aligned aside. */
export function SectionHeader({ id, index, heading, aside }: SectionHeaderProps) {
  return (
    <Reveal as="header" className="mb-14 grid gap-6 md:mb-20 md:grid-cols-12 md:items-end">
      <div className="md:col-span-8">
        <RevealItem>
          <p className="t-eyebrow mb-5 flex items-center gap-3">
            <span className="text-accent">{index}</span>
            <span className="h-px w-8 bg-line-strong" aria-hidden="true" />
            {heading.eyebrow}
          </p>
        </RevealItem>
        <RevealItem>
          <h2 id={id} className="t-h2 max-w-[18ch] text-fg">
            <Emphasis text={heading.title} />
          </h2>
        </RevealItem>
        {heading.intro && (
          <RevealItem>
            <p className="t-lead mt-6 max-w-[52ch]">{heading.intro}</p>
          </RevealItem>
        )}
      </div>
      {aside && <RevealItem className="md:col-span-4 md:justify-self-end">{aside}</RevealItem>}
    </Reveal>
  );
}
