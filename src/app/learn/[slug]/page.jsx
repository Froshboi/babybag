import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Quiz } from '@/components/Quiz';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import curriculum from '@/data/curriculum.json';

export default function LearnPage({ params }) {
  const module = curriculum.modules.find((item) => item.slug === params.slug);

  if (!module) return notFound();

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
        {!module.is_free ? (
          <div className="card border-l-4 border-l-gold bg-gold/10">
            <p className="eyebrow">Premium lesson</p>
            <h2 className="text-2xl font-bold mt-2">Unlock the next level</h2>
            <p className="text-navy/70 mt-2">You have access to lessons 1–3 and the paper simulator. Unlock this lesson for {module.cost_bb} BB when you are ready to go deeper.</p>
            <Link href="/wallet" className="btn-gold mt-5">View my BB wallet →</Link>
          </div>
        ) : (
        <>
        <div className="card prose prose-navy max-w-none prose-headings:text-navy prose-a:text-mint-dark prose-strong:text-navy">
          {module.content.split('\n').map((paragraph, index) => <p key={index}>{paragraph}</p>)}
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
        {module.quiz?.length > 0 && (
          <Quiz quiz={{ questions: module.quiz }} moduleId={module.id} />
        )}
        </>
        )}

        {/* Navigation */}
        <div className="flex flex-wrap justify-between gap-3 items-center pt-5 border-t border-mint/20">
          <span className="text-sm text-navy/60">
            {module.is_free ? 'Free lesson · complete the check to continue' : `Unlock for ${module.cost_bb} BB`}
          </span>
          <Link href="/curriculum" className="text-mint-dark hover:underline text-sm font-medium">
            ← Back to Field Guide
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  );
}