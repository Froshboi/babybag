'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push('/auth/signin');
  }, [user, loading, router]);

  if (loading || !user) return <div className="card max-w-sm mx-auto my-16 text-center"><div className="text-4xl mb-3">🐣</div><p className="font-semibold">Setting up your nest...</p><p className="text-sm text-navy/60 mt-1">Just a tiny moment.</p></div>;
  return children;
};