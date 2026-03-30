'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);

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
      const res = await fetch('/api/projects', {
        method: 'POST',
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

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
        New Project
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title" name="title" required />
        <Field label="Slug" name="slug" required placeholder="my-project-slug" />
        <Field label="Description" name="description" required textarea />
        <Field label="Content" name="content" textarea rows={6} />
        <Field label="Year" name="year" required placeholder="2025" />
        <Field label="Role" name="role" required placeholder="Full-Stack Developer" />
        <Field label="Tags (comma separated)" name="tags" placeholder="React, Node.js, MongoDB" />
        <Field label="Live URL" name="live_url" placeholder="https://..." />
        <Field label="GitHub URL" name="github_url" placeholder="https://github.com/..." />
        <Field label="Display Order" name="display_order" type="number" placeholder="0" />

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
            {saving ? 'Saving…' : 'Create Project'}
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
