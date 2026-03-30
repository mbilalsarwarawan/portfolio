'use client';

import { useEffect, useState } from 'react';

interface Skill {
  id: string;
  name: string;
  category: string;
  display_order: number;
}

const CATEGORIES = ['frontend', 'backend', 'database', 'ai/ml', 'devops & tools'];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [order, setOrder] = useState(0);
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  async function fetchSkills() {
    const res = await fetch('/api/skills');
    setSkills(await res.json());
    setLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    if (editingId) {
      await fetch(`/api/skills/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, display_order: order }),
      });
      setEditingId(null);
    } else {
      await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, category, display_order: order }),
      });
    }

    setName('');
    setCategory(CATEGORIES[0]);
    setOrder(0);
    setSaving(false);
    fetchSkills();
  }

  function startEdit(skill: Skill) {
    setEditingId(skill.id);
    setName(skill.name);
    setCategory(skill.category);
    setOrder(skill.display_order);
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this skill?')) return;
    await fetch(`/api/skills/${id}`, { method: 'DELETE' });
    fetchSkills();
  }

  const grouped = CATEGORIES.map((cat) => ({
    category: cat,
    items: skills.filter((s) => s.category === cat),
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8" style={{ fontFamily: 'var(--font-display)' }}>
        Skills
      </h1>

      {/* Add/Edit form */}
      <form onSubmit={handleSubmit} className="flex flex-wrap gap-3 mb-10 items-end">
        <div>
          <label className="label-caps mb-1 block text-xs">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="form-input"
            placeholder="React.js"
          />
        </div>
        <div>
          <label className="label-caps mb-1 block text-xs">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="form-input"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label-caps mb-1 block text-xs">Order</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="form-input w-20"
          />
        </div>
        <button type="submit" disabled={saving} className="btn-primary text-sm disabled:opacity-50">
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => { setEditingId(null); setName(''); }}
            className="btn-outline text-sm"
          >
            Cancel
          </button>
        )}
      </form>

      {loading ? (
        <p style={{ color: 'var(--text-secondary)' }}>Loading…</p>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ category: cat, items }) => (
            <div key={cat}>
              <h2
                className="text-sm font-bold uppercase tracking-wider mb-3"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--accent)' }}
              >
                {cat}
              </h2>
              {items.length === 0 ? (
                <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>No skills</p>
              ) : (
                <div className="space-y-1">
                  {items.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between py-2 px-3 rounded border"
                      style={{ borderColor: 'var(--border)' }}
                    >
                      <span className="text-sm">{skill.name}</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(skill)}
                          className="text-xs px-2 py-1 rounded border hover:border-[var(--accent)] transition-colors"
                          style={{ borderColor: 'var(--border)' }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(skill.id)}
                          className="text-xs px-2 py-1 rounded border transition-colors"
                          style={{ borderColor: 'var(--border)', color: '#ef4444' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
