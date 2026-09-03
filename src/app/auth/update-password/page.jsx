'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function UpdatePassword() {
  const { supabase } = useAuth(); const router = useRouter();
  const [password, setPassword] = useState(''); const [error, setError] = useState(''); const [loading, setLoading] = useState(false);
  const submit = async (event) => { event.preventDefault(); setLoading(true); setError(''); const { error: updateError } = await supabase.auth.updateUser({ password }); if (updateError) { setError(updateError.message); setLoading(false); } else router.push('/dashboard'); };
  return <div className="max-w-md mx-auto mt-6 sm:mt-12 card border-t-4 border-t-mint"><p className="eyebrow">Fresh start</p><h1 className="text-2xl font-bold mt-2">Choose a new password</h1><form onSubmit={submit} className="space-y-4 mt-6"><input className="field" type="password" minLength={6} placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} required />{error && <p className="text-sm text-red-500">{error}</p>}<button disabled={loading} className="btn-primary w-full disabled:opacity-50">{loading ? 'Saving…' : 'Save password'}</button></form></div>;
}
