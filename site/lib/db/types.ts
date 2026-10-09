/**
 * Database types for the public schema.
 * Mirrors the live Supabase schema (introspected 2026-10-09, see supabase/schema.sql).
 * Regenerate with: npx supabase gen types typescript --db-url "$DATABASE_URL" --schema public
 */

type Timestamp = string;

interface Table<Row, Insert = Partial<Row>> {
  Row: Row;
  Insert: Insert;
  Update: Partial<Row>;
  Relationships: [];
}

export interface ProjectRow {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  image_url: string | null;
  images: string[];
  tags: string[];
  year: string;
  role: string;
  live_url: string | null;
  github_url: string | null;
  display_order: number;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface SkillRow {
  id: string;
  name: string;
  category: string;
  display_order: number;
}

export interface ExperienceRow {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  type: string;
  display_order: number;
}

export interface AboutRow {
  id: string;
  bio: string;
  resume_url: string | null;
  updated_at: Timestamp;
}

export interface ContactInfoRow {
  id: string;
  email: string;
  phone: string | null;
  location: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  updated_at: Timestamp;
}

export interface Database {
  public: {
    Tables: {
      projects: Table<ProjectRow>;
      skills: Table<SkillRow>;
      experiences: Table<ExperienceRow>;
      about: Table<AboutRow>;
      contact_info: Table<ContactInfoRow>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
