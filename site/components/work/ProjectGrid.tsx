'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import type { Project } from '@/lib/content';
import { ProjectCard } from './ProjectCard';
import { ease } from '@/lib/motion';

interface ProjectGridProps {
  projects: Project[];
  filters: string[];
  allLabel: string;
  emptyLabel: string;
}

const norm = (s: string) => s.toLowerCase().replace(/[.\s()-]|js$/g, '');

/** Filterable project grid. The active filter lives in ?stack= so it's linkable from the stack marquee. */
export function ProjectGrid({ projects, filters, allLabel, emptyLabel }: ProjectGridProps) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const active = params.get('stack');

  const visible = active ? projects.filter((p) => p.stack.some((s) => norm(s) === norm(active))) : projects;
  const options = active && !filters.some((f) => norm(f) === norm(active)) ? [...filters, active] : filters;

  function select(value: string | null) {
    const url = value ? `${pathname}?stack=${encodeURIComponent(value)}` : pathname;
    router.replace(url, { scroll: false });
  }

  return (
    <div>
      <div role="group" aria-label="Filter by technology" className="mb-12 flex flex-wrap gap-2">
        {[null, ...options].map((f) => {
          const isActive = f === null ? !active : !!active && norm(f) === norm(active);
          return (
            <button
              key={f ?? 'all'}
              type="button"
              aria-pressed={isActive}
              onClick={() => select(f)}
              className={`chip min-h-10 !px-4 !text-small transition-colors duration-[var(--dur-base)] ${
                isActive ? '!border-accent bg-accent !text-accent-fg' : 'hover:border-fg hover:text-fg'
              }`}
            >
              {f ?? allLabel}
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} project{visible.length === 1 ? '' : 's'} shown
      </p>

      {visible.length === 0 ? (
        <p className="rounded-md border border-dashed border-line-strong p-10 text-center text-muted">{emptyLabel}</p>
      ) : (
        <motion.ul layout className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((p) => (
              <motion.li
                key={p.slug}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: ease.outExpo }}
              >
                <ProjectCard project={p} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
    </div>
  );
}
