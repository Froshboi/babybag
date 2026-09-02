import { createServerSupabase } from '@/lib/supabase/server';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

async function getDashboardData(userId) {
  const supabase = createServerSupabase();
  const [walletRes, progressRes, streakRes, modulesRes] = await Promise.all([
    supabase
      .from('wallets')
      .select('spendable_bb, total_earned_bb')
      .eq('user_id', userId)
      .single(),
    supabase
      .from('module_progress')
      .select('module_id, status, percent_complete, completed_at')
      .eq('user_id', userId),
    supabase
      .from('learning_streaks')
      .select('current_streak, longest_streak')
      .eq('user_id', userId)
      .single(),
    supabase
      .from('modules')
      .select('id, title, slug, duration_minutes, phase_order, module_order')
      .order('phase_order', { ascending: true })
      .order('module_order', { ascending: true }),
  ]);
  return {
    wallet: walletRes.data
      ? { balance: walletRes.data.spendable_bb, total_earned: walletRes.data.total_earned_bb }
      : { balance: 0, total_earned: 0 },
    progress: progressRes.data || [],
    streak: streakRes.data || { current_streak: 0, longest_streak: 0 },
    modules: modulesRes.data || [],
  };
}

export default async function Dashboard() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { wallet, progress, streak, modules } = await getDashboardData(user.id);

  // For learning nest: pick the first incomplete module, or the first if all completed
  const incomplete = modules.find(
    (m) => !progress.some((p) => p.module_id === m.id && p.status === 'completed')
  );
  const firstModule = modules[0];
  const displayModule = incomplete || firstModule;
  const displayProgress = progress.find((p) => p.module_id === displayModule?.id);
  const completedCount = progress.filter((p) => p.status === 'completed').length;

  return (
    <ProtectedRoute>
      <div className="space-y-0">
        <div className="px-6 sm:px-10 lg:px-16 py-12 max-w-7xl mx-auto">
          <p className="eyebrow">Your home base</p>
          <h1 className="section-title text-4xl md:text-5xl">A little progress goes a long way.</h1>
          <p className="text-navy/60">Keep your money habits and market knowledge growing together.</p>
        </div>
        <div className="px-6 sm:px-10 lg:px-16 pb-14 max-w-7xl mx-auto grid lg:grid-cols-2 gap-8">
          <div className="card min-h-52">
            <div className="flex justify-between items-start"><div><h2 className="text-xl font-bold">◎ EUR / USD</h2><p className="text-sm text-navy/55 mt-1">Learning setup · 4H</p></div><span className="rounded-full bg-[#dcefdc] px-4 py-3 text-sm">Educational</span></div>
            <p className="text-4xl font-bold mt-10 tracking-tight">1.0842</p>
          </div>
          <div className="rounded-[2rem] bg-[#14221d] text-white p-7 min-h-52">
            <div className="flex justify-between items-center"><p className="text-lg">Paper account</p><p className="text-3xl font-bold text-gold">₦100,000.00</p></div>
            <div className="mt-8 h-20 flex items-end gap-2 border-b border-white/15"><span className="h-4 w-1/12 bg-gold"/><span className="h-8 w-1/12 bg-gold"/><span className="h-5 w-1/12 bg-gold"/><span className="h-14 w-1/12 bg-gold"/><span className="h-10 w-1/12 bg-gold"/><span className="h-20 w-1/12 bg-gold"/><span className="h-12 w-1/12 bg-gold"/><span className="h-24 w-1/12 bg-gold"/><span className="h-16 w-1/12 bg-gold"/><span className="h-28 w-1/12 bg-gold"/></div>
            <p className="text-xs text-white/45 mt-5">Illustrative data only · not live market data</p>
          </div>
        </div>
        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-8 bg-[#21664f] text-white px-6 sm:px-10 lg:px-16 py-16">
          {/* MONEY NEST */}
          <div className="card space-y-5 text-navy max-w-xl">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>💰</span> YOUR MONEY NEST
            </h2>
            <p className="text-sm text-navy/60">
              Save steadily. Learn safely.
            </p>
            <p className="text-xs text-navy/50">
              Plan your savings target, track your learning progress, and connect a verified payment provider when the secure backend is deployed.
            </p>
            <div className="pt-2 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Savings goal</span>
                <span className="font-bold text-gold">{formatCurrency(50000)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Target balance</span>
                <span>{formatCurrency(wallet.balance)}</span>
              </div>
              <div className="flex flex-wrap gap-3 mt-5">
                <button className="btn-primary text-sm px-4 py-2">+ Add goal</button>
                <button className="btn-gold text-sm px-4 py-2">↗ Plan withdrawal</button>
              </div>
            </div>
          </div>

          {/* LEARNING NEST */}
          <div className="card space-y-5 text-navy max-w-xl">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <span>📚</span> YOUR LEARNING NEST
            </h2>
            <p className="text-sm text-navy/60">Start with the tiny stuff.</p>
            <Link href="/curriculum" className="text-mint-dark text-sm font-medium hover:underline">
              View all lessons →
            </Link>

            {displayModule && (
              <div className="bg-cream/70 p-5 rounded-xl space-y-3 border border-mint/30">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-medium bg-mint/30 px-2 py-1 rounded-full">
                    START HERE · {displayModule.duration_minutes} MIN
                  </span>
                  {displayProgress?.status === 'completed' && (
                    <span className="text-xs text-green-600">✅ Completed</span>
                  )}
                </div>
                <h3 className="font-bold text-lg">{displayModule.title}</h3>
                <p className="text-sm text-navy/70 line-clamp-2">
                  {displayModule.description || 'Learn the basics of forex.'}
                </p>
                <div className="flex items-center gap-2">
                  <progress
                    value={displayProgress?.percent_complete || 0}
                    max="100"
                    className="w-full h-2 rounded-full bg-mint/30 [&::-webkit-progress-value]:bg-mint-dark"
                  />
                  <span className="text-xs font-medium">
                    {displayProgress?.percent_complete || 0}%
                  </span>
                </div>
                <Link
                  href={`/learn/${displayModule.slug}`}
                  className="inline-block btn-primary text-sm px-4 py-2 mt-2"
                >
                  {displayProgress?.status === 'completed' ? 'Review →' : 'Continue lesson →'}
                </Link>
              </div>
            )}

            {/* Additional tiny lesson teaser */}
            {modules.length > 1 && (
              <div className="border-t border-mint/20 pt-3 mt-2 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-navy/50">TINY LESSON · 5 MIN</span>
                  <span className="text-xs text-navy/50">Reading a price</span>
                  <Link href={`/learn/${modules[1]?.slug}`} className="text-mint-dark text-sm hover:underline">
                    Open lesson →
                  </Link>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-navy/50">TINY LESSON · 7 MIN</span>
                  <span className="text-xs text-navy/50">Risk is not a bad word</span>
                  <Link href={`/learn/${modules[2]?.slug}`} className="text-mint-dark text-sm hover:underline">
                    Open lesson →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional row: Practice Corner (from screenshot) */}
        <div className="px-6 sm:px-10 lg:px-16 py-20 max-w-7xl mx-auto">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>📡</span> PRACTICE CORNER
          </h3>
          <p className="text-sm text-navy/60">
            Signals without the shouting. Educational market ideas for your learning journal. No signal can promise profit.
          </p>
          <div className="flex flex-wrap gap-3 mt-4 text-sm font-semibold">
            <span className="bg-mint/20 text-mint-dark px-4 py-2 rounded-full">EUR/USD</span>
            <span className="bg-mint/20 text-mint-dark px-4 py-2 rounded-full">GBP/USD</span>
            <span className="bg-mint/20 text-mint-dark px-4 py-2 rounded-full">USD/NGN</span>
          </div>
        </div>

        {/* Quick stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6 sm:px-10 lg:px-16 pb-16 max-w-7xl mx-auto">
          <div className="card text-center">
            <p className="text-xs text-navy/60">Modules</p>
            <p className="text-2xl font-bold">{completedCount} / {modules.length}</p>
          </div>
          <div className="card text-center">
            <p className="text-xs text-navy/60">Streak</p>
            <p className="text-2xl font-bold">🔥 {streak.current_streak}</p>
          </div>
          <div className="card text-center">
            <p className="text-xs text-navy/60">Balance</p>
            <p className="text-2xl font-bold text-gold">{formatCurrency(wallet.balance)}</p>
          </div>
          <div className="card text-center">
            <p className="text-xs text-navy/60">Total Earned</p>
            <p className="text-2xl font-bold">{formatCurrency(wallet.total_earned)}</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}