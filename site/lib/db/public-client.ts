import 'server-only';
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

export const CACHE_TAGS = {
  projects: 'projects',
  skills: 'skills',
  experiences: 'experiences',
  about: 'about',
  contact: 'contact_info',
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

const REVALIDATE_SECONDS = 3600;

/**
 * Cookie-less anon client for public, RLS-protected reads.
 * Requests go through Next's fetch cache so pages stay static (ISR)
 * and admin writes can invalidate them via revalidateTag().
 */
export function createPublicClient(tag: CacheTag) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;

  return createClient<Database>(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) =>
        fetch(input, {
          ...init,
          signal: AbortSignal.timeout(8000),
          next: { revalidate: REVALIDATE_SECONDS, tags: [tag] },
        }),
    },
  });
}
