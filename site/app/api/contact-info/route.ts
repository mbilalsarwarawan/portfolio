import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from('contact_info').select('*').limit(1).single();

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data ?? { email: '', phone: null, location: null, github_url: null, linkedin_url: null });
}

export async function PUT(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  const { data: existing } = await supabase.from('contact_info').select('id').limit(1).single();

  let result;
  if (existing) {
    result = await supabase.from('contact_info').update(body).eq('id', existing.id).select().single();
  } else {
    result = await supabase.from('contact_info').insert(body).select().single();
  }

  if (result.error) return NextResponse.json({ error: result.error.message }, { status: 400 });
  return NextResponse.json(result.data);
}
