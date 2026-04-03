'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Login failed');
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch {
      setError('Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'var(--bg)' }}>
      <div className="w-full max-w-sm">
        <h1
          className="text-2xl font-bold mb-8 text-center"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Admin Login
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="label-caps mb-2 block">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="form-input w-full"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="label-caps mb-2 block">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="form-input w-full"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <div
              className="py-2 px-3 text-sm"
              style={{ color: 'var(--error)', border: '1px solid var(--error-border)', background: 'var(--error-bg)' }}
            >
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
