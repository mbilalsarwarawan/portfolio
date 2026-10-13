import type { Metadata } from 'next';
import Image from 'next/image';
import { getExperience, getResumeUrl } from '@/lib/content';
import { ExperienceTimeline } from '@/components/sections/ExperienceTimeline';
import { ContactCTA } from '@/components/sections/ContactCTA';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { ButtonLink } from '@/components/ui/Button';
import { Emphasis } from '@/components/ui/Emphasis';
import { getContact } from '@/lib/content';
import { copy } from '@/lib/copy';
import { about, contact as contactCopy, hero, pages, person, sections, seo, stackGroups } from '@/content/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: seo.about.title,
  description: seo.about.description,
  alternates: { canonical: '/about' },
  openGraph: { title: seo.about.title, description: seo.about.description, url: '/about', type: 'profile' },
};

const P = pages.about;

export default async function AboutPage() {
  const [experience, resumeUrl, contact] = await Promise.all([getExperience(), getResumeUrl(), getContact()]);

  return (
    <>
      <section className="shell grid gap-12 pb-20 pt-36 md:grid-cols-12 md:pb-28 md:pt-44">
        <div className="md:col-span-7">
          <p className="t-eyebrow fade-up mb-6">{P.eyebrow}</p>
          <h1 className="t-h1 fade-up text-fg" style={{ ['--d' as string]: '0.06s' }}>
            <Emphasis text={P.title} />
          </h1>
          <p className="t-lead fade-up mt-8 max-w-[52ch]" style={{ ['--d' as string]: '0.12s' }}>
            {about.short}
          </p>
          {resumeUrl && (
            <div className="fade-up mt-10" style={{ ['--d' as string]: '0.18s' }}>
              <ButtonLink href={resumeUrl} external variant="ghost">
                {P.resume}
              </ButtonLink>
            </div>
          )}
        </div>
        <div className="fade-up md:col-span-4 md:col-start-9" style={{ ['--d' as string]: '0.1s' }}>
          <div className="relative aspect-[4/5] overflow-hidden rounded-md bg-surface">
            <Image src="/profile.png" alt={`Portrait of ${person.fullName}`} fill priority sizes="(min-width: 768px) 420px, 100vw" className="object-cover" />
          </div>
        </div>
      </section>

      <section aria-labelledby="story-title" className="section border-t border-line">
        <div className="shell grid gap-10 md:grid-cols-12">
          <h2 id="story-title" className="t-h3 text-fg md:col-span-4">
            {P.storyHeading}
          </h2>
          <Reveal className="space-y-6 md:col-span-8">
            {about.story.map((para, i) => (
              <RevealItem key={i}>
                <p className={i === 0 ? 'text-h4 font-medium leading-relaxed tracking-tight text-fg' : 'text-lead leading-relaxed text-muted'}>{para}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      <ExperienceTimeline heading={P.experienceHeading} items={experience} />

      <section aria-labelledby="principles-title" className="section border-t border-line">
        <div className="shell grid gap-10 md:grid-cols-12">
          <h2 id="principles-title" className="t-h3 text-fg md:col-span-4">
            {P.principlesHeading}
          </h2>
          <Reveal as="ul" className="grid gap-8 sm:grid-cols-3 md:col-span-8">
            {about.principles.map((p) => (
              <RevealItem as="li" key={p.title} className="border-t border-accent pt-6">
                <h3 className="t-h4 mb-2 text-fg">{p.title}</h3>
                <p className="text-small text-muted">{p.body}</p>
              </RevealItem>
            ))}
          </Reveal>
        </div>
      </section>

      <section aria-labelledby="stack-title" className="section border-t border-line">
        <div className="shell grid gap-10 md:grid-cols-12">
          <h2 id="stack-title" className="t-h3 text-fg md:col-span-4">
            {P.stackHeading}
          </h2>
          <div className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 md:col-span-8">
            {stackGroups.map((group) => (
              <div key={group.title} className="bg-bg p-6 md:p-8">
                <h3 className="t-h4 mb-4 text-fg">{group.title}</h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li key={item} className="chip !text-small">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ContactCTA
        eyebrow={sections.contact.eyebrow}
        heading={contactCopy.heading}
        body={contactCopy.body}
        responseTime={copy(contactCopy.responseTime)}
        email={contact.email}
        cta={hero.primaryCta}
      />
    </>
  );
}
