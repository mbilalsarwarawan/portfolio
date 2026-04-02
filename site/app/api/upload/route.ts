import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

const ALLOWED_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'application/pdf',
];
const MAX_SIZE = 100 * 1024 * 1024; // 100MB
const BUCKET = 'portfolio-files';

export async function POST(request: Request) {
  // Auth check via server client
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  const folder = (formData.get('folder') as string) || 'uploads';

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json(
      { error: `File type not allowed. Accepted: ${ALLOWED_TYPES.join(', ')}` },
      { status: 400 },
    );
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'File too large. Max 100MB.' }, { status: 400 });
  }

  // Use admin client for storage operations (bypasses RLS, can create bucket)
  const admin = createAdminClient();

  // Ensure bucket exists
  const { data: buckets } = await admin.storage.listBuckets();
  const bucketExists = buckets?.some((b) => b.name === BUCKET);
  if (!bucketExists) {
    const { error: createError } = await admin.storage.createBucket(BUCKET, { public: true });
    if (createError) {
      return NextResponse.json({ error: `Failed to create storage bucket: ${createError.message}` }, { status: 500 });
    }
  }

  const ext = file.name.split('.').pop();
  const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await admin.storage
    .from(BUCKET)
    .upload(fileName, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data: urlData } = admin.storage
    .from(BUCKET)
    .getPublicUrl(fileName);

  return NextResponse.json({ url: urlData.publicUrl });
}

export async function DELETE(request: Request) {
  // Auth check
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: { url?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { url } = body;
  if (!url || typeof url !== 'string') {
    return NextResponse.json({ error: 'url is required' }, { status: 400 });
  }

  // Extract storage path from public URL
  // URL format: .../storage/v1/object/public/<bucket>/<path>
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) {
    return NextResponse.json({ error: 'URL does not belong to this storage bucket' }, { status: 400 });
  }
  const storagePath = decodeURIComponent(url.slice(idx + marker.length).split('?')[0]);

  const admin = createAdminClient();
  const { error } = await admin.storage.from(BUCKET).remove([storagePath]);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
