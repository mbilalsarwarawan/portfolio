import Image from 'next/image';
import { ViewTransition } from 'react';
import type { SiteImage } from '@/lib/content';

interface ProjectMediaProps {
  slug: string;
  cover: SiteImage | null;
  /** Optional second image revealed on hover. */
  hover?: SiteImage | null;
  title: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Project image with blur placeholder, inner parallax (driven by --px/--py
 * from <Tilt>) and an optional hover image. It is wrapped in a named
 * ViewTransition so it morphs into the case-study hero on navigation.
 */
export function ProjectMedia({ slug, cover, hover, title, sizes, priority, className = '' }: ProjectMediaProps) {
  return (
    <ViewTransition name={`project-${slug}`}>
      <div className={`relative overflow-hidden rounded-md bg-surface ${className}`}>
        {cover ? (
          <div className="absolute -inset-5 transition-transform duration-[var(--dur-slower)] ease-[var(--ease-out-expo)] [transform:translate3d(var(--px,0),var(--py,0),0)] group-hover:scale-[1.03]">
            <Image
              src={cover.src}
              alt={cover.alt}
              fill
              sizes={sizes}
              priority={priority}
              placeholder={cover.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={cover.blurDataURL}
              className="object-cover object-top"
            />
            {hover && (
              <Image
                src={hover.src}
                alt=""
                fill
                sizes={sizes}
                loading="lazy"
                className="object-cover object-top opacity-0 transition-opacity duration-[var(--dur-slow)] group-hover:opacity-100"
              />
            )}
          </div>
        ) : (
          <div className="mesh-fallback absolute inset-0 grid place-items-center">
            <span className="t-h3 text-fg/70">{title}</span>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 rounded-md ring-1 ring-inset ring-line" aria-hidden="true" />
      </div>
    </ViewTransition>
  );
}
