'use client';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export const Quiz = ({ quiz, moduleId, userId }) => {
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const supabase = createClient();

  const questions = quiz.questions || [];

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selected[q.id] === q.correct_answer_index) correct++;
    });
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);

    await supabase
      .from('module_progress')
      .upsert({
        user_id: userId,
        module_id: moduleId,
        status: 'completed',
        percent_complete: 100,
        completed_at: new Date().toISOString(),
      })
      .select();

    if (pct >= 70) {
      await supabase.rpc('claim_module_reward', { p_user_id: userId, p_module_id: moduleId });
    }
  };

  if (submitted) {
    return (
      <div className="card mt-6 border-t-4 border-t-gold">
        <p className="eyebrow">Quiz complete</p>
        <h3 className="text-2xl font-bold mt-2">📊 Results</h3>
        <p className={`text-2xl font-bold ${score >= 70 ? 'text-green-500' : 'text-red-500'}`}>
          {score}% {score >= 70 ? '🎉 Passed!' : '😅 Try again'}
        </p>
        {score >= 70 && <p className="text-mint-dark">Reward claimed! Check your wallet.</p>}
      </div>
    );
  }

  return (
    <div className="card mt-6">
      <p className="eyebrow">Tiny knowledge check</p>
      <h3 className="text-2xl font-bold mt-2 mb-5">📝 Check your understanding</h3>
      {questions.map((q, idx) => (
        <div key={q.id} className="mb-6 rounded-xl bg-cream/70 p-4">
          <p className="font-semibold">{idx + 1}. {q.question_text}</p>
          <div className="space-y-2 mt-3">
            {q.options.map((opt, oi) => (
              <label key={oi} className="flex items-center gap-2 rounded-lg bg-white/70 p-2 text-sm cursor-pointer hover:bg-mint/20">
                <input
                  type="radio"
                  name={`q${q.id}`}
                  value={oi}
                  onChange={() => setSelected({ ...selected, [q.id]: oi })}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </div>
        </div>
      ))}
      <button onClick={handleSubmit} className="btn-primary mt-4">Submit Quiz</button>
    </div>
  );
};