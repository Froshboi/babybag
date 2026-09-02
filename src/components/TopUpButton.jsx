'use client';

import { useState } from 'react';

export const TopUpButton = () => {
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/paystack/initialize', {
        method: 'POST',
        body: JSON.stringify({ amount: 1000 }),
        headers: { 'Content-Type': 'application/json' },
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } finally {
      setLoading(false);
    }
  };

  return (
    <button onClick={handleTopUp} disabled={loading} className="btn-primary">
      {loading ? 'Opening payment...' : 'Top Up ₦1,000'}
    </button>
  );
};
