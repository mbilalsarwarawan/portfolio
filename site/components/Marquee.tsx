'use client';

const ITEMS = [
  'React.js', 'JavaScript', 'Node.js', 'Express.js', 'Python', 'Django',
  'FastAPI', 'MongoDB', 'PostgreSQL', 'Redis', 'Docker', 'Nginx',
  'Tailwind CSS', 'Langchain', 'OpenAI API', 'TensorFlow', 'Git', 'Linux',
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...ITEMS, ...ITEMS];

  return (
    <div className="flex overflow-hidden select-none" aria-hidden="true">
      <div
        className={`flex shrink-0 gap-4 py-2 ${
          reverse ? 'animate-marquee direction-reverse' : 'animate-marquee'
        }`}
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item}-${i}`}
            className="shrink-0 px-5 py-2.5 text-sm font-medium whitespace-nowrap"
            style={{
              fontFamily: 'var(--font-display)',
              color: 'var(--text-tertiary)',
              border: '1px solid var(--border)',
              letterSpacing: '0.02em',
              transition: 'color 0.3s ease, border-color 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--accent)';
              e.currentTarget.style.borderColor = 'var(--accent)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-tertiary)';
              e.currentTarget.style.borderColor = 'var(--border)';
            }}
          >
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

export function Marquee() {
  return (
    <section className="py-16 md:py-20 overflow-hidden">
      <div className="space-y-4">
        <MarqueeRow />
        <MarqueeRow reverse />
      </div>
    </section>
  );
}
