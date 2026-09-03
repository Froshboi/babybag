'use client';

import { useState } from 'react';

export const TopUpButton = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleTopUp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        body: JSON.stringify({ amount: 1000, packType: '1000' }),
        headers: { 'Content-Type': 'application/json' },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Payment could not be started');
      const { url } = result;
      if (url) window.location.href = url;
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleTopUp} disabled={loading} className="btn-primary">
        {loading ? 'Opening payment...' : 'Top Up ₦1,000'}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
};
