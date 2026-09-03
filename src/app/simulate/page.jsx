'use client';

import { useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SimulatorChart } from '@/components/SimulatorChart';

const STARTING_BALANCE = 10000;
const candles = [
  { time: '09:00', price: 1.0842 }, { time: '09:15', price: 1.0851 },
  { time: '09:30', price: 1.0847 }, { time: '09:45', price: 1.0862 },
  { time: '10:00', price: 1.0871 }, { time: '10:15', price: 1.0868 },
  { time: '10:30', price: 1.0881 }, { time: '10:45', price: 1.0894 },
  { time: '11:00', price: 1.0902 }
];

export default function Simulate() {
  const [side, setSide] = useState('');
  const [amount, setAmount] = useState(1000);
  const [result, setResult] = useState(null);
  const entry = candles[0].price;
  const exit = candles[candles.length - 1].price;
  const move = useMemo(() => ((exit - entry) / entry) * 100, [exit, entry]);
  const pnl = side ? amount * (move / 100) * (side === 'buy' ? 1 : -1) : 0;

  const submitTrade = () => {
    if (!side || amount < 100 || amount > STARTING_BALANCE) return;
    setResult({ pnl, won: pnl > 0 });
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8">
        <div>
          <p className="eyebrow">Practice corner · no real money</p>
          <h1 className="section-title text-4xl md:text-5xl">📈 Paper Trading Lab</h1>
          <p className="text-navy/60 max-w-2xl">Use the free lessons to make one risk-aware EUR/USD trade. The chart is a replay, so the outcome is fair and repeatable.</p>
        </div>
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          <SimulatorChart data={candles} />
          <div className="card border-t-4 border-t-mint">
            <p className="eyebrow">Demo account</p>
            <p className="text-3xl font-bold mt-2">${STARTING_BALANCE.toLocaleString()}</p>
            <p className="text-sm text-navy/60 mt-1">EUR/USD · entry {entry.toFixed(4)}</p>
            <label className="block text-sm font-semibold mt-6">Position size ($)</label>
            <input className="field mt-2" type="number" min="100" max={STARTING_BALANCE} step="100" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
            <p className="text-xs text-navy/50 mt-2">Keep risk small while you practise. Never risk money you cannot afford to lose.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setSide('buy')} className={`btn-gold flex-1 ${side === 'buy' ? 'ring-2 ring-navy' : ''}`}>Buy</button>
              <button onClick={() => setSide('sell')} className={`btn-primary flex-1 ${side === 'sell' ? 'ring-2 ring-gold' : ''}`}>Sell</button>
            </div>
            <button disabled={!side} onClick={submitTrade} className="btn-primary w-full mt-4 disabled:opacity-40">Close at replay end →</button>
            {result && <p className={`mt-4 font-bold ${result.won ? 'text-green-600' : 'text-red-500'}`}>{result.won ? '🎉' : '❌'} {result.won ? 'Profitable trade' : 'Loss accepted'}: {result.pnl >= 0 ? '+' : '-'}${Math.abs(result.pnl).toFixed(2)}</p>}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
