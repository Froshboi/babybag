'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { supabase } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError(error.message); setLoading(false); }
    else router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-12 card border-t-4 border-t-mint">
      <div className="text-center mb-6"><div className="text-5xl mb-3">✨</div><p className="eyebrow">Welcome back</p><h2 className="text-2xl font-bold mt-1">Ready for another tiny step?</h2></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field"
          required
        />
        <div className="relative"><input
          type={showPassword ? 'text' : 'password'}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field"
          required
        /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-xs text-mint-dark font-semibold">{showPassword ? 'Hide' : 'Show'}</button></div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? 'Opening your nest…' : 'Sign In'}</button>
      </form>
      <Link href="/auth/reset" className="block mt-4 text-sm text-mint-dark font-semibold">Forgot your password?</Link>
      <p className="mt-4 text-sm text-navy/60">
        No account? <Link href="/auth/signup" className="text-mint-dark font-semibold">Sign up</Link>
      </p>
    </div>
  );
}