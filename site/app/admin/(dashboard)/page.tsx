import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: projectCount },
    { count: skillCount },
    { count: expCount },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('skills').select('*', { count: 'exact', head: true }),
    supabase.from('experiences').select('*', { count: 'exact', head: true }),
  ]);

  const stats = [
    { label: 'Projects', count: projectCount ?? 0, href: '/admin/projects' },
    { label: 'Skills', count: skillCount ?? 0, href: '/admin/skills' },
    { label: 'Experiences', count: expCount ?? 0, href: '/admin/experience' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
        Dashboard
      </h1>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="p-5 rounded border transition-colors hover:border-[var(--accent)]"
            style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
          >
            <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)' }}>
              {s.count}
            </div>
            <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>
              {s.label}
            </div>
          </Link>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 gap-3">
        <Link href="/admin/about" className="p-4 rounded border text-sm hover:border-[var(--accent)] transition-colors" style={{ borderColor: 'var(--border)' }}>
          Edit About / Bio →
        </Link>
        <Link href="/admin/contact" className="p-4 rounded border text-sm hover:border-[var(--accent)] transition-colors" style={{ borderColor: 'var(--border)' }}>
          Edit Contact Info →
        </Link>
      </div>
    </div>
  );
}
