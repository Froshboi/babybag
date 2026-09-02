'use client';
import { useState, useEffect } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SimulatorChart } from '@/components/SimulatorChart';
import { createClient } from '@/lib/supabase/client';

export default function Simulate() {
  const [challenge, setChallenge] = useState(null);
  const [candles, setCandles] = useState([]);
  const [prediction, setPrediction] = useState('');
  const [result, setResult] = useState(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchChallenge = async () => {
      const { data } = await supabase
        .from('challenges')
        .select('*')
        .limit(1)
        .single();
      if (data) {
        setChallenge(data);
        const configuredCandles = data.scenario_config?.candles_data || data.scenario_config?.candles || [];
        setCandles(Array.isArray(configuredCandles) ? configuredCandles : []);
      }
    };
    fetchChallenge();
  }, []);

  const handlePredict = async () => {
    // Simulate scoring – in real app, compare to actual market move
    const isCorrect = Math.random() > 0.5;
    setResult(isCorrect ? 'win' : 'lose');
    if (isCorrect) {
      await supabase.rpc('add_challenge_reward', {
        p_user_id: (await supabase.auth.getUser()).data.user.id,
        p_challenge_id: challenge.id,
      });
    }
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div>
          <p className="eyebrow">Practice corner</p>
          <h1 className="section-title text-4xl md:text-5xl">📈 Live Simulator</h1>
          <p className="text-navy/60">Make one thoughtful call. No pressure, no real money.</p>
        </div>
        {candles.length > 0 ? (
          <>
            <SimulatorChart data={candles} />
            <div className="card border-t-4 border-t-mint">
              <p className="eyebrow">Your turn</p>
              <h3 className="text-2xl font-bold mt-2">Predict the next move</h3>
              <div className="flex gap-3 mt-5">
                <button onClick={() => setPrediction('up')} className={`btn-gold ${prediction === 'up' ? 'ring-2 ring-navy' : ''}`}>⬆ Up</button>
                <button onClick={() => setPrediction('down')} className={`btn-primary ${prediction === 'down' ? 'ring-2 ring-navy' : ''}`}>⬇ Down</button>
              </div>
              {prediction && (
                <button onClick={handlePredict} className="mt-5 btn-primary">Submit Prediction →</button>
              )}
              {result === 'win' && <p className="text-green-500 mt-2">🎉 +10 points earned!</p>}
              {result === 'lose' && <p className="text-red-500 mt-2">❌ Try again.</p>}
            </div>
          </>
        ) : (
          <div className="card text-center max-w-lg mx-auto py-12"><div className="text-6xl mb-4">🐣</div><h2 className="text-2xl font-bold">No active challenge yet</h2><p className="text-navy/60 mt-2">Your next tiny market puzzle is warming up. Check back soon.</p></div>
        )}
      </div>
    </ProtectedRoute>
  );
}