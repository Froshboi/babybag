'use client';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { BabyMascot } from '@/components/BabyMascot';

export default function Landing() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && user) router.replace('/dashboard'); }, [loading, user, router]);
  if (loading || user) return null;
  return (
    <div className="flex flex-col items-center text-left space-y-0">
      {/* Hero */}
      <section className="w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-16 sm:pt-24 pb-16">
        <p className="eyebrow">FOREX, BUT MAKE IT TINY</p>
        <h1 className="max-w-3xl text-5xl sm:text-7xl md:text-8xl font-extrabold leading-[0.92] mt-6">
          Big money lessons.<br /><span className="text-[#217057]">Baby steps.</span>
        </h1>
        <p className="text-xl sm:text-2xl text-navy/65 max-w-xl mt-8 leading-relaxed">
          A friendly place to learn the market, practise without pressure, and build better money habits.
        </p>
        <div className="flex flex-wrap items-center gap-8 mt-10">
          <Link href="/auth/signup" className="btn-primary text-lg px-8 py-5">
            Learn the basics <span aria-hidden="true">→</span>
          </Link>
          <Link href="/dashboard" className="font-bold text-lg">
            See your wallet <span className="text-2xl align-middle">↗</span>
          </Link>
        </div>
        <div className="flex flex-wrap gap-6 text-sm text-navy/60 mt-10">
          <span className="tag">+ Beginner-first</span>
          <span className="tag">+ Paper trading</span>
          <span className="tag">+ No hype</span>
        </div>
        <div className="mt-14 max-w-xl h-72 sm:h-96 rounded-[3rem] bg-[#dcefdc] flex items-center justify-center overflow-hidden">
          <BabyMascot size="lg" />
        </div>
      </section>

      <section className="w-full bg-[#e2f0e5] px-6 sm:px-10 lg:px-16 py-16">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-5">
        <div className="card">
          <div className="text-4xl mb-4">📘</div><p className="eyebrow mb-2">01 · Learn</p>
          <h3 className="text-xl font-bold">Tiny lessons, real clarity</h3><p className="text-sm text-navy/60 mt-2 leading-relaxed">Build a calm foundation with bite-sized explanations and quizzes.</p>
        </div>
        <div className="card"><div className="text-4xl mb-4">🎯</div><p className="eyebrow mb-2">02 · Practice</p>
          <h3 className="text-xl font-bold">Try things without pressure</h3>
          <p className="text-sm text-navy/60 mt-2 leading-relaxed">Use paper trading and the simulator to turn ideas into instincts.</p>
        </div>
        <div className="card"><div className="text-4xl mb-4">💰</div><p className="eyebrow mb-2">03 · Earn</p>
          <h3 className="text-xl font-bold">Good habits get noticed</h3>
          <p className="text-sm text-navy/60 mt-2 leading-relaxed">Complete modules, collect rewards, and grow at your own pace.</p>
        </div>
        </div>
      </section>
    </div>
  );
}