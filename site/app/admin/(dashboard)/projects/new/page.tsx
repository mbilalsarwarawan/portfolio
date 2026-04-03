'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewProjectPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingUrl, setDeletingUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    setError('');
    const newUrls: string[] = [];
    for (const file of files) {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'projects');
      try {
        const res = await fetch('/api/upload', { method: 'POST', body: form });
        const data = await res.json();
        if (res.ok) newUrls.push(data.url);
        else setError(data.error ?? 'Upload failed');
      } catch {
        setError('Upload failed');
      }
    }
    setImages((prev) => [...prev, ...newUrls]);
    setUploading(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleDeleteImage(url: string) {
    setDeletingUrl(url);
    try {
      await fetch('/api/upload', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
    } catch { /* best-effort */ }
    setImages((prev) => prev.filter((u) => u !== url));
    setDeletingUrl(null);
  }

  function makePrimary(url: string) {
    setImages((prev) => [url, ...prev.filter((u) => u !== url)]);
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
      image_url: images[0] || null,
      images,
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

        {/* ── Multi-image manager ── */}
        <div>
          <label className="label-caps mb-3 block">Project Images</label>

          {/* Uploaded images grid */}
          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
              {images.map((url, idx) => (
                <div
                  key={url}
                  className="relative group overflow-hidden"
                  style={{ border: idx === 0 ? '2px solid var(--accent)' : '1px solid var(--border)' }}
                >
                  <img
                    src={url}
                    alt={`Project image ${idx + 1}`}
                    className="w-full aspect-[4/3] object-cover"
                  />
                  {idx === 0 && (
                    <span
                      className="absolute top-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5 uppercase tracking-wide"
                      style={{
                        background: 'var(--accent)',
                        color: '#fff',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      Primary
                    </span>
                  )}
                  <span
                    className="absolute bottom-1.5 left-1.5 text-[10px] font-bold px-1.5 py-0.5"
                    style={{
                      background: 'rgba(0,0,0,0.55)',
                      color: '#fff',
                      fontFamily: 'var(--font-display)',
                    }}
                  >
                    {idx + 1}
                  </span>
                  <div
                    className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    style={{ background: 'rgba(0,0,0,0.6)' }}
                  >
                    {idx !== 0 && (
                      <button
                        type="button"
                        onClick={() => makePrimary(url)}
                        className="text-[11px] font-semibold px-2.5 py-1 w-24 text-center transition-colors"
                        style={{
                          background: 'var(--accent)',
                          color: '#fff',
                          fontFamily: 'var(--font-display)',
                        }}
                      >
                        Set Primary
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDeleteImage(url)}
                      disabled={deletingUrl === url}
                      className="text-[11px] font-semibold px-2.5 py-1 w-24 text-center transition-colors disabled:opacity-50"
                      style={{
                        background: '#ef4444',
                        color: '#fff',
                        fontFamily: 'var(--font-display)',
                      }}
                    >
                      {deletingUrl === url ? 'Deleting…' : 'Delete'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-3">
            <label
              className="cursor-pointer btn-outline text-sm"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
              </svg>
              {uploading ? 'Uploading…' : 'Upload Images'}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,image/gif"
                multiple
                onChange={handleFileChange}
                disabled={uploading}
                className="sr-only"
              />
            </label>
            {images.length > 0 && (
              <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                {images.length} image{images.length !== 1 ? 's' : ''} — first is primary
              </span>
            )}
          </div>
        </div>

        {error && (
          <div className="py-2 px-3 text-sm rounded-lg" style={{ color: 'var(--error)', border: '1px solid var(--error-border)', background: 'var(--error-bg)' }}>
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
