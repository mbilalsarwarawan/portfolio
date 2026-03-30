import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('about').select('*').limit(1).single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? { bio: '', resume_url: null });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  // Try update first, if no rows, insert
  const { data: existing } = await supabase.from('about').select('id').limit(1).single();

  let result;
  if (existing) {
    result = await supabase.from('about').update(body).eq('id', existing.id).select().single();
  } else {
    result = await supabase.from('about').insert(body).select().single();
  }

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 });
  return NextResponse.json(result.data);
}
