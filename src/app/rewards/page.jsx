import { createServerSupabase } from '@/lib/supabase/server';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { formatCurrency } from '@/lib/utils';

async function getRewards(userId) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from('reward_claims')
    .select('id, amount_bb, claimed_at, reward_rules(description)')
    .eq('user_id', userId)
    .order('claimed_at', { ascending: false });
  return data || [];
}

export default async function Rewards() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const rewards = await getRewards(user.id);

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div><p className="eyebrow">Little wins add up</p><h1 className="section-title text-4xl">🎁 Rewards Ledger</h1></div>
        <div className="card">
          {rewards.length === 0 ? (
            <div className="text-center py-10"><div className="text-5xl mb-3">🐣</div><p className="text-navy/60">No rewards yet. Complete modules to earn!</p></div>
          ) : (
            <ul className="divide-y divide-mint/20">
              {rewards.map((r) => (
                <li key={r.id} className="py-4 flex justify-between gap-4">
                  <span>{r.reward_rules?.description || 'Babybags reward'}</span>
                  <span className="text-gold font-bold">+{formatCurrency(r.amount_bb)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}