"use client";
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Leaderboard() {
  type LeaderboardEntry = {
    userId: number;
    name: string;
    totalScore: number;
  };

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/leaderboard");
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const json = await res.json();
        console.log(json.leaderboard);
        setLeaderboard(json.leaderboard || []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!leaderboard.length) return <p className="text-center mt-10">No leaderboard data available.</p>;

  return (
    <div className="min-h-screen py-12 px-4" style={{ backgroundColor: "#F2F2F2" }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2" style={{ color: "#3C3E40" }}>
            Leaderboard
          </h1>
          <p className="text-base" style={{ color: "#6E7073" }}>
            Top performers ranked by quiz points
          </p>
        </div>

        {/* Trophy for top performer */}
        <div className="mb-8 flex flex-col items-center">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mb-3"
            style={{ backgroundColor: "#D97904" }}
          >
            <span className="text-4xl">🏆</span>
          </div>
          <h2 className="text-xl font-bold" style={{ color: "#3C3E40" }}>
            {leaderboard[0].name}
          </h2>
          <p className="font-semibold text-lg" style={{ color: "#D97904" }}>
            {leaderboard[0].totalScore} points
          </p>
        </div>

        {/* Leaderboard table */}
        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b" style={{ borderColor: "#F2F2F2" }}>
            <div className="flex justify-between items-center">
              <span className="font-medium" style={{ color: "#6E7073" }}>Rank</span>
              <span className="font-medium" style={{ color: "#6E7073" }}>Player</span>
              <span className="font-medium" style={{ color: "#6E7073" }}>Score</span>
            </div>
          </div>

          {leaderboard.map((user, index) => (
            <div
              key={user.userId}
              className="px-6 py-4 border-b last:border-0 transition-all hover:bg-gray-50"
              style={{ borderColor: "#F2F2F2" }}
            >
              <div className="flex justify-between items-center">
                {/* Rank with medal for top 3 */}
                <div className="flex items-center gap-3">
                  {index < 3 ? (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white"
                      style={{
                        backgroundColor: index === 0 ? "#D97904" :
                          index === 1 ? "#6E7073" :
                            "#A0745C"
                      }}
                    >
                      {index + 1}
                    </div>
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center font-semibold" style={{ color: "#6E7073" }}>
                      {index + 1}
                    </div>
                  )}
                </div>

                {/* Player name */}
                <div className="flex-1 text-center">
                  <span className="font-medium" style={{ color: "#3C3E40" }}>
                    {user.name}
                  </span>
                </div>

                {/* Score */}
                <div className="flex items-center">
                  <div className="flex flex-col items-end">
                    <span className="font-bold" style={{ color: index === 0 ? "#D97904" : "#3C3E40" }}>
                      {user.totalScore}
                    </span>
                    <span className="text-xs" style={{ color: "#6E7073" }}>points</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom actions */}
        <div className="mt-8 flex justify-center space-x-4">
          <Link
            href="/"
            className="px-6 py-3 rounded-lg font-medium transition-all"
            style={{ backgroundColor: "#6E7073", color: "white" }}
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
