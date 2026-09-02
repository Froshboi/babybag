import { createServerSupabase } from '@/lib/supabase/server';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { formatCurrency } from '@/lib/utils';

async function getAdminData() {
  const supabase = createServerSupabase();
  const [withdrawals, users] = await Promise.all([
    supabase
      .from('withdrawal_requests')
      .select('*, users(full_name, email)')
      .eq('status', 'pending')
      .order('created_at', { ascending: true }),
    supabase.from('users').select('id, full_name, email', { count: 'exact' }),
  ]);
  return { withdrawals: withdrawals.data || [], userCount: users.count || 0 };
}

export default async function Admin() {
  const { withdrawals, userCount } = await getAdminData();

  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div><p className="eyebrow">Keep the nest tidy</p><h1 className="section-title text-4xl">🛠 Admin</h1></div>
        <div className="card mb-6 border-t-4 border-t-mint">
          <p className="text-sm text-navy/60">Total Users</p>
          <p className="text-3xl font-bold">{userCount}</p>
        </div>
        <h2 className="text-xl font-bold mb-4">Pending withdrawals</h2>
        {withdrawals.length === 0 ? (
          <div className="card text-center py-10"><div className="text-4xl mb-2">🐣</div><p className="text-navy/60">All clear ✅</p></div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((w) => (
              <div key={w.id} className="card flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
                <div>
                  <p className="font-bold">{w.users?.full_name}</p>
                  <p className="text-sm text-navy/60">{w.users?.email}</p>
                  <p className="text-gold font-bold">{formatCurrency(w.amount)}</p>
                </div>
                <div className="flex gap-2">
                  <button className="bg-green-500 text-white px-4 py-1 rounded-full text-sm">Approve</button>
                  <button className="bg-red-500 text-white px-4 py-1 rounded-full text-sm">Reject</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}