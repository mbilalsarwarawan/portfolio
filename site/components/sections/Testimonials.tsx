import type { Testimonial } from '@/content/types';
import { SectionHeader, type SectionHeading } from '@/components/ui/SectionHeader';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { Copy } from '@/components/ui/Copy';

interface TestimonialsProps {
  heading: SectionHeading;
  items: Testimonial[];
}

/** Renders nothing when there are no testimonials (placeholders are stripped in production). */
export function Testimonials({ heading, items }: TestimonialsProps) {
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-title" className="section border-t border-line">
      <div className="shell">
        <SectionHeader id="testimonials-title" index="05" heading={heading} />
        <Reveal as="ul" className="grid gap-6 md:grid-cols-2">
          {items.map((t, i) => (
            <RevealItem as="li" key={i}>
              <figure className="flex h-full flex-col justify-between rounded-md border border-line bg-surface/60 p-8 md:p-10">
                <blockquote className="font-display text-h4 leading-snug text-fg" style={{ fontVariationSettings: "'opsz' 36" }}>
                  <span className="text-accent" aria-hidden="true">
                    “
                  </span>
                  <Copy text={t.quote} />
                </blockquote>
                <figcaption className="mt-8 text-small">
                  <span className="block text-fg">
                    <Copy text={t.name} />
                  </span>
                  <span className="text-subtle">
                    <Copy text={t.role} />
                  </span>
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
