import Image from 'next/image';
import { ButtonLink } from '@/components/ui/Button';
import { SectionHeader, type SectionHeading } from '@/components/ui/SectionHeader';
import { Reveal, RevealItem } from '@/components/ui/Reveal';

interface AboutTeaserProps {
  heading: SectionHeading & { cta: string };
  body: string;
  principles: { title: string; body: string }[];
  facts: { label: string; value: string }[];
  portrait: { src: string; alt: string };
}

export function AboutTeaser({ heading, body, principles, facts, portrait }: AboutTeaserProps) {
  return (
    <section id="about" aria-labelledby="about-title" className="section scroll-mt-20 border-t border-line">
      <div className="shell">
        <SectionHeader id="about-title" index="04" heading={heading} />

        <div className="grid gap-12 md:grid-cols-12 md:gap-16">
          <Reveal className="md:col-span-4">
            <RevealItem className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface">
              <Image
                src={portrait.src}
                alt={portrait.alt}
                fill
                sizes="(min-width: 768px) 400px, 100vw"
                className="object-cover grayscale-[0.35] transition-[filter] duration-[var(--dur-slower)] hover:grayscale-0"
              />
            </RevealItem>
            <RevealItem as="div" className="mt-6">
              <dl className="grid grid-cols-2 gap-4">
                {facts.map((f) => (
                  <div key={f.label}>
                    <dt className="t-eyebrow mb-1">{f.label}</dt>
                    <dd className="text-small text-fg">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </RevealItem>
          </Reveal>

          <Reveal className="md:col-span-8">
            <RevealItem>
              <p className="font-display text-h3 leading-snug text-fg" style={{ fontVariationSettings: "'opsz' 48" }}>
                {body}
              </p>
            </RevealItem>
            <RevealItem as="ul" className="mt-12 grid gap-8 border-t border-line pt-10 sm:grid-cols-3">
              {principles.map((p) => (
                <li key={p.title}>
                  <h3 className="t-h4 mb-2 text-fg">{p.title}</h3>
                  <p className="text-small text-muted">{p.body}</p>
                </li>
              ))}
            </RevealItem>
            <RevealItem className="mt-12">
              <ButtonLink href="/about" variant="ghost">
                {heading.cta}
              </ButtonLink>
            </RevealItem>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
