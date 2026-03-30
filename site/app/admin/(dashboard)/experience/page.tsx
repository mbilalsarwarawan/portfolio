'use client';

import { useEffect, useState } from 'react';

interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string;
  type: string;
  display_order: number;
}

const EMPTY: Omit<Experience, 'id'> = {
  company: '', role: '', period: '', description: '', type: 'full-time', display_order: 0,
};

export default function AdminExperiencePage() {
  const [items, setItems] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const res = await fetch('/api/experience');
    setItems(await res.json());
    setLoading(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.name === 'display_order' ? Number(e.target.value) : e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (editingId) {
      await fetch(`/api/experience/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      setEditingId(null);
    } else {
      await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
    }

    setForm(EMPTY);
    setSaving(false);
    fetchItems();
  }

  function startEdit(exp: Experience) {
    setEditingId(exp.id);
    setForm({ company: exp.company, role: exp.role, period: exp.period, description: exp.description, type: exp.type, display_order: exp.display_order });
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this experience?')) return;
    await fetch(`/api/experience/${id}`, { method: 'DELETE' });
    fetchItems();
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
        Experience
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10 max-w-xl border rounded p-5" style={{ borderColor: 'var(--border)' }}>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="label-caps mb-1 block text-xs">Company</label>
            <input name="company" value={form.company} onChange={handleChange} required className="form-input w-full" />
          </div>
          <div>
            <label className="label-caps mb-1 block text-xs">Role</label>
            <input name="role" value={form.role} onChange={handleChange} required className="form-input w-full" />
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="label-caps mb-1 block text-xs">Period</label>
            <input name="period" value={form.period} onChange={handleChange} required className="form-input w-full" placeholder="Jan 2025 — Present" />
          </div>
          <div>
            <label className="label-caps mb-1 block text-xs">Type</label>
            <select name="type" value={form.type} onChange={handleChange} className="form-input w-full">
              <option value="full-time">Full-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
              <option value="freelance">Freelance</option>
            </select>
          </div>
          <div>
            <label className="label-caps mb-1 block text-xs">Order</label>
            <input name="display_order" type="number" value={form.display_order} onChange={handleChange} className="form-input w-full" />
          </div>
        </div>
        <div>
          <label className="label-caps mb-1 block text-xs">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} className="form-input w-full resize-none" />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
            {editingId ? 'Update' : 'Add Experience'}
          </button>
          {editingId && (
            <button type="button" onClick={() => { setEditingId(null); setForm(EMPTY); }} className="btn-outline text-sm">
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* List */}
      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
      ) : items.length === 0 ? (
        <p style={{ color: 'var(--text-secondary)' }}>No experience entries yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((exp) => (
            <div key={exp.id} className="p-4 rounded border" style={{ borderColor: 'var(--border)' }}>
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-medium" style={{ fontFamily: 'var(--font-display)' }}>
                    {exp.role} — {exp.company}
                  </div>
                  <div className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>
                    {exp.period} · {exp.type}
                  </div>
                  <p className="text-sm mt-2" style={{ color: 'var(--text-secondary)' }}>
                    {exp.description}
                  </p>
                </div>
                <div className="flex gap-2 shrink-0 ml-4">
                  <button onClick={() => startEdit(exp)} className="text-xs px-2 py-1 rounded border hover:border-[var(--accent)] transition-colors" style={{ borderColor: 'var(--border)' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(exp.id)} className="text-xs px-2 py-1 rounded border transition-colors" style={{ borderColor: 'var(--border)', color: '#ef4444' }}>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
