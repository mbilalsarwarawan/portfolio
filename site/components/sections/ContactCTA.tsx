import { ButtonLink } from '@/components/ui/Button';
import { Copy } from '@/components/ui/Copy';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { CopyEmail } from './CopyEmail';

interface ContactCTAProps {
  eyebrow: string;
  heading: string;
  body: string;
  responseTime: string;
  email: string;
  cta: { label: string; href: string };
}

/** Closing call to action on the home page. */
export function ContactCTA({ eyebrow, heading, body, responseTime, email, cta }: ContactCTAProps) {
  return (
    <section id="contact" aria-labelledby="contact-title" className="relative isolate scroll-mt-20 overflow-hidden border-t border-line">
      <div aria-hidden="true" className="mesh-fallback grain absolute inset-0 -z-10 opacity-70" />
      <Reveal className="shell section">
        <RevealItem>
          <p className="t-eyebrow mb-6">{eyebrow}</p>
        </RevealItem>
        <RevealItem>
          <h2 id="contact-title" className="t-display max-w-[16ch] text-fg">
            {heading}
          </h2>
        </RevealItem>
        <RevealItem className="mt-10 grid gap-10 md:grid-cols-12 md:items-end">
          <div className="md:col-span-6">
            <p className="t-lead max-w-[48ch]">{body}</p>
            {responseTime && (
              <p className="t-mono mt-4 text-subtle">
                <Copy text={responseTime} />
              </p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 md:col-span-6 md:justify-end">
            <ButtonLink href={cta.href}>{cta.label}</ButtonLink>
            <CopyEmail email={email} />
          </div>
        </RevealItem>
      </Reveal>
    </section>
  );
}
