import 'server-only';
import precomputed from '@/content/image-meta.json';

export interface ImageMeta {
  width: number;
  height: number;
  blurDataURL?: string;
}

const FALLBACK: ImageMeta = { width: 1600, height: 1000 };
const known = precomputed as Record<string, ImageMeta>;
const cache = new Map<string, Promise<ImageMeta>>();

/** Computes metadata for images uploaded after the last `npm run snapshot`. */
async function compute(src: string): Promise<ImageMeta> {
  try {
    const res = await fetch(src, { signal: AbortSignal.timeout(6000), next: { revalidate: 86400 } });
    if (!res.ok) return FALLBACK;
    const { default: sharp } = await import('sharp');
    const img = sharp(Buffer.from(await res.arrayBuffer()));
    const { width = FALLBACK.width, height = FALLBACK.height } = await img.metadata();
    const tiny = await img.resize(16, 10, { fit: 'cover' }).webp({ quality: 40 }).toBuffer();
    return { width, height, blurDataURL: `data:image/webp;base64,${tiny.toString('base64')}` };
  } catch {
    return FALLBACK;
  }
}

/**
 * Intrinsic size + tiny blurred placeholder for a Supabase Storage image.
 * Precomputed by `npm run snapshot` (content/image-meta.json); new uploads
 * are computed once on the server and memoised.
 */
export function getImageMeta(src: string): Promise<ImageMeta> {
  if (known[src]) return Promise.resolve(known[src]);
  let p = cache.get(src);
  if (!p) {
    p = compute(src);
    cache.set(src, p);
  }
  return p;
}
