'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function PlatformAdminLoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const result = await login({ email, password });
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Login failed');
      return;
    }

    // No need to check localStorage 'user' here as it's no longer stored.
    // useAuth.login handles redirection based on role.
    
    // If you strictly want to enforce platform_admin only here, 
    // you would need to check the response from login() if it returned the user object,
    // or rely on useAuth's redirection.
    // Since useAuth redirects non-admins to /dashboard, they won't stay here anyway.

    // No need to redirect, useAuth.login already does it
    // Optionally show "success" state, or leave blank for now
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-xl shadow p-8 space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-900">
          Platform Admin Login
        </h1>
        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full h-10 rounded-lg bg-black text-white disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Login as Platform Admin'}
        </button>
      </form>
    </div>
  );
}
