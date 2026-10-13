import type { ProcessStep } from '@/content/types';
import { SectionHeader, type SectionHeading } from '@/components/ui/SectionHeader';
import { Reveal, RevealItem } from '@/components/ui/Reveal';

export function Process({ heading, steps }: { heading: SectionHeading; steps: ProcessStep[] }) {
  return (
    <section id="process" aria-labelledby="process-title" className="section scroll-mt-20">
      <div className="shell">
        <SectionHeader id="process-title" index="05" heading={heading} />

        <Reveal as="ol" className="grid gap-px overflow-hidden rounded-md border border-line bg-line sm:grid-cols-2 lg:grid-cols-4" stagger={0.12}>
          {steps.map((step, i) => (
            <RevealItem as="li" key={step.title} className="flex flex-col bg-bg p-8 md:p-10">
              <span
                className="mb-12 font-display text-[4.5rem] font-semibold leading-none tracking-tighter text-accent [font-stretch:120%]"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <h3 className="t-h4 mb-3 text-fg">
                <span className="sr-only">Step {i + 1}: </span>
                {step.title}
              </h3>
              <p className="text-small text-muted">{step.body}</p>
            </RevealItem>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
