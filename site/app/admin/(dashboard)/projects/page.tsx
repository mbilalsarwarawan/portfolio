'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Project {
  id: string;
  slug: string;
  title: string;
  year: string;
  display_order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/projects')
      .then((r) => r.json())
      .then(setProjects)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete(id: string) {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/projects/${id}`, { method: 'DELETE' });
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>
          Projects
        </h1>
        <Link href="/admin/projects/new" className="btn-primary text-sm">
          + New Project
        </Link>
      </div>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
      ) : projects.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No projects yet.</p>
      ) : (
        <div className="space-y-2">
          {projects.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-between p-4 rounded border"
              style={{ borderColor: 'var(--border)' }}
            >
              <div>
                <div className="font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                  {p.title}
                </div>
                <div className="text-xs mt-0.5" style={{ color: 'var(--text-tertiary)' }}>
                  /{p.slug} · {p.year} · order: {p.display_order}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={`/admin/projects/${p.id}/edit`}
                  className="px-3 py-1.5 text-xs rounded border hover:border-[var(--accent)] transition-colors"
                  style={{ borderColor: 'var(--border)', fontFamily: 'var(--font-display)' }}
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="px-3 py-1.5 text-xs rounded border transition-colors"
                  style={{ borderColor: 'var(--border)', color: '#ef4444', fontFamily: 'var(--font-display)' }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
