import { Reveal, RevealItem } from '@/components/ui/Reveal';

interface ProofStripProps {
  stats: { value: string; label: string }[];
  companies: string[];
  companiesHeading: string;
}

export function ProofStrip({ stats, companies, companiesHeading }: ProofStripProps) {
  return (
    <section aria-label="Track record" className="border-y border-line">
      <div className="shell">
        <Reveal as="ul" className={`grid grid-cols-2 gap-px bg-line [&>li:last-child:nth-child(odd)]:col-span-2 lg:[&>li:last-child:nth-child(odd)]:col-span-1 ${stats.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
          {stats.map((s) => (
            <RevealItem as="li" key={s.label} className="flex flex-col gap-2 bg-bg px-4 py-8 sm:px-6 md:py-10">
              <span className="font-display text-h2 font-semibold leading-none tracking-tighter text-fg [font-stretch:118%]">
                {s.value}
              </span>
              <span className="text-small text-muted">{s.label}</span>
            </RevealItem>
          ))}
        </Reveal>

        <div className="flex flex-col gap-4 border-t border-line py-6 sm:flex-row sm:items-center sm:gap-10">
          <p className="t-eyebrow shrink-0">{companiesHeading}</p>
          <ul className="flex flex-wrap items-center gap-x-8 gap-y-2">
            {companies.map((c) => (
              <li key={c} className="font-display text-lead font-medium tracking-tight text-fg/80 [font-stretch:110%]">
                {c}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
