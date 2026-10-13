import type { Project } from '@/lib/content';
import { ButtonLink } from '@/components/ui/Button';
import { SectionHeader, type SectionHeading } from '@/components/ui/SectionHeader';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { FeaturedProject } from '@/components/work/FeaturedProject';
import { ProjectCard } from '@/components/work/ProjectCard';

interface SelectedWorkProps {
  heading: SectionHeading & { moreTitle: string; moreCta: string; empty: string };
  featured: Project[];
  rest: Project[];
}

export function SelectedWork({ heading, featured, rest }: SelectedWorkProps) {
  return (
    <section id="work" aria-labelledby="work-title" className="section scroll-mt-20">
      <div className="shell">
        <SectionHeader id="work-title" index="03" heading={heading} />

        {featured.length === 0 ? (
          <p className="rounded-md border border-dashed border-line-strong p-10 text-center text-muted">{heading.empty}</p>
        ) : (
          <div className="flex flex-col gap-24 md:gap-36">
            {featured.map((p, i) => (
              <FeaturedProject key={p.slug} project={p} index={i} />
            ))}
          </div>
        )}

        {rest.length > 0 && (
          <div className="mt-28 md:mt-40">
            <div className="mb-10 flex flex-wrap items-end justify-between gap-6 border-t border-line pt-8">
              <h3 className="t-h3 text-fg">{heading.moreTitle}</h3>
              <ButtonLink href="/projects" variant="ghost" magnetic={false}>
                {heading.moreCta}
              </ButtonLink>
            </div>
            <Reveal as="ul" className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((p) => (
                <RevealItem as="li" key={p.slug}>
                  <ProjectCard project={p} />
                </RevealItem>
              ))}
            </Reveal>
          </div>
        )}
      </div>
    </section>
  );
}
