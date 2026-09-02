'use client';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const { supabase } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    if (error) setError(error.message);
    else router.push('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto mt-6 sm:mt-12 card border-t-4 border-t-gold">
      <div className="text-center mb-6"><div className="text-5xl mb-3">🐣</div><p className="eyebrow">Start small</p><h2 className="text-2xl font-bold mt-1">Create your nest</h2></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Full Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="field"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="field"
          required
        />
        <input
          type="password"
          placeholder="Password (min 6 chars)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="field"
          required
          minLength={6}
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button type="submit" className="btn-primary w-full">Sign Up</button>
      </form>
      <p className="mt-4 text-sm text-navy/60">
        Already have an account? <Link href="/auth/signin" className="text-mint-dark font-semibold">Sign in</Link>
      </p>
    </div>
  );
}