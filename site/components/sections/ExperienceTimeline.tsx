import type { Experience } from '@/lib/content';
import { Copy } from '@/components/ui/Copy';
import { Reveal, RevealItem } from '@/components/ui/Reveal';

export function ExperienceTimeline({ items, heading }: { items: Experience[]; heading: string }) {
  return (
    <section aria-labelledby="experience-title" className="section border-t border-line">
      <div className="shell grid gap-10 md:grid-cols-12">
        <h2 id="experience-title" className="t-h3 text-fg md:col-span-4">
          {heading}
        </h2>
        <Reveal as="ol" className="md:col-span-8">
          {items.map((e) => (
            <RevealItem as="li" key={`${e.company}-${e.period}`} className="grid gap-2 border-t border-line py-8 sm:grid-cols-[180px_1fr] sm:gap-8">
              <p className="t-mono text-subtle">{e.period}</p>
              <div>
                <h3 className="t-h4 text-fg">
                  {e.company}
                  <span className="text-muted"> · {e.role}</span>
                </h3>
                <p className="mt-2 text-muted">
                  <Copy text={e.summary} />
                </p>
              </div>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
