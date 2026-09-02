import { createServerSupabase } from '@/lib/supabase/server';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import Link from 'next/link';

async function getCurriculum(userId) {
  const supabase = createServerSupabase();
  const [modulesRes, progressRes] = await Promise.all([
    supabase
      .from('modules')
      .select('*')
      .order('phase_order', { ascending: true })
      .order('module_order', { ascending: true }),
    supabase
      .from('module_progress')
      .select('module_id, status')
      .eq('user_id', userId),
  ]);
  return {
    modules: modulesRes.data || [],
    progress: progressRes.data || [],
    error: modulesRes.error || progressRes.error || null,
  };
}

export default async function Curriculum() {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { modules, progress, error } = await getCurriculum(user.id);

  // Group by phase for the "Field Guide" style – we'll just list all modules with phase headings
  // But the screenshot shows a clean 6‑module grid (one per phase). We'll display all 40, but style the first 6 as a "field guide" and the rest below.
  const fieldGuideModules = modules.slice(0, 6); // first six for the main grid
  const restModules = modules.slice(6);

  return (
    <ProtectedRoute>
      <div className="space-y-10 bg-[#f1f8f1] -mx-0 px-6 sm:px-10 lg:px-16 py-12">
        <div>
          <p className="eyebrow">Your learning path</p>
          <h1 className="section-title text-4xl md:text-5xl">📖 BABYBAGS FIELD GUIDE</h1>
        </div>
        <p className="text-navy/60 max-w-2xl -mt-6 leading-relaxed">
          Six tiny modules. One clear path. Original educational material based on your Babybags Forex Guide. Learn at your pace, then check your understanding.
        </p>

        {error && (
          <div className="card border-l-4 border-l-red-400 max-w-2xl">
            <h2 className="font-bold">Your field guide is still loading</h2>
            <p className="text-sm text-navy/60 mt-1">Supabase could not return the module list. Check that the project URL and public key in your deployment match the Supabase project.</p>
          </div>
        )}

        {!error && modules.length === 0 && (
          <div className="card text-center max-w-2xl mx-auto py-12"><div className="text-5xl mb-3">🐣</div><h2 className="text-2xl font-bold">Your field guide is empty</h2><p className="text-navy/60 mt-2">Run the Babybags seed SQL in this Supabase project, then refresh.</p></div>
        )}

        {/* 3‑column grid for the six main modules */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-7xl mx-auto">
          {fieldGuideModules.map((mod, idx) => {
            const prog = progress.find((p) => p.module_id === mod.id);
            const completed = prog?.status === 'completed';
            return (
              <div key={mod.id} className={`card hover:-translate-y-1 hover:shadow-xl transition-all ${idx === 0 ? 'bg-[#21664f] text-white' : ''}`}>
                <div className="flex items-start justify-between">
                    <span className={`text-3xl font-bold font-mono ${idx === 0 ? 'text-gold' : 'text-[#21664f]'}`}>
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  {completed && <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">✅ Done</span>}
                </div>
                <h3 className="font-bold text-lg mt-1">{mod.title}</h3>
                <p className="text-sm text-navy/60 mt-1">{mod.description}</p>
                <div className="mt-4 flex justify-between items-center">
                    <span className="text-xs bg-navy/5 px-3 py-1 rounded-full">⏱ {mod.duration_minutes} min</span>
                  <Link
                    href={`/learn/${mod.slug}`}
                    className={`${idx === 0 ? 'text-gold' : 'text-blue-600'} font-bold text-sm hover:underline`}
                  >
                    {completed ? 'Review' : 'Start →'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rest of the modules in a simpler list */}
        {restModules.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">More tiny lessons</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {restModules.map((mod) => {
                const prog = progress.find((p) => p.module_id === mod.id);
                const completed = prog?.status === 'completed';
                return (
                  <div key={mod.id} className="card p-4">
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium">{mod.title}</h4>
                      {completed && <span className="text-xs text-green-600">✅</span>}
                    </div>
                    <Link
                      href={`/learn/${mod.slug}`}
                      className="text-xs text-mint-dark hover:underline"
                    >
                      {completed ? 'Review' : 'Start'}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}