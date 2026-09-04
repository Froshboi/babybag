'use client';
import { useState } from 'react';

export const Quiz = ({ quiz, moduleId }) => {
  const [selected, setSelected] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const questions = quiz.questions || [];

  const handleSubmit = async () => {
    let correct = 0;
    questions.forEach((q) => {
      if (selected[q.id] === q.correct_answer_index) correct++;
    });
    const pct = Math.round((correct / questions.length) * 100);
    setScore(pct);
    setSubmitted(true);

    if (pct >= 70) {
      const completed = JSON.parse(localStorage.getItem('babybags-completed-lessons') || '[]');
      if (!completed.includes(moduleId)) {
        localStorage.setItem('babybags-completed-lessons', JSON.stringify([...completed, moduleId]));
      }
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
      <div className="flex items-center justify-between gap-3 mb-5 text-sm text-navy/60">
        <span>{questions.length} questions</span>
        <span>{Object.keys(selected).length} / {questions.length} answered</span>
      </div>
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
      <button onClick={handleSubmit} disabled={Object.keys(selected).length !== questions.length} className="btn-primary mt-4 disabled:opacity-40 disabled:cursor-not-allowed">Submit Quiz</button>
    </div>
  );
};