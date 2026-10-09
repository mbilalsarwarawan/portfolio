import type { CSSProperties } from 'react';
import { HeroBackdrop } from '@/components/hero/HeroBackdrop';
import { ButtonLink } from '@/components/ui/Button';
import { SplitText } from '@/components/ui/SplitText';

interface HeroProps {
  eyebrow: string;
  headline: string[];
  valueProp: string;
  primaryCta: { label: string; href: string };
  secondaryCta: { label: string; href: string };
  availability: string;
  meta: { label: string; value: string }[];
}

const d = (s: number) => ({ '--d': `${s}s` }) as CSSProperties;

export function Hero({ eyebrow, headline, valueProp, primaryCta, secondaryCta, availability, meta }: HeroProps) {
  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col justify-end pb-12 pt-32 md:pb-16">
      <HeroBackdrop />

      <div className="shell">
        <div className="fade-up mb-8 flex flex-wrap items-center gap-x-4 gap-y-2" style={d(0)}>
          <span className="chip border-accent/40 text-fg">
            <span className="relative flex size-2" aria-hidden="true">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            {availability}
          </span>
          <span className="t-eyebrow">{eyebrow}</span>
        </div>

        <SplitText id="hero-title" lines={headline} accentWords={['ships', 'agents']} className="t-display max-w-[14ch] text-fg sm:max-w-none" />

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-12 md:items-end">
          <p className="t-lead max-w-[46ch] text-fg/85 md:col-span-6">{valueProp}</p>

          <div className="fade-up flex flex-wrap gap-3 md:col-span-6 md:justify-end" style={d(0.75)}>
            <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="ghost">
              {secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        <dl className="fade-up mt-14 grid grid-cols-2 gap-6 border-t border-line pt-6 sm:grid-cols-3 md:mt-20" style={d(0.95)}>
          {meta.map((m) => (
            <div key={m.label}>
              <dt className="t-eyebrow mb-1">{m.label}</dt>
              <dd className="text-small text-fg">{m.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
