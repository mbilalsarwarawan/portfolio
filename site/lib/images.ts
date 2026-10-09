import 'server-only';
import sharp from 'sharp';

export interface ImageMeta {
  width: number;
  height: number;
  blurDataURL?: string;
}

const FALLBACK: ImageMeta = { width: 1600, height: 1000 };
const cache = new Map<string, Promise<ImageMeta>>();

async function load(src: string): Promise<ImageMeta> {
  try {
    const res = await fetch(src, { signal: AbortSignal.timeout(10000), cache: 'no-store' });
    if (!res.ok) return FALLBACK;
    const buf = Buffer.from(await res.arrayBuffer());
    const img = sharp(buf);
    const { width = FALLBACK.width, height = FALLBACK.height } = await img.metadata();
    const tiny = await img.resize(16, 10, { fit: 'cover' }).webp({ quality: 40 }).toBuffer();
    return { width, height, blurDataURL: `data:image/webp;base64,${tiny.toString('base64')}` };
  } catch {
    return FALLBACK;
  }
}

/** Intrinsic size + a tiny blurred placeholder, computed on the server at build/ISR time. */
export function getImageMeta(src: string): Promise<ImageMeta> {
  let p = cache.get(src);
  if (!p) {
    p = load(src);
    cache.set(src, p);
  }
  return p;
}
