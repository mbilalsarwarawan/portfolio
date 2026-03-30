'use client';

import { useEffect, useState } from 'react';

export default function AdminContactPage() {
  const [form, setForm] = useState({
    email: '',
    phone: '',
    location: '',
    github_url: '',
    linkedin_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/contact-info')
      .then((r) => r.json())
      .then((data) => {
        setForm({
          email: data.email || '',
          phone: data.phone || '',
          location: data.location || '',
          github_url: data.github_url || '',
          linkedin_url: data.linkedin_url || '',
        });
      })
      .finally(() => setLoading(false));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const body = {
      email: form.email,
      phone: form.phone || null,
      location: form.location || null,
      github_url: form.github_url || null,
      linkedin_url: form.linkedin_url || null,
    };

    const res = await fetch('/api/contact-info', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    setSaving(false);
    setMessage(res.ok ? 'Saved!' : 'Error saving');
  }

  if (loading) return <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>;

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
        Contact Info
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label-caps mb-2 block">Email</label>
          <input name="email" value={form.email} onChange={handleChange} required className="form-input w-full" />
        </div>
        <div>
          <label className="label-caps mb-2 block">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="form-input w-full" placeholder="+92…" />
        </div>
        <div>
          <label className="label-caps mb-2 block">Location</label>
          <input name="location" value={form.location} onChange={handleChange} className="form-input w-full" placeholder="Lahore, Pakistan" />
        </div>
        <div>
          <label className="label-caps mb-2 block">GitHub URL</label>
          <input name="github_url" value={form.github_url} onChange={handleChange} className="form-input w-full" placeholder="https://github.com/…" />
        </div>
        <div>
          <label className="label-caps mb-2 block">LinkedIn URL</label>
          <input name="linkedin_url" value={form.linkedin_url} onChange={handleChange} className="form-input w-full" placeholder="https://linkedin.com/in/…" />
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
