import { createServerSupabase } from '@/lib/supabase/server';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Quiz } from '@/components/Quiz';
import { notFound } from 'next/navigation';

async function getLesson(slug, userId) {
  const supabase = createServerSupabase();
  const [moduleRes, progressRes] = await Promise.all([
    supabase
      .from('modules')
      .select('*, quizzes:quiz_questions(*)')
      .eq('slug', slug)
      .single(),
    supabase
      .from('module_progress')
      .select('status, percent_complete, completed_at')
      .eq('module_id', (await supabase.from('modules').select('id').eq('slug', slug).single()).data?.id)
      .eq('user_id', userId)
      .maybeSingle(),
  ]);
  if (moduleRes.error) return { module: null, progress: null };
  return { module: moduleRes.data, progress: progressRes.data };
}

export default async function LearnPage({ params }) {
  const supabase = createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  const { module, progress } = await getLesson(params.slug, user.id);

  if (!module) return notFound();

  const isCompleted = progress?.status === 'completed';

  return (
    <ProtectedRoute>
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Module header with "MODULE X - TITLE" style */}
        <div className="border-b border-mint/30 pb-6">
          <p className="text-xs uppercase tracking-wider text-mint-dark font-semibold">
            Module {module.phase_order} · {module.phase}
          </p>
          <h1 className="text-3xl md:text-4xl font-bold mt-2">{module.title}</h1>
          <p className="text-navy/60 mt-2 leading-relaxed">{module.description}</p>
        </div>

        {/* Lesson content */}
        <div className="card prose prose-navy max-w-none prose-headings:text-navy prose-a:text-mint-dark prose-strong:text-navy">
          <div dangerouslySetInnerHTML={{ __html: module.content }} />
        </div>

        {/* Key takeaways */}
        {module.key_takeaways?.length > 0 && (
          <div className="card bg-cream/70 border-l-4 border-l-gold">
            <h3 className="font-bold text-lg">💡 Key Takeaways</h3>
            <ul className="list-disc list-inside text-navy/80 space-y-1">
              {module.key_takeaways.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Quiz */}
        {module.has_quiz && module.quizzes?.length > 0 && (
          <Quiz quiz={module.quizzes[0]} moduleId={module.id} userId={user.id} />
        )}

        {/* Navigation */}
        <div className="flex flex-wrap justify-between gap-3 items-center pt-5 border-t border-mint/20">
          <span className="text-sm text-navy/60">
            {isCompleted ? '✅ Completed' : `${progress?.percent_complete || 0}% complete`}
          </span>
          <Link href="/curriculum" className="text-mint-dark hover:underline text-sm font-medium">
            ← Back to Field Guide
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}