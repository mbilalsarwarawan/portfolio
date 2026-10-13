import type { FaqItem } from '@/content/types';
import { Reveal, RevealItem } from '@/components/ui/Reveal';
import { SectionHeader, type SectionHeading } from '@/components/ui/SectionHeader';

interface FaqProps {
  heading: SectionHeading;
  items: FaqItem[];
}

export function Faq({ heading, items }: FaqProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="section scroll-mt-20 border-t border-line">
      <div className="shell">
        <SectionHeader id="faq-title" index="06" heading={heading} />
        <Reveal className="border-t border-line">
          {items.map((item) => (
            <RevealItem key={item.question}>
              <details className="group border-b border-line">
                <summary className="flex min-h-20 cursor-pointer list-none items-center justify-between gap-6 py-6 text-fg marker:content-none">
                  <span className="t-h4">{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="grid size-8 shrink-0 place-items-center rounded-full border border-line text-accent transition-transform duration-[var(--dur-base)] group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-[68ch] pb-8 pr-12 text-lead leading-relaxed text-muted">{item.answer}</p>
              </details>
            </RevealItem>
          ))}
        </Reveal>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </section>
  );
}
