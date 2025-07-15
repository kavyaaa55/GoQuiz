
'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function QuizPage() {
  const { status } = useSession();
  const [agreed, setAgreed] = useState(false);
  const params = useParams();
  const quizId = params.id;

  if (status === 'unauthenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center bg-white p-10 rounded-lg shadow-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
          <p className="mb-6">You must be logged in to access this quiz</p>
          <p className="mb-6">Login karle bhai, Badi mehenat se Auth dala hai :)</p>
          <Link
            href="/api/auth/signin"
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md transition"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 flex justify-center items-center">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-lg p-8 relative">
        <div className="absolute top-4 right-4 bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
          Quiz #{quizId}
        </div>

        <h2 className="text-2xl font-bold mb-2 text-gray-800">Ready to Begin?</h2>
        <p className="text-gray-600 mb-6">Complete this challenge to test your knowledge.</p>

        <div className="bg-gray-100 border-l-4 border-yellow-500 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Quiz Instructions</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>You can only attempt the quiz once</li>
            <li>This quiz contains 25 questions</li>
            <li>You have 10 minutes to complete it</li>
            <li>You get 20 seconds to asnwer each quetion</li>
            <li>Each correct answer, point rewarded would be according to time</li>
            <li>No negative marking</li>
            <li>You need to keep your screen if fullscreen during the whole quiz</li>
            <li>more than 3 attempts to change screen will assign zero score</li>
            <li> disable any popups</li>
            <li> asnwers would no be saved if exited quiz in between</li>
          </ul>

          <div className="flex items-center mt-4 p-3 bg-white rounded-md shadow-sm">
            <span className="text-xl mr-3">⏱️</span>
            <div>
              <div className="text-sm text-gray-500">Time Limit</div>
              <div className="text-base font-semibold text-gray-800">10 Minutes</div>
            </div>
          </div>
        </div>

        <label className="flex items-start space-x-2 mb-6">
          <input
            type="checkbox"
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
          />
          <span className="text-gray-800 text-sm">
            I have read and agree to the instructions
          </span>
        </label>

        {agreed ? (
          <Link
            href={`/quiz/${quizId}/que`}
            className="w-full block text-center bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-3 rounded-md transition"
          >
            Start Quiz
          </Link>
        ) : (
          <button
            className="w-full bg-gray-400 text-white font-semibold py-3 rounded-md cursor-not-allowed"
            disabled
          >
            Start Quiz
          </button>
        )}

        <Link
          href="/"
          className="block mt-4 text-sm text-center text-gray-600 hover:underline"
        >
          ← Back to quiz selection
        </Link>
      </div>
    </div>
  );
}
