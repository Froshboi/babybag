'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function ResetPassword() {
  const { supabase } = useAuth();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const submit = async (event) => {
    event.preventDefault(); setError(''); setMessage(''); setLoading(true);
    const { error: requestError } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/auth/update-password` });
    setLoading(false);
    if (requestError) setError(requestError.message); else setMessage('Check your inbox for a secure reset link.');
  };
  return <div className="max-w-md mx-auto mt-6 sm:mt-12 card border-t-4 border-t-gold">
    <p className="eyebrow">Account access</p><h1 className="text-2xl font-bold mt-2">Reset your password</h1>
    <p className="text-sm text-navy/60 mt-2">We will email you a safe link to choose a new password.</p>
    <form onSubmit={submit} className="space-y-4 mt-6"><input className="field" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      {error && <p className="text-sm text-red-500">{error}</p>}{message && <p className="text-sm text-green-600">{message}</p>}
      <button disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? 'Sending…' : 'Email reset link'}</button>
    </form><Link href="/auth/signin" className="block mt-5 text-sm text-mint-dark font-semibold">← Back to sign in</Link>
  </div>;
}
