import 'server-only';
import { cache } from 'react';
import { caseStudies } from '@/content/case-studies';
import { coreStack, experienceCopy, proof, testimonials } from '@/content/site';
import type { CaseStudyDecision, Testimonial } from '@/content/types';
import fallback from '@/content/fallback.json';
import { copy, copyList } from './copy';
import { createPublicClient, type CacheTag } from './db/public-client';
import type { AboutRow, ContactInfoRow, ExperienceRow, ProjectRow, SkillRow } from './db/types';
import { getImageMeta } from './images';

/* ------------------------------------------------------------------ */
/* View models: what components receive as props                      */
/* ------------------------------------------------------------------ */

export interface SiteImage {
  src: string;
  alt: string;
  width: number;
  height: number;
  blurDataURL?: string;
}

export interface Project {
  slug: string;
  title: string;
  year: string;
  role: string;
  kicker: string;
  headline: string;
  summary: string;
  problem: string;
  built: string[];
  decisions: CaseStudyDecision[];
  result: string[];
  stack: string[];
  liveUrl: string | null;
  githubUrl: string | null;
  cover: SiteImage | null;
  gallery: SiteImage[];
  featured: boolean;
  order: number;
  seoDescription: string;
  updatedAt: string;
}

export interface Experience {
  company: string;
  role: string;
  period: string;
  summary: string;
}

export interface Contact {
  email: string;
  location: string | null;
  githubUrl: string | null;
  linkedinUrl: string | null;
}

export interface ProofStats {
  stats: { value: string; label: string }[];
  companies: string[];
}

/* ------------------------------------------------------------------ */
/* Fetching with graceful fallback                                     */
/* ------------------------------------------------------------------ */

const snapshot = fallback as unknown as {
  projects: ProjectRow[];
  skills: SkillRow[];
  experiences: ExperienceRow[];
  about: AboutRow | null;
  contact: ContactInfoRow | null;
};

type Table = 'projects' | 'skills' | 'experiences' | 'about' | 'contact_info';

/**
 * Reads a public table through the cached anon client. On any failure
 * (network, missing env, RLS error) it logs and returns the committed
 * snapshot, so the site never renders blank.
 */
async function readTable<T>(table: Table, tag: CacheTag, fallbackRows: T[]): Promise<T[]> {
  const client = createPublicClient(tag);
  if (!client) return fallbackRows;
  try {
    const query = client.from(table).select('*');
    const { data, error } =
      table === 'about' || table === 'contact_info'
        ? await query.limit(1)
        : await query.order('display_order', { ascending: true });
    if (error) throw error;
    return (data as T[]) ?? fallbackRows;
  } catch (err) {
    console.warn(`[content] ${table} unavailable, using snapshot:`, (err as Error).message);
    return fallbackRows;
  }
}

/* ------------------------------------------------------------------ */
/* Mapping                                                             */
/* ------------------------------------------------------------------ */

async function toImage(src: string, alt: string): Promise<SiteImage> {
  const meta = await getImageMeta(src);
  return { src, alt, ...meta };
}

async function toProject(row: ProjectRow): Promise<Project> {
  const cs = caseStudies[row.slug];
  const sources = Array.from(new Set([row.image_url, ...(row.images ?? [])].filter(Boolean) as string[]));
  const images = await Promise.all(
    sources.map((src, i) =>
      toImage(src, i === 0 ? `${row.title}: product screenshot` : `${row.title}: screenshot ${i + 1}`),
    ),
  );

  return {
    slug: row.slug,
    title: row.title,
    year: row.year,
    role: cs?.role ?? row.role,
    kicker: cs?.kicker ?? row.tags.slice(0, 2).join(' · '),
    headline: copy(cs?.headline ?? row.description),
    summary: copy(cs?.summary ?? row.description),
    problem: copy(cs?.problem ?? ''),
    built: copyList(cs?.built ?? (row.content ? [row.content] : [])),
    decisions: cs?.decisions ?? [],
    result: copyList(cs?.result ?? []),
    stack: cs?.stack ?? row.tags,
    liveUrl: row.live_url,
    githubUrl: row.github_url,
    cover: images[0] ?? null,
    gallery: images,
    featured: cs?.featured ?? false,
    order: cs?.order ?? 100 + row.display_order,
    seoDescription: cs?.seoDescription ?? row.description,
    updatedAt: row.updated_at,
  };
}

/* ------------------------------------------------------------------ */
/* Public API (deduped per request with React cache)                   */
/* ------------------------------------------------------------------ */

export const getProjects = cache(async (): Promise<Project[]> => {
  const rows = await readTable<ProjectRow>('projects', 'projects', snapshot.projects);
  const projects = await Promise.all(rows.map(toProject));
  return projects.sort((a, b) => a.order - b.order);
});

export async function getProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  return projects.find((p) => p.slug === slug) ?? null;
}

export async function getAdjacentProject(slug: string): Promise<Project | null> {
  const projects = await getProjects();
  const i = projects.findIndex((p) => p.slug === slug);
  if (i === -1 || projects.length < 2) return null;
  return projects[(i + 1) % projects.length];
}

/** Bio core stack first, then any extra skills from Supabase, deduped case-insensitively. */
export const getStack = cache(async (): Promise<{ core: string[]; extended: string[] }> => {
  const rows = await readTable<SkillRow>('skills', 'skills', snapshot.skills);
  const seen = new Set(coreStack.map((s) => normalise(s)));
  const extended = rows.map((r) => r.name).filter((name) => {
    const key = normalise(name);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  return { core: coreStack, extended };
});

export const getExperience = cache(async (): Promise<Experience[]> => {
  const rows = await readTable<ExperienceRow>('experiences', 'experiences', snapshot.experiences);
  return rows.map((r) => {
    const override = experienceCopy[r.company];
    return {
      company: r.company,
      role: override?.role ?? r.role,
      period: r.period,
      summary: copy(override?.summary ?? r.description),
    };
  });
});

export const getContact = cache(async (): Promise<Contact> => {
  const fallbackRows = snapshot.contact ? [snapshot.contact] : [];
  const [row] = await readTable<ContactInfoRow>('contact_info', 'contact_info', fallbackRows);
  return {
    email: row?.email || 'mbilalsarwarawan@gmail.com',
    location: row?.location ?? null,
    githubUrl: row?.github_url ?? null,
    linkedinUrl: row?.linkedin_url ?? null,
  };
});

export const getResumeUrl = cache(async (): Promise<string | null> => {
  const fallbackRows = snapshot.about ? [snapshot.about] : [];
  const [row] = await readTable<AboutRow>('about', 'about', fallbackRows);
  return row?.resume_url ?? null;
});

export async function getProofStats(): Promise<ProofStats> {
  const [projects, experience] = await Promise.all([getProjects(), getExperience()]);
  const live = projects.filter((p) => p.liveUrl).length;
  const stats = [
    { value: String(live), label: proof.liveProductsLabel },
    { value: proof.yearsValue, label: proof.yearsLabel },
    { value: String(experience.length), label: proof.teamsLabel },
    { value: copy(proof.extraStat.value), label: copy(proof.extraStat.label) },
  ].filter((s) => s.value && s.label);
  return { stats, companies: experience.map((e) => e.company) };
}

function normalise(s: string) {
  return s.toLowerCase().replace(/[.\s()-]|js$/g, '');
}

/** Marquee rows: core stack first, then the rest. Each item carries how many case studies use it. */
export async function getStackRows(): Promise<{ name: string; count: number }[][]> {
  const [{ core, extended }, projects] = await Promise.all([getStack(), getProjects()]);
  const count = (name: string) => projects.filter((p) => p.stack.some((s) => normalise(s) === normalise(name))).length;
  const toItems = (names: string[]) => names.map((name) => ({ name, count: count(name) }));
  return [toItems(core), toItems(extended)].filter((row) => row.length > 0);
}

/** Testimonials with TODO placeholders stripped. Empty in production until real quotes exist. */
export function getTestimonials(): Testimonial[] {
  return testimonials
    .map((t) => ({ quote: copy(t.quote), name: copy(t.name), role: copy(t.role) }))
    .filter((t) => t.quote && t.name);
}
