
'use client';

import { useState } from 'react';

export default function SeedPage() {
  const [status, setStatus] = useState('Not started');

  const handleSeed = async () => {
    setStatus('Seeding...');
    try {
      const res = await fetch('/api/seed');
      const data = await res.json();
      if (res.ok) {
        setStatus(data.message);
      } else {
        setStatus('Error: ' + data.error);
      }
    } catch (err) {
      setStatus('Error seeding database');
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database Seeding</h1>
      <p className="mb-4">Status: {status}</p>
      <button
        onClick={handleSeed}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        disabled={status === 'Seeding...'}
      >
        Run Seeding
      </button>
    </div>
  );
}
