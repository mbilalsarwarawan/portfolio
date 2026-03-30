'use client';

import { useEffect, useState } from 'react';

export default function AdminAboutPage() {
  const [bio, setBio] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/about')
      .then((r) => r.json())
      .then((data) => {
        setBio(data.bio || '');
        setResumeUrl(data.resume_url || '');
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('folder', 'resume');
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();
      if (res.ok) setResumeUrl(data.url);
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const res = await fetch('/api/about', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ bio, resume_url: resumeUrl || null }),
    });

    setSaving(false);
    setMessage(res.ok ? 'Saved!' : 'Error saving');
  }

  if (loading) return <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
        About / Bio
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-caps mb-2 block">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={8}
            className="form-input w-full resize-none"
            placeholder="Write your bio…"
          />
        </div>

        <div>
          <label className="label-caps mb-2 block">Resume PDF</label>
          <input type="file" accept=".pdf" onChange={handleResumeUpload} className="text-sm" />
          {uploading && <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Uploading…</p>}
          {resumeUrl && (
            <p className="text-xs mt-1 break-all" style={{ color: 'var(--text-secondary)' }}>
              ✓ {resumeUrl}
            </p>
          )}
        </div>

        {message && (
          <p className="text-sm" style={{ color: message === 'Saved!' ? '#10b981' : '#ef4444' }}>
            {message}
          </p>
        )}

        <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
          {saving ? 'Saving…' : 'Save'}
        </button>
      </form>
    </div>
  );
}
