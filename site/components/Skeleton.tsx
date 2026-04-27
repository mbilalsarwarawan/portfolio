import type { CSSProperties } from 'react';

interface SkeletonBlockProps {
  className?: string;
  style?: CSSProperties;
}

export function SkeletonBlock({ className = '', style }: SkeletonBlockProps) {
  return (
    <div
      aria-hidden="true"
      className={`skeleton-block ${className}`.trim()}
      style={style}
    />
  );
}

export function ProjectCardSkeleton() {
  return (
    <div
      className="relative overflow-hidden px-4 md:px-6"
      style={{ border: '1px solid var(--border)' }}
      aria-hidden="true"
    >
      <SkeletonBlock
        className="aspect-[4/3] w-full surface-noise"
        style={{ background: 'var(--bg-surface)' }}
      />

      <div className="pt-5 pb-2 space-y-4">
        <div className="flex items-center gap-3">
          <SkeletonBlock className="h-3 w-14" />
          <SkeletonBlock className="h-px w-4" />
          <SkeletonBlock className="h-3 w-20" />
        </div>

        <SkeletonBlock className="h-7 w-3/4" />

        <div className="space-y-2">
          <SkeletonBlock className="h-4 w-full" />
          <SkeletonBlock className="h-4 w-5/6" />
        </div>

        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 4 }, (_, index) => (
            <SkeletonBlock key={index} className="h-7 w-16" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProjectGridSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <ProjectCardSkeleton key={index} />
      ))}
    </div>
  );
}

export function ExperienceListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="py-8 space-y-4"
          style={{ borderBottom: '1px solid var(--border)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-3">
              <SkeletonBlock className="h-6 w-40" />
              <SkeletonBlock className="h-3 w-24" />
            </div>
            <SkeletonBlock className="h-4 w-28 shrink-0" />
          </div>

          <div className="space-y-2 max-w-lg">
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkillColumnsSkeleton({ columns = 4 }: { columns?: number }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16" aria-hidden="true">
      {Array.from({ length: columns }, (_, columnIndex) => (
        <div key={columnIndex}>
          <SkeletonBlock className="h-4 w-28 mb-5" />
          <div className="space-y-3">
            {Array.from({ length: 5 }, (_, itemIndex) => (
              <SkeletonBlock
                key={itemIndex}
                className="h-4"
                style={{ width: `${70 + (itemIndex % 3) * 10}%` }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function ContactLinksSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="grid gap-4" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div
          key={index}
          className="grid gap-4 border px-5 py-5 md:grid-cols-[auto_1fr_auto] md:items-center"
          style={{
            borderColor: 'var(--border)',
            background: 'color-mix(in srgb, var(--bg) 72%, transparent)',
          }}
        >
          <SkeletonBlock className="h-4 w-8" />

          <div className="space-y-3">
            <SkeletonBlock className="h-3 w-[4.5rem]" />
            <SkeletonBlock className="h-7 w-3/4" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-4/5" />
          </div>

          <SkeletonBlock className="h-4 w-12" />
        </div>
      ))}
    </div>
  );
}
