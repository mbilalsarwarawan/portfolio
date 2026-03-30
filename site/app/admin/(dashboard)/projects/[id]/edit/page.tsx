'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  year: string;
  role: string;
  tags: string[];
  live_url: string | null;
  github_url: string | null;
  image_url: string | null;
  display_order: number;
}

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then((r) => r.json())
      .then((data) => {
        setProject(data);
        setImageUrl(data.image_url || '');
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('folder', 'projects');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) setImageUrl(data.url);
      else setError(data.error);
    } catch {
      setError('Upload failed');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const fd = new FormData(e.currentTarget);
    const body = {
      title: fd.get('title'),
      slug: fd.get('slug'),
      description: fd.get('description'),
      content: fd.get('content'),
      year: fd.get('year'),
      role: fd.get('role'),
      tags: (fd.get('tags') as string).split(',').map((t) => t.trim()).filter(Boolean),
      live_url: fd.get('live_url') || null,
      github_url: fd.get('github_url') || null,
      image_url: imageUrl || null,
      display_order: Number(fd.get('display_order')) || 0,
    };

    try {
      const res = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error);
        return;
      }
      router.push('/admin/projects');
    } catch {
      setError('Failed to save');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>;
  if (!project) return <p style={{ color: '#ef4444' }}>Project not found</p>;

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
        Edit: {project.title}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title" name="title" required defaultValue={project.title} />
        <Field label="Slug" name="slug" required defaultValue={project.slug} />
        <Field label="Description" name="description" required textarea defaultValue={project.description} />
        <Field label="Content" name="content" textarea rows={6} defaultValue={project.content} />
        <Field label="Year" name="year" required defaultValue={project.year} />
        <Field label="Role" name="role" required defaultValue={project.role} />
        <Field label="Tags (comma separated)" name="tags" defaultValue={project.tags.join(', ')} />
        <Field label="Live URL" name="live_url" defaultValue={project.live_url || ''} />
        <Field label="GitHub URL" name="github_url" defaultValue={project.github_url || ''} />
        <Field label="Display Order" name="display_order" type="number" defaultValue={String(project.display_order)} />

        {/* Image upload */}
        <div>
          <label className="label-caps mb-2 block">Project Image</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} className="text-sm" />
          {uploading && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Uploading…</p>}
          {imageUrl && (
            <p className="text-xs mt-1 break-all" style={{ color: 'var(--text-secondary)' }}>
              ✓ {imageUrl}
            </p>
          )}
        </div>

        {error && (
          <div className="py-2 px-3 text-sm" style={{ color: '#ef4444', border: '1px solid #ef444433' }}>
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
          <button type="button" onClick={() => router.back()} className="btn-outline text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  required,
  placeholder,
  textarea,
  rows = 3,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  textarea?: boolean;
  rows?: number;
  defaultValue?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="label-caps mb-2 block">{label}</label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          required={required}
          placeholder={placeholder}
          rows={rows}
          defaultValue={defaultValue}
          className="form-input w-full resize-none"
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          placeholder={placeholder}
          defaultValue={defaultValue}
          className="form-input w-full"
        />
      )}
    </div>
  );
}
