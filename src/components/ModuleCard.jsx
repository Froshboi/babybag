'use client';
import Link from 'next/link';
import { MODULE_STATUS } from '@/lib/constants';
import { cn } from '@/lib/utils';

export const ModuleCard = ({ module, index, progress }) => {
  const isCompleted = progress?.completed;
  const isStarted = progress?.started;
  const status = isCompleted ? MODULE_STATUS.COMPLETED : isStarted ? MODULE_STATUS.IN_PROGRESS : MODULE_STATUS.LOCKED;

  const locked = index > 0 && !progress; // simplified lock logic – in real app check prerequisites

  return (
    <div className={cn('card transition-all hover:-translate-y-1 hover:shadow-xl border-t-4 border-t-mint', locked && 'opacity-50 grayscale')}>
      <div className="flex justify-between items-start">
        <span className="text-sm font-mono bg-mint/20 text-mint-dark px-3 py-1 rounded-full">#{String(index + 1).padStart(2, '0')}</span>
        {isCompleted && <span className="text-green-500">✅</span>}
        {isStarted && !isCompleted && <span className="text-yellow-500">⏳</span>}
      </div>
      <h3 className="text-xl font-bold mt-2">{module.title}</h3>
      <p className="text-sm text-navy/60 mt-1">{module.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-xs bg-navy/5 px-2 py-1 rounded">{module.difficulty}</span>
        {!locked ? (
          <Link href={`/learn/${module.slug}`} className="text-mint-dark font-semibold text-sm hover:underline">
            {isCompleted ? 'Review' : 'Start →'}
          </Link>
        ) : (
          <span className="text-sm text-navy/40">🔒 Locked</span>
        )}
      </div>
    </div>
  );
};