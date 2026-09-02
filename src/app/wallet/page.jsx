import { createServerSupabase } from '@/lib/supabase/server';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { TopUpButton } from '@/components/TopUpButton';

async function getWallet(userId) {
  const supabase = createServerSupabase();
  const { data, error } = await supabase
    .from('wallets')
    .select('spendable_bb, total_earned_bb')
    .eq('user_id', userId)
    .single();
  return {
    wallet: data
      ? { balance: data.spendable_bb, total_earned: data.total_earned_bb, total_withdrawn: 0 }
      : { balance: 0, total_earned: 0, total_withdrawn: 0 },
    error,
  };
}

export default async function Wallet() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { wallet, error } = await getWallet(user.id);

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto space-y-8">
        <div><p className="eyebrow">Your rewards, in one place</p><h1 className="section-title text-4xl md:text-5xl">💰 Wallet</h1></div>
        <div className="card bg-navy text-cream border-0">
          <p className="text-sm text-cream/60">Available balance</p>
          <p className="text-5xl font-bold text-gold mt-2">{formatCurrency(wallet.balance)}</p>
          <div className="grid grid-cols-2 gap-4 mt-7 text-sm text-cream/70">
            <span>Total earned <strong className="block text-cream text-lg mt-1">{formatCurrency(wallet.total_earned)}</strong></span>
            <span>Withdrawn <strong className="block text-cream text-lg mt-1">{formatCurrency(wallet.total_withdrawn)}</strong></span>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Link href="/wallet/withdraw" className="btn-gold">Withdraw</Link>
          <TopUpButton />
        </div>
        {error && <div className="card border-l-4 border-l-red-400"><h2 className="font-bold">Wallet data is unavailable</h2><p className="text-sm text-navy/60 mt-1">Supabase could not return your wallet. Check the deployment environment variables and database schema.</p></div>}
        <div className="card"><div className="flex justify-between items-center mb-4"><h2 className="text-xl font-bold">Recent transactions</h2><span className="tag">Coming soon</span></div><p className="text-sm text-navy/60">Your deposits and rewards will appear here as your nest grows.</p></div>
      </div>
    </ProtectedRoute>
  );
}