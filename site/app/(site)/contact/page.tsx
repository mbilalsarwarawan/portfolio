import type { Metadata } from 'next';
import { getContact } from '@/lib/content';
import { copy } from '@/lib/copy';
import { CopyEmail } from '@/components/sections/CopyEmail';
import { LocalTime } from '@/components/layout/LocalTime';
import { Emphasis } from '@/components/ui/Emphasis';
import { Copy } from '@/components/ui/Copy';
import { Arrow } from '@/components/ui/Button';
import { contact as contactCopy, pages, person, seo, services } from '@/content/site';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: seo.contact.title,
  description: seo.contact.description,
  alternates: { canonical: '/contact' },
  openGraph: { title: seo.contact.title, description: seo.contact.description, url: '/contact' },
};

const P = pages.contact;

export default async function ContactPage() {
  const contact = await getContact();
  const subject = encodeURIComponent('Project enquiry');
  const responseTime = copy(contactCopy.responseTime);
  const socials = [
    contact.linkedinUrl && { label: 'LinkedIn', href: contact.linkedinUrl },
    contact.githubUrl && { label: 'GitHub', href: contact.githubUrl },
  ].filter(Boolean) as { label: string; href: string }[];

  return (
    <section className="relative isolate overflow-hidden">
      <div aria-hidden="true" className="mesh-fallback grain absolute inset-x-0 top-0 -z-10 h-[70vh] opacity-60 [mask-image:linear-gradient(#000,transparent)]" />
      <div className="shell pb-24 pt-36 md:pb-32 md:pt-44">
        <p className="t-eyebrow fade-up mb-6">{P.eyebrow}</p>
        <h1 className="t-display fade-up max-w-[14ch] text-fg" style={{ ['--d' as string]: '0.06s' }}>
          <Emphasis text={P.title} />
        </h1>
        <p className="t-lead fade-up mt-8 max-w-[52ch]" style={{ ['--d' as string]: '0.12s' }}>
          {contactCopy.body}
        </p>

        <div className="mt-16 grid gap-px overflow-hidden rounded-md border border-line bg-line md:mt-20 md:grid-cols-12">
          <div className="bg-bg p-8 md:col-span-7 md:p-12">
            <p className="t-eyebrow mb-4">{P.emailLabel}</p>
            <a
              href={`mailto:${contact.email}?subject=${subject}`}
              className="group inline-flex items-center gap-3 break-all font-display text-h3 font-semibold leading-tight tracking-tight text-fg transition-colors hover:text-accent"
            >
              {contact.email}
              <Arrow className="size-6 shrink-0 text-accent" />
            </a>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <CopyEmail email={contact.email} />
              {responseTime && (
                <span className="t-mono text-subtle">
                  <Copy text={responseTime} />
                </span>
              )}
            </div>
          </div>

          <dl className="grid gap-8 bg-bg p-8 md:col-span-5 md:p-12">
            {socials.length > 0 && (
              <div>
                <dt className="t-eyebrow mb-3">{P.elsewhereLabel}</dt>
                <dd>
                  <ul className="space-y-2">
                    {socials.map((s) => (
                      <li key={s.label}>
                        <a href={s.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-2 text-lead text-fg hover:text-accent">
                          {s.label}
                          <Arrow />
                          <span className="sr-only">(opens in a new tab)</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
            <div>
              <dt className="t-eyebrow mb-2">{P.locationLabel}</dt>
              <dd className="text-fg">
                {contact.location ?? person.location}
                <span className="block text-small text-muted">{person.timezone}</span>
              </dd>
            </div>
            <div>
              <dt className="t-eyebrow mb-2">{P.timeLabel}</dt>
              <dd className="t-mono text-fg">
                <LocalTime timeZone="Asia/Karachi" />
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-20">
          <h2 className="t-eyebrow mb-6">{P.goodFitHeading}</h2>
          <ul className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <li key={s.id} className="bg-bg p-6">
                <p className="t-h4 mb-2 text-fg">{s.title}</p>
                <p className="text-small text-muted">{s.outcome}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
