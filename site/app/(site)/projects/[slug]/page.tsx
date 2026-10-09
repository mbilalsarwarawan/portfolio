import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAdjacentProject, getProject, getProjects } from '@/lib/content';
import { absoluteUrl } from '@/lib/site';
import { ProjectMedia } from '@/components/work/ProjectMedia';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { Arrow, ButtonLink } from '@/components/ui/Button';
import { Copy } from '@/components/ui/Copy';
import { hero, pages, person } from '@/content/site';

export const revalidate = 3600;
export const dynamicParams = true;

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) return { title: 'Not found' };
  const title = `${project.title}: ${project.kicker}`;
  return {
    title,
    description: project.seoDescription,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { type: 'article', title, description: project.seoDescription, url: `/projects/${slug}` },
    twitter: { card: 'summary_large_image', title, description: project.seoDescription },
  };
}

const L = pages.caseStudy;

function Block({ index, title, children }: { index: string; title: string; children: React.ReactNode }) {
  return (
    <Reveal as="section" className="grid gap-6 border-t border-line py-14 md:grid-cols-12 md:gap-10 md:py-20">
      <RevealItem className="md:col-span-4">
        <p className="t-eyebrow flex items-center gap-3">
          <span className="text-accent">{index}</span>
          {title}
        </p>
      </RevealItem>
      <RevealItem className="md:col-span-8">{children}</RevealItem>
    </Reveal>
  );
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const [project, next] = await Promise.all([getProject(slug), getAdjacentProject(slug)]);
  if (!project) notFound();

  const host = project.liveUrl ? new URL(project.liveUrl).hostname.replace(/^www\./, '') : null;
  const isWebStore = host?.includes('chromewebstore');
  const gallery = project.gallery.slice(1);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: project.title,
    headline: project.headline,
    description: project.seoDescription,
    url: absoluteUrl(`/projects/${project.slug}`),
    image: project.cover?.src,
    dateModified: project.updatedAt,
    creator: { '@id': absoluteUrl('/#person'), '@type': 'Person', name: person.fullName },
    keywords: project.stack.join(', '),
    ...(project.liveUrl ? { sameAs: project.liveUrl } : {}),
  };

  return (
    <article className="pb-10 pt-32 md:pt-40">
      <header className="shell">
        <Link href="/projects" className="t-mono group mb-10 inline-flex items-center gap-2 text-muted hover:text-fg">
          <span className="transition-transform duration-[var(--dur-base)] group-hover:-translate-x-1" aria-hidden="true">
            ←
          </span>
          {L.back}
        </Link>
        <p className="t-eyebrow fade-up mb-6">{project.kicker}</p>
        <h1 className="t-h1 fade-up max-w-[20ch] text-fg" style={{ ['--d' as string]: '0.06s' }}>
          {project.title}
        </h1>
        <p className="t-lead fade-up mt-6 max-w-[48ch] font-display !text-h3 !leading-snug text-fg/85" style={{ ['--d' as string]: '0.12s', fontVariationSettings: "'opsz' 48, 'SOFT' 50" }}>
          {project.headline}
        </p>

        <dl className="fade-up mt-12 grid grid-cols-2 gap-6 border-t border-line pt-6 md:grid-cols-4" style={{ ['--d' as string]: '0.2s' }}>
          <div>
            <dt className="t-eyebrow mb-1">{L.role}</dt>
            <dd className="text-small text-fg">{project.role}</dd>
          </div>
          <div>
            <dt className="t-eyebrow mb-1">{L.year}</dt>
            <dd className="text-small text-fg">{project.year}</dd>
          </div>
          {host && (
            <div className="col-span-2">
              <dt className="t-eyebrow mb-1">{L.live}</dt>
              <dd className="text-small">
                <a href={project.liveUrl!} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 text-fg underline decoration-line-strong underline-offset-4 hover:decoration-accent">
                  {isWebStore ? 'Chrome Web Store' : host}
                  <Arrow />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </dd>
            </div>
          )}
        </dl>
      </header>

      <div className="shell mt-12 md:mt-16">
        <ProjectMedia
          slug={project.slug}
          cover={project.cover}
          title={project.title}
          priority
          sizes="(min-width: 1360px) 1300px, 100vw"
          className="aspect-[16/9] shadow-3"
        />
      </div>

      <div className="shell mt-10">
        {project.problem && (
          <Block index="01" title={L.problem}>
            <p className="font-display text-h4 leading-relaxed text-fg" style={{ fontVariationSettings: "'opsz' 36" }}>
              {project.problem}
            </p>
          </Block>
        )}

        {project.built.length > 0 && (
          <Block index="02" title={L.built}>
            <ul className="space-y-5">
              {project.built.map((b, i) => (
                <li key={i} className="flex gap-4 text-muted">
                  <span className="mt-[0.7em] h-px w-5 shrink-0 bg-accent" aria-hidden="true" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </Block>
        )}

        {project.decisions.length > 0 && (
          <Block index="03" title={L.how}>
            <ol className="grid gap-px overflow-hidden rounded-md border border-line bg-line">
              {project.decisions.map((d, i) => (
                <li key={d.title} className="bg-bg p-6 md:p-8">
                  <h2 className="t-h4 mb-2 text-fg">
                    <span className="t-mono mr-3 text-accent">{String(i + 1).padStart(2, '0')}</span>
                    {d.title}
                  </h2>
                  <p className="text-muted">{d.body}</p>
                </li>
              ))}
            </ol>
          </Block>
        )}

        {project.result.length > 0 && (
          <Block index="04" title={L.result}>
            <ul className="space-y-4">
              {project.result.map((r, i) => (
                <li key={i} className="font-display text-h4 leading-snug text-fg" style={{ fontVariationSettings: "'opsz' 36" }}>
                  <Copy text={r} />
                </li>
              ))}
            </ul>
          </Block>
        )}

        <Block index="05" title={L.stack}>
          <ul className="flex flex-wrap gap-2">
            {project.stack.map((s) => (
              <li key={s}>
                <Link href={`/projects?stack=${encodeURIComponent(s)}`} className="chip !text-small hover:border-accent hover:text-fg">
                  {s}
                </Link>
              </li>
            ))}
          </ul>
          {(project.liveUrl || project.githubUrl) && (
            <div className="mt-10 flex flex-wrap gap-3">
              {project.liveUrl && (
                <ButtonLink href={project.liveUrl} external>
                  {L.visit}
                </ButtonLink>
              )}
              {project.githubUrl && (
                <ButtonLink href={project.githubUrl} external variant="ghost">
                  {L.source}
                </ButtonLink>
              )}
            </div>
          )}
        </Block>

        {gallery.length > 0 && (
          <section aria-label={L.gallery} className="border-t border-line py-14 md:py-20">
            <p className="t-eyebrow mb-8">{L.gallery}</p>
            <Reveal as="ul" className="grid gap-6 md:grid-cols-2">
              {gallery.map((img, i) => (
                <RevealItem as="li" key={img.src} className={i % 3 === 0 ? 'md:col-span-2' : ''}>
                  <div className="overflow-hidden rounded-md border border-line bg-surface">
                    <Image
                      src={img.src}
                      alt={img.alt}
                      width={img.width}
                      height={img.height}
                      sizes={i % 3 === 0 ? '(min-width: 1360px) 1300px, 100vw' : '(min-width: 768px) 50vw, 100vw'}
                      placeholder={img.blurDataURL ? 'blur' : 'empty'}
                      blurDataURL={img.blurDataURL}
                      className="h-auto w-full"
                    />
                  </div>
                </RevealItem>
              ))}
            </Reveal>
          </section>
        )}
      </div>

      <footer className="shell mt-10 grid gap-6 border-t border-line pt-14 md:grid-cols-2">
        <div className="rounded-md border border-line p-8 md:p-10">
          <p className="t-h3 mb-6 text-fg">{L.ctaTitle}</p>
          <ButtonLink href={hero.primaryCta.href}>{hero.primaryCta.label}</ButtonLink>
        </div>
        {next && (
          <Link href={`/projects/${next.slug}`} className="group relative overflow-hidden rounded-md border border-line p-8 transition-colors hover:border-accent md:p-10" data-cursor="view">
            <p className="t-eyebrow mb-4">{L.next}</p>
            <p className="t-h3 text-fg transition-colors group-hover:text-accent">{next.title}</p>
            <p className="mt-2 text-small text-muted">{next.kicker}</p>
            <Arrow className="absolute right-8 top-8 size-6 text-accent" />
          </Link>
        )}
      </footer>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
