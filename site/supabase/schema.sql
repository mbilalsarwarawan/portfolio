-- ============================================================
-- Portfolio Supabase Schema
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
-- ============================================================

-- 1. Projects
create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text not null,
  content text not null default '',
  image_url text,
  tags text[] not null default '{}',
  year text not null,
  role text not null,
  live_url text,
  github_url text,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Skills
create table if not exists skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  display_order int not null default 0
);

-- 3. Experiences
create table if not exists experiences (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  role text not null,
  period text not null,
  description text not null default '',
  type text not null default 'full-time',
  display_order int not null default 0
);

-- 4. About (single-row)
create table if not exists about (
  id uuid primary key default gen_random_uuid(),
  bio text not null default '',
  resume_url text,
  updated_at timestamptz not null default now()
);

-- 5. Contact Info (single-row)
create table if not exists contact_info (
  id uuid primary key default gen_random_uuid(),
  email text not null default '',
  phone text,
  location text,
  github_url text,
  linkedin_url text,
  updated_at timestamptz not null default now()
);

-- ============================================================
-- Row Level Security
-- ============================================================

alter table projects enable row level security;
alter table skills enable row level security;
alter table experiences enable row level security;
alter table about enable row level security;
alter table contact_info enable row level security;

-- Public read for all tables
create policy "Public read projects"  on projects  for select using (true);
create policy "Public read skills"    on skills    for select using (true);
create policy "Public read experiences" on experiences for select using (true);
create policy "Public read about"     on about     for select using (true);
create policy "Public read contact_info" on contact_info for select using (true);

-- Authenticated write for all tables
create policy "Auth insert projects" on projects for insert to authenticated with check (true);
create policy "Auth update projects" on projects for update to authenticated using (true);
create policy "Auth delete projects" on projects for delete to authenticated using (true);

create policy "Auth insert skills" on skills for insert to authenticated with check (true);
create policy "Auth update skills" on skills for update to authenticated using (true);
create policy "Auth delete skills" on skills for delete to authenticated using (true);

create policy "Auth insert experiences" on experiences for insert to authenticated with check (true);
create policy "Auth update experiences" on experiences for update to authenticated using (true);
create policy "Auth delete experiences" on experiences for delete to authenticated using (true);

create policy "Auth insert about" on about for insert to authenticated with check (true);
create policy "Auth update about" on about for update to authenticated using (true);

create policy "Auth insert contact_info" on contact_info for insert to authenticated with check (true);
create policy "Auth update contact_info" on contact_info for update to authenticated using (true);

-- ============================================================
-- Auto-update updated_at trigger
-- ============================================================

create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger projects_updated_at before update on projects
  for each row execute function update_updated_at();

create trigger about_updated_at before update on about
  for each row execute function update_updated_at();

create trigger contact_info_updated_at before update on contact_info
  for each row execute function update_updated_at();

-- ============================================================
-- Storage bucket (run separately if needed)
-- ============================================================
-- insert into storage.buckets (id, name, public)
-- values ('portfolio-files', 'portfolio-files', true)
-- on conflict do nothing;

-- Storage policies:
-- create policy "Public read storage" on storage.objects
--   for select using (bucket_id = 'portfolio-files');
-- create policy "Auth upload storage" on storage.objects
--   for insert to authenticated with check (bucket_id = 'portfolio-files');
-- create policy "Auth delete storage" on storage.objects
--   for delete to authenticated using (bucket_id = 'portfolio-files');
