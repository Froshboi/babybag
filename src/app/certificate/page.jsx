import { createServerSupabase } from '@/lib/supabase/server';
import { ProtectedRoute } from '@/components/ProtectedRoute';

async function getCertificateStatus(userId) {
  const supabase = createServerSupabase();
  const { data } = await supabase
    .from('user_progress')
    .select('module_id, completed')
    .eq('user_id', userId)
    .eq('completed', true);
  return (data?.length || 0) >= 40; // all 40 modules completed
}

export default async function Certificate() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const eligible = await getCertificateStatus(user.id);

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div><p className="eyebrow">A milestone worth keeping</p><h1 className="section-title text-4xl">🎓 Certificate</h1></div>
        {eligible ? (
          <div className="card border-t-4 border-t-gold">
            <div className="text-6xl mb-4">🏆</div>
            <h2 className="text-2xl font-bold">You're a BabyBags Graduate!</h2>
            <p className="mt-2 text-navy/60">Download your shareable certificate below.</p>
            <button className="btn-gold mt-4">Download PDF</button>
          </div>
        ) : (
          <div className="card">
            <div className="text-5xl mb-4">🐣</div>
            <p className="text-navy/60">Complete all 40 modules to unlock your certificate.</p>
            <progress value={0} max={40} className="w-full mt-2" />
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}