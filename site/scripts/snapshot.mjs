// Refreshes content/fallback.json from Supabase (read-only, anon key).
// Used by lib/content.ts when Supabase is unreachable. Run: npm run snapshot
import { writeFileSync } from 'node:fs';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
if (!url || !key) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY');

const headers = { apikey: key, Authorization: `Bearer ${key}` };
const get = async (path) => {
  const res = await fetch(`${url}/rest/v1/${path}`, { headers });
  if (!res.ok) throw new Error(`${path}: ${res.status}`);
  return res.json();
};

const [projects, skills, experiences, about, contact] = await Promise.all([
  get('projects?select=*&order=display_order'),
  get('skills?select=*&order=display_order'),
  get('experiences?select=*&order=display_order'),
  get('about?select=*&limit=1'),
  // phone is deliberately left out of the committed snapshot
  get('contact_info?select=id,email,location,github_url,linkedin_url,updated_at&limit=1'),
]);

const snapshot = {
  generatedAt: new Date().toISOString(),
  projects,
  skills,
  experiences,
  about: about[0] ?? null,
  contact: contact[0] ? { ...contact[0], phone: null } : null,
};
writeFileSync(new URL('../content/fallback.json', import.meta.url), JSON.stringify(snapshot, null, 2) + '\n');
console.log(`snapshot: ${projects.length} projects, ${skills.length} skills, ${experiences.length} experiences`);

// Precompute intrinsic sizes + blur placeholders so pages never download
// full-size images at render time (lib/images.ts reads this file first).
const sharp = (await import('sharp')).default;
const metaPath = new URL('../content/image-meta.json', import.meta.url);
const urls = [...new Set(projects.flatMap((p) => [p.image_url, ...(p.images ?? [])]).filter(Boolean))];
const meta = {};
for (const src of urls) {
  try {
    const buf = Buffer.from(await (await fetch(src)).arrayBuffer());
    const img = sharp(buf);
    const { width, height } = await img.metadata();
    const tiny = await img.resize(16, 10, { fit: 'cover' }).webp({ quality: 40 }).toBuffer();
    meta[src] = { width, height, blurDataURL: `data:image/webp;base64,${tiny.toString('base64')}` };
  } catch (err) {
    console.warn('image meta failed:', src, err.message);
  }
}
writeFileSync(metaPath, JSON.stringify(meta, null, 2) + '\n');
console.log(`image meta: ${Object.keys(meta).length}/${urls.length} images`);
