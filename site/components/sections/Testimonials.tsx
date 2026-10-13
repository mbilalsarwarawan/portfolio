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
        <SectionHeader id="testimonials-title" index="04" heading={heading} />
        <Reveal as="ul" className="grid gap-6 md:grid-cols-2">
          {items.map((t, i) => (
            <RevealItem as="li" key={i}>
              <figure className="flex h-full flex-col justify-between rounded-md border border-line bg-surface/60 p-8 md:p-10">
                <blockquote className="text-h4 font-medium leading-snug tracking-tight text-fg">
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
                  {t.source && (
                    <span className="mt-2 block">
                      {t.href ? (
                        <a href={t.href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">
                          Verified on {t.source}
                        </a>
                      ) : (
                        <span className="text-accent">Verified on {t.source}</span>
                      )}
                    </span>
                  )}
                </figcaption>
              </figure>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
