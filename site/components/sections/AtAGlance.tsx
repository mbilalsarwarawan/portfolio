import type { GlanceItem } from '@/content/types';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { SectionHeader, type SectionHeading } from '@/components/ui/SectionHeader';

interface AtAGlanceProps {
  heading: SectionHeading;
  items: GlanceItem[];
}

export function AtAGlance({ heading, items }: AtAGlanceProps) {
  return (
    <section aria-labelledby="glance-title" className="section border-y border-line">
      <div className="shell">
        <SectionHeader id="glance-title" index="01" heading={heading} />
        <Reveal as="dl" className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => (
            <RevealItem key={item.label} className="bg-bg p-6 md:p-8">
              <dt className="t-eyebrow mb-5">{item.label}</dt>
              <dd>
                <p className="t-h4 text-fg">{item.value}</p>
                <p className="mt-3 text-small leading-relaxed text-muted">{item.detail}</p>
              </dd>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
