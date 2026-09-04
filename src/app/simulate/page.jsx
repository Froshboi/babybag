'use client';

import { useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { SimulatorChart } from '@/components/SimulatorChart';

const STARTING_BALANCE = 10000;
const scenarios = [
  {
    title: 'London lift',
    lesson: 'Momentum is building',
    candles: [
      { time: '09:00', price: 1.0842 }, { time: '09:15', price: 1.0851 },
      { time: '09:30', price: 1.0847 }, { time: '09:45', price: 1.0862 },
      { time: '10:00', price: 1.0871 }, { time: '10:15', price: 1.0868 },
      { time: '10:30', price: 1.0881 }, { time: '10:45', price: 1.0894 },
      { time: '11:00', price: 1.0902 },
    ],
  },
  {
    title: 'Quiet pullback',
    lesson: 'Support is being tested',
    candles: [
      { time: '13:00', price: 1.0910 }, { time: '13:15', price: 1.0904 },
      { time: '13:30', price: 1.0898 }, { time: '13:45', price: 1.0901 },
      { time: '14:00', price: 1.0894 }, { time: '14:15', price: 1.0897 },
      { time: '14:30', price: 1.0905 }, { time: '14:45', price: 1.0912 },
      { time: '15:00', price: 1.0918 },
    ],
  },
  {
    title: 'Fast reversal',
    lesson: 'Sellers are taking control',
    candles: [
      { time: '16:00', price: 1.0874 }, { time: '16:15', price: 1.0882 },
      { time: '16:30', price: 1.0879 }, { time: '16:45', price: 1.0871 },
      { time: '17:00', price: 1.0863 }, { time: '17:15', price: 1.0867 },
      { time: '17:30', price: 1.0854 }, { time: '17:45', price: 1.0849 },
      { time: '18:00', price: 1.0841 },
    ],
  },
];

export default function Simulate() {
  const [round, setRound] = useState(0);
  const [side, setSide] = useState('');
  const [amount, setAmount] = useState(1000);
  const [result, setResult] = useState(null);
  const [score, setScore] = useState(0);
  const [balance, setBalance] = useState(STARTING_BALANCE);
  const scenario = scenarios[round % scenarios.length];
  const candles = scenario.candles;
  const entry = candles[0].price;
  const exit = candles[candles.length - 1].price;
  const move = useMemo(() => ((exit - entry) / entry) * 100, [exit, entry]);
  const pnl = side ? amount * (move / 100) * (side === 'buy' ? 1 : -1) : 0;

  const submitTrade = () => {
    if (!side || amount < 100 || amount > balance) return;
    setResult({ pnl, won: pnl > 0 });
    setBalance((current) => Math.max(0, current + pnl));
    if (pnl > 0) setScore((current) => current + 1);
  };

  const nextRound = () => {
    setRound((current) => current + 1);
    setSide('');
    setResult(null);
    setAmount(1000);
  };

  return (
    <ProtectedRoute>
      <div className="space-y-8 px-6 sm:px-0">
        <div>
          <p className="eyebrow">Practice corner · no real money</p>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="section-title text-4xl md:text-5xl">📈 Paper Trading Lab</h1>
              <p className="text-navy/60 max-w-2xl">Use the free lessons to make one risk-aware EUR/USD trade. The chart is a replay, so the outcome is fair and repeatable.</p>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 shadow-sm border border-black/5">
              <p className="text-xs uppercase tracking-wider text-navy/50">Practice score</p>
              <p className="text-2xl font-bold text-mint-dark">{score} / {round}</p>
            </div>
          </div>
        </div>
        <div className="grid lg:grid-cols-[1fr_320px] gap-6 items-start">
          <SimulatorChart data={candles} />
          <div className="card border-t-4 border-t-mint">
            <p className="eyebrow">Demo account</p>
            <p className="text-3xl font-bold mt-2">${balance.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            <p className="text-sm text-navy/60 mt-1">EUR/USD · entry {entry.toFixed(4)}</p>
            <div className="rounded-xl bg-cream/70 p-3 mt-4">
              <p className="text-xs uppercase tracking-wider text-navy/50">Round {round + 1} · {scenario.title}</p>
              <p className="font-semibold mt-1">{scenario.lesson}</p>
              <p className="text-xs text-navy/60 mt-1">Replay move: {move >= 0 ? '+' : ''}{move.toFixed(2)}%</p>
            </div>
            <label className="block text-sm font-semibold mt-6">Position size ($)</label>
            <input className="field mt-2" type="number" min="100" max={balance} step="100" value={amount} onChange={(event) => setAmount(Number(event.target.value))} />
            <p className="text-xs text-navy/50 mt-2">Keep risk small while you practise. Never risk money you cannot afford to lose.</p>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setSide('buy')} className={`btn-gold flex-1 ${side === 'buy' ? 'ring-2 ring-navy' : ''}`}>Buy</button>
              <button onClick={() => setSide('sell')} className={`btn-primary flex-1 ${side === 'sell' ? 'ring-2 ring-gold' : ''}`}>Sell</button>
            </div>
            <button disabled={!side} onClick={submitTrade} className="btn-primary w-full mt-4 disabled:opacity-40">Close at replay end →</button>
            {result && <p className={`mt-4 font-bold ${result.won ? 'text-green-600' : 'text-red-500'}`}>{result.won ? '🎉' : '❌'} {result.won ? 'Profitable trade' : 'Loss accepted'}: {result.pnl >= 0 ? '+' : '-'}${Math.abs(result.pnl).toFixed(2)}</p>}
            {result && <button onClick={nextRound} className="btn-gold w-full mt-3">Try the next replay →</button>}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
