import Link from 'next/link';
import type { Service } from '@/content/types';
import { SectionHeader, type SectionHeading } from '@/components/ui/SectionHeader';
import { Reveal, RevealItem } from '@/components/ui/Reveal';

interface ServicesProps {
  heading: SectionHeading;
  services: Service[];
  /** slug → title, for the "proof" links under each service. */
  projectTitles: Record<string, string>;
}

export function Services({ heading, services, projectTitles }: ServicesProps) {
  return (
    <section id="services" aria-labelledby="services-title" className="section scroll-mt-20 bg-surface/50">
      <div className="shell">
        <SectionHeader id="services-title" index="02" heading={heading} />

        <Reveal as="ol" className="border-t border-line" stagger={0.1}>
          {services.map((s, i) => {
            const proof = s.proof.filter((slug) => projectTitles[slug]);
            return (
              <RevealItem as="li" key={s.id} className="group grid gap-6 border-b border-line py-10 md:grid-cols-12 md:gap-10 md:py-14">
                <span className="t-mono text-subtle md:col-span-1">0{i + 1}</span>
                <div className="md:col-span-5">
                  <h3 className="t-h3 text-fg transition-colors duration-[var(--dur-base)] group-hover:text-accent">{s.title}</h3>
                  <p className="mt-3 font-display text-lead italic text-fg/80" style={{ fontVariationSettings: "'opsz' 36, 'SOFT' 100" }}>
                    {s.outcome}
                  </p>
                </div>
                <div className="md:col-span-6">
                  <p className="text-muted">{s.body}</p>
                  <ul className="mt-6 flex flex-wrap gap-2" aria-label={`${s.title}: deliverables`}>
                    {s.deliverables.map((d) => (
                      <li key={d} className="chip">
                        {d}
                      </li>
                    ))}
                  </ul>
                  {proof.length > 0 && (
                    <p className="mt-6 text-small text-subtle">
                      Proof:{' '}
                      {proof.map((slug, j) => (
                        <span key={slug}>
                          <Link href={`/projects/${slug}`} className="text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent">
                            {projectTitles[slug]}
                          </Link>
                          {j < proof.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </p>
                  )}
                </div>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
