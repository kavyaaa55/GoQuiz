
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

type Quiz = {
  id: number;
  title: string;
  topic: string;
  createdAt: string;
  questionsCount: number;
  questions: { id: number }[];
};

export default function Home() {
  const { data: session, status } = useSession();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const res = await fetch("/api/quiz");

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const json = await res.json();
        setQuizzes(json.data || []);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
        setError("Failed to load quizzes. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-800">Loading quizzes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 p-6 bg-white shadow-lg rounded-xl border-l-4" style={{ borderLeftColor: "#D97904" }}>
          <h1 className="text-3xl font-bold mb-4 text-gray-800">Welcome to Go Quiz</h1>
          {session ? (
            <>
              <p className="text-gray-700">Signed in as <strong>{session.user?.email}</strong></p>
              {/* <p className="text-grey-700">Points : <strong>{session.user?.points}</strong></p> */}
              {/* <button */}
              {/*   onClick={() => signOut()} */}
              {/*   className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg font-medium transition hover:shadow-md" */}
              {/* > */}
              {/*   Sign Out */}
              {/* </button> */}
            </>
          ) : (
            <>
              <p className="text-gray-700">You are not signed in.</p>
              {/* <button */}
              {/*   onClick={() => signIn()} */}
              {/*   className="mt-4 w-full py-2 bg-blue-600 text-white rounded-lg font-medium transition hover:shadow-md" */}
              {/* > */}
              {/*   Sign In */}
              {/* </button> */}
            </>
          )}

          {/* Brand Tag */}
          <div className="mt-8 p-4 rounded-lg bg-gray-100">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
              <span className="text-sm font-medium text-gray-500">Quiz Platform</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">Test your knowledge with our interactive quizzes</p>
          </div>

          {/* Leaderboard Link */}
          <div className="mt-6">
            <Link
              href="/leaderboard"
              className="block w-full py-3 text-center text-white rounded-lg font-medium transition hover:shadow-md bg-gray-600"
            >
              View Leaderboard
            </Link>
          </div>
        </div>

        {/* Quiz List */}
        <div className="flex-1 p-6 bg-white shadow-lg rounded-xl">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Available Quizzes</h2>

          {quizzes.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No quizzes available at the moment.</p>
          ) : (
            <div className="space-y-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center border p-4 rounded-lg hover:shadow-md transition-all"
                  style={{ borderColor: "#6E7073", borderWidth: "1px" }}
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{quiz.title}</h3>
                    <p className="text-sm text-gray-500">{quiz.topic}</p>
                    <div className="mt-1 text-xs text-gray-500">{quiz.questionsCount} questions</div>
                  </div>
                  <Link
                    href={`/quiz/${quiz.id}`}
                    className="mt-3 md:mt-0 px-5 py-2 text-white rounded-lg font-medium transition-all hover:shadow-md text-center"
                    style={{ backgroundColor: "#D97904" }}
                  >
                    Take Quiz
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Categories */}
          {/* <div className="mt-8"> */}
          {/*   <h3 className="text-lg font-medium mb-3 text-gray-800">Popular Categories</h3> */}
          {/*   <div className="flex flex-wrap gap-2"> */}
          {/*     {["Mathematics", "Science", "History", "Literature", "Geography", "Technology"].map((category, idx) => ( */}
          {/*       <span */}
          {/*         key={idx} */}
          {/*         className="px-3 py-1 text-sm rounded-full cursor-pointer" */}
          {/*         style={{ */}
          {/*           backgroundColor: idx % 2 === 0 ? "#F2F2F2" : "#6E7073", */}
          {/*           color: idx % 2 === 0 ? "#3C3E40" : "#F2F2F2" */}
          {/*         }} */}
          {/*       > */}
          {/*         {category} */}
          {/*       </span> */}
          {/*     ))} */}
          {/*   </div> */}
          {/* </div> */}
        </div>
      </div>
    </main>
  );
}
