import 'server-only';
import { revalidatePath, revalidateTag } from 'next/cache';
import type { CacheTag } from './db/public-client';

/** Called after admin writes: expires the cached Supabase reads and the static pages built from them. */
export function invalidate(tag: CacheTag) {
  revalidateTag(tag, { expire: 0 });
  revalidatePath('/', 'layout');
}
