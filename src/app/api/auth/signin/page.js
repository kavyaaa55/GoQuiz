// src/app/auth/signin/page.js
'use client'

import { useEffect, useState } from 'react';
import { getProviders, signIn } from "next-auth/react";

export default function SignIn() {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    const setUpProviders = async () => {
      const providers = await getProviders();
      setProviders(providers);
    };
    setUpProviders();
  }, []);

  if (!providers) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="flex flex-col items-center justify-center w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Sign In</h1>

        {Object.values(providers).map((provider) => (
          <div key={provider.name} className="w-full mb-3">
            <button
              onClick={() => signIn(provider.id, { callbackUrl: '/' })}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Sign in with {provider.name}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
