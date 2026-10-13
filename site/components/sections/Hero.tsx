import type { CSSProperties } from 'react';
import { HeroBackdrop } from '@/components/hero/HeroBackdrop';
import { ButtonLink } from '@/components/ui/Button';

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
    <section
      aria-labelledby="hero-title"
      className="relative isolate flex min-h-[100svh] flex-col justify-center overflow-hidden"
    >
      {/* Ambient background */}
      <HeroBackdrop />

      {/* Decorative orbit rings */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="scale-up absolute h-[520px] w-[520px] rounded-full border border-accent/10" style={d(0.2)} />
        <div className="scale-up absolute h-[700px] w-[700px] rounded-full border border-accent/6" style={d(0.4)} />
        <div className="scale-up absolute h-[900px] w-[900px] rounded-full border border-line/30" style={d(0.6)} />
      </div>

      <div className="shell relative z-10 pb-16 pt-28 md:pt-32">
        <div className="flex max-w-3xl flex-col gap-8">
          {/* Availability pill */}
          <div className="slide-left flex items-center gap-3" style={d(0)}>
            <span className="chip border-accent/30 bg-accent-soft text-fg/80">
              <span className="relative flex size-1.5" aria-hidden="true">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex size-1.5 rounded-full bg-accent" />
              </span>
              {availability}
            </span>
          </div>

          <p className="fade-up t-eyebrow" style={d(0.04)}>
            {eyebrow}
          </p>

          {/* Headline */}
          <h1 id="hero-title" className="flex flex-col gap-1">
            {headline.map((line, i) => (
              <div key={i} className="overflow-hidden">
                <span
                  className="fade-up block font-display text-h1 font-[640] leading-[0.98] tracking-[-0.04em] [font-stretch:112%] text-fg"
                  style={d(0.05 + i * 0.12)}
                >
                  {line}
                </span>
              </div>
            ))}
          </h1>

          {/* Value prop */}
          <p className="fade-up t-lead max-w-[42ch] text-fg/70" style={d(0.45)}>
            {valueProp}
          </p>

          {/* CTAs */}
          <div className="fade-up flex flex-wrap items-center gap-3" style={d(0.58)}>
            <ButtonLink href={primaryCta.href}>{primaryCta.label}</ButtonLink>
            <ButtonLink href={secondaryCta.href} variant="ghost">{secondaryCta.label}</ButtonLink>
          </div>

          {/* Micro meta */}
          <dl className="fade-up flex flex-wrap gap-x-8 gap-y-3 border-t border-line pt-6" style={d(0.72)}>
            {meta.map((m) => (
              <div key={m.label} className="flex flex-col gap-0.5">
                <dt className="t-eyebrow">{m.label}</dt>
                <dd className="text-small text-fg/80">{m.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Bottom fade out */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg to-transparent" />
    </section>
  );
}
