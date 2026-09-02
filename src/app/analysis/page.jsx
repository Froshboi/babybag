import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Analysis() {
  return (
    <ProtectedRoute>
      <div className="space-y-6">
        <div><p className="eyebrow">Read the room</p><h1 className="section-title text-4xl">📊 Chart Analysis Drills</h1></div>
        <div className="card border-t-4 border-t-gold">
          <div className="text-5xl mb-4">🔎</div>
          <h2 className="text-2xl font-bold">Spot the story in the chart.</h2>
          <p className="text-navy/60 mt-2">Practice identifying patterns, support/resistance, and trends.</p>
          <p className="mt-5 text-sm text-navy/60 bg-cream rounded-xl p-4">More drills coming soon — check back after completing Module 5.</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}