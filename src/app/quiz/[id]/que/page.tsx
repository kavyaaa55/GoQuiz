'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import styles from './page.module.css';

type Option = {
  id: number;
  text: string;
};

type Question = {
  id: number;
  question: string;
  options: Option[];
  correct: string;
};

type Quiz = {
  id: number;
  title: string;
  topic: string;
  questions: Question[];
};

export default function QuizPage() {

  const LoadingSpinner = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
    </div>
  );
  // Anti-cheat: Prevent keyboard shortcuts and developer tools
  useEffect(() => {
    // More aggressive copy-paste prevention
    const preventCopyPaste = (e: ClipboardEvent) => {
      // Prevent the default action
      e.preventDefault();
      e.stopPropagation();

      // Log attempt (can be removed in production)
      console.log('Copy/paste/cut attempt blocked');

      return false;
    };

    // Disable browser context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // Prevent keyboard shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block common copy/paste/cut shortcuts
      if (
        (e.ctrlKey && ['c', 'v', 'x', 'u', 's', 'j'].includes(e.key.toLowerCase())) ||
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'i') ||
        (e.metaKey && ['c', 'v', 'x'].includes(e.key.toLowerCase())) // For Mac users
      ) {
        e.preventDefault();
        e.stopPropagation();
        console.log('Keyboard shortcut blocked:', e.key);
        return false;
      }
    };

    // Handler for the clipboard API
    const handleClipboardRead = () => {
      // Can optionally clear clipboard here
      // navigator.clipboard.writeText('') - requires permission
      return false;
    };

    // Add all event listeners with capture phase to ensure they're triggered first
    document.addEventListener('copy', preventCopyPaste as EventListener, true);
    document.addEventListener('paste', preventCopyPaste as EventListener, true);
    document.addEventListener('cut', preventCopyPaste as EventListener, true);
    document.addEventListener('contextmenu', handleContextMenu as EventListener, true);
    document.addEventListener('keydown', handleKeyDown as EventListener, true);

    // Try to block clipboard API if available
    if (navigator.clipboard) {
      try {
        const originalReadText = navigator.clipboard.readText;
        navigator.clipboard.readText = handleClipboardRead as any;
      } catch (e) {
        console.log('Could not override clipboard API');
      }
    }

    // Disable text selection
    document.body.style.userSelect = 'none';
    document.body.style.webkitUserSelect = 'none';
    document.body.style.msUserSelect = 'none';
    document.body.style.mozUserSelect = 'none';

    // Disable drag and drop
    document.addEventListener('dragstart', (e: DragEvent) => e.preventDefault(), true);
    document.addEventListener('drop', (e: DragEvent) => e.preventDefault(), true);

    // Clean up on component unmount
    return () => {
      document.removeEventListener('copy', preventCopyPaste as EventListener, true);
      document.removeEventListener('paste', preventCopyPaste as EventListener, true);
      document.removeEventListener('cut', preventCopyPaste as EventListener, true);
      document.removeEventListener('contextmenu', handleContextMenu as EventListener, true);
      document.removeEventListener('keydown', handleKeyDown as EventListener, true);
      document.removeEventListener('dragstart', (e: DragEvent) => e.preventDefault(), true);
      document.removeEventListener('drop', (e: DragEvent) => e.preventDefault(), true);

      // Restore text selection
      document.body.style.userSelect = '';
      document.body.style.webkitUserSelect = '';
      document.body.style.msUserSelect = '';
      document.body.style.mozUserSelect = '';

      // Restore clipboard API if we modified it
      if (navigator.clipboard && typeof handleClipboardRead === 'function') {
        try {
          // Reset clipboard API if we overrode it
          navigator.clipboard.readText = originalReadText;
        } catch (e) { }
      }
    };
  }, []); const [isFullScreen, setIsFullScreen] = useState(false);
  const [fullscreenSupported, setFullscreenSupported] = useState<boolean>(true);
  const [fullscreenError, setFullscreenError] = useState<string | null>(null);
  const [currentQ, setCurrentQ] = useState<number>(0);
  const [selected, setSelected] = useState<{ id: number, text: string } | null>(null);
  const [score, setScore] = useState<number>(0);
  const [finished, setFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [points, setPoints] = useState<number>(0);
  const [hasSubmitted, setHasSubmitted] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>(null);
  const [attemptedToStart, setAttemptedToStart] = useState<boolean>(false);
  const [fullScreenExitCount, setFullScreenExitCount] = useState<number>(0);
  const [cheatingDetected, setCheatingDetected] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [loadingScore, setLoadingScore] = useState<boolean>(false);


  const params = useParams();
  const router = useRouter();
  const quizId = parseInt(params.id as string);

  // Get user from Next Auth session
  const { data: session, status } = useSession();

  // Check if fullscreen is available on this browser/device
  useEffect(() => {
    // Check if fullscreen is available in this browser
    const fullscreenAvailable =
      document.fullscreenEnabled ||
      !!(document as any).webkitFullscreenEnabled ||
      !!(document as any).mozFullScreenEnabled ||
      !!(document as any).msFullscreenEnabled;

    setFullscreenSupported(fullscreenAvailable);

    if (!fullscreenAvailable) {
      setFullscreenError("Your browser doesn't support fullscreen mode, which is required for this quiz. Please try a different browser.");
    }
  }, []);

  // Full screen detection and management
  const checkFullScreen = () => {
    const fullscreenElement =
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).mozFullScreenElement ||
      (document as any).msFullscreenElement;

    const wasFullScreen = isFullScreen;
    setIsFullScreen(!!fullscreenElement);

    // Count full screen exits if quiz is in progress
    if (wasFullScreen && !fullscreenElement && attemptedToStart && !finished && !hasSubmitted) {
      setFullScreenExitCount(prev => {
        const newCount = prev + 1;
        console.log(`Full screen exit count: ${newCount}`);

        // If user exits full screen more than 2 times (3rd exit), mark as cheating
        if (newCount >= 3) {
          console.log("Cheating detected! Setting score to 0.");
          setCheatingDetected(true);
          setScore(0);
          setPoints(0);
          // IMPORTANT: Finish the quiz immediately when cheating is detected

          setTimeout(() => finishQuiz(), 500);
        }

        return newCount;
      });

      // Try to go back to full screen
      goFullScreen();
    }
  };

  const goFullScreen = () => {
    if (!finished) {
      try {
        // Attempting to reenter fullscreen may need a timeout
        // to ensure it's not called too quickly after exit
        setTimeout(() => {
          const elem = document.documentElement;

          if (document.fullscreenEnabled ||
            (document as any).webkitFullscreenEnabled ||
            (document as any).mozFullScreenEnabled ||
            (document as any).msFullscreenEnabled) {

            setAttemptedToStart(true);

            if (elem.requestFullscreen) {
              elem.requestFullscreen().catch(err => {
                // Silently handle the error - log it but don't show alerts or console errors
                console.log("Fullscreen request silently failed, continuing quiz logic...");
                // We don't need to show an error to the user here
              });
            } else if ((elem as any).webkitRequestFullscreen) {
              (elem as any).webkitRequestFullscreen(); // Safari
            } else if ((elem as any).mozRequestFullScreen) {
              (elem as any).mozRequestFullScreen(); // Firefox
            } else if ((elem as any).msRequestFullscreen) {
              (elem as any).msRequestFullscreen(); // IE/Edge
            }
          }
        }, 300); // Small delay before attempting to reenter fullscreen
      } catch (error) {
        // Silently handle any errors in the fullscreen attempt
        console.log("Error attempting to re-enter fullscreen (handled silently)");
      }

    }
  };

  useEffect(() => {
    checkFullScreen(); // Initial check

    // Add event listeners for all vendor-prefixed fullscreen change events
    document.addEventListener('fullscreenchange', checkFullScreen);
    document.addEventListener('webkitfullscreenchange', checkFullScreen);
    document.addEventListener('mozfullscreenchange', checkFullScreen);
    document.addEventListener('MSFullscreenChange', checkFullScreen);

    // Clean up listeners on unmount
    return () => {
      document.removeEventListener('fullscreenchange', checkFullScreen);
      document.removeEventListener('webkitfullscreenchange', checkFullScreen);
      document.removeEventListener('mozfullscreenchange', checkFullScreen);
      document.removeEventListener('MSFullscreenChange', checkFullScreen);
    };
  }, [attemptedToStart, finished, isFullScreen, hasSubmitted]); // Added hasSubmitted to dependencies

  // Set user ID from session when available
  useEffect(() => {
    const fetchUserId = async () => {
      if (status === 'authenticated' && session?.user?.email) {
        try {
          // Fetch the user ID from the database using the email from the session
          const userResponse = await fetch(`/api/user?email=${encodeURIComponent(session.user.email)}`);
          const userData = await userResponse.json();

          if (userData && userData.id) {
            setUserId(userData.id);
            // Also save the email for later use
            setEmail(session.user.email || "");
          } else {
            setError('Unable to identify user. Please sign in again.');
          }
        } catch (err) {
          console.error('Error fetching user ID:', err);
          setError('Error authenticating user.');
        }
      } else if (status === 'unauthenticated') {
        // Redirect to login if not authenticated
        router.push('/api/auth/signin');
      }
    };

    fetchUserId();
  }, [status, session, router]);

  // Check if user has already submitted this quiz
  useEffect(() => {
    if (!quizId) return;

    async function checkSubmission() {
      try {
        const res = await fetch(`/api/submission/check?quizId=${quizId}`);
        const data = await res.json();

        console.log('Submission check:', data);

        if (data.hasSubmitted) {
          setHasSubmitted(true);
          setFinished(true);
          setScore(data.score);
          setPoints(data.points);
        }
      } catch (err) {
        console.error('Error checking submission status:', err);
      }
    }

    checkSubmission();
  }, [quizId]);

  useEffect(() => {
    if (!quizId) return;

    async function fetchData() {
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        const json = await res.json();
        console.log('Quiz API Response:', json);

        const selectedQuiz: Quiz = json.data;
        const mappedQuestions: Question[] = selectedQuiz.questions.map((q: any) => ({
          id: q.id,
          question: q.text,
          options: q.options,
          correct: q.answer,
        }));

        setQuiz(selectedQuiz);
        setQuestions(mappedQuestions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching quiz:', err);
        setError('Failed to load quiz.');
        setLoading(false);
      }
    }
    fetchData();
  }, [quizId]);

  // Effect for cheating detection to immediately finish quiz
  useEffect(() => {
    if (cheatingDetected && !finished) {
      console.log("Cheating detected effect triggered - finishing quiz");
      finishQuiz();
    }
  }, [cheatingDetected]);

  // Timer management
  useEffect(() => {
    if (loading || !questions.length || finished || !isFullScreen || hasSubmitted || cheatingDetected) return;

    // Clear any existing timer
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    // Start a new timer
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQ, loading, questions, finished, isFullScreen, hasSubmitted, cheatingDetected]);

  // Process when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !loading && questions.length > 0 && !finished && isFullScreen && !hasSubmitted && !cheatingDetected) {
      if (timerRef.current) clearInterval(timerRef.current);
      goToNext();
    }
  }, [timeLeft, loading, questions, finished, isFullScreen, hasSubmitted, cheatingDetected]);

  // Save the current answer
  const goToNext = () => {
    // Don't proceed if cheating was detected
    if (cheatingDetected) {
      finishQuiz();
      return;
    }

    // Save the user's answer to the database
    const saveAnswer = async () => {
      try {
        // Make sure we have the necessary data before proceeding
        // if (!quiz) {
        //   console.error('missing quiz');
        //   return;
        // }
        // if (!userId) {
        //   console.error('Missing unserid');
        //   return;
        // }
        // if (!selected) {
        //   console.error('Missing selected');
        //   return;
        // }
        // if (!questions[currentQ]) {
        //   console.error('Missing currentque');
        //   return;
        // }

        if (!quiz || !userId || !selected || !questions[currentQ]) {
          console.error('Missing required data for saving answer');
          return;
        }

        const currentQuestion = quiz.questions[currentQ];

        console.log('Saving answer with data:', {
          userId,
          questionId: currentQuestion.id,
          optionId: selected.id,
          time: timeLeft,
        });

        const res = await fetch('/api/anscount', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            questionId: currentQuestion.id,
            optionId: selected.id,
            time: timeLeft,
          }),
        });

        console.log(res);

        if (!res.ok) {
          console.error('Failed to save answer:', await res.text());
        } else {
          console.log('Answer saved successfully');
        }
      } catch (error) {
        console.error('Error saving answer:', error);
      }
    };

    // Save the current answer
    if (selected) {
      saveAnswer();
    }

    // Reset and move to next question
    setSelected(null);
    setTimeLeft(20);
    if (currentQ < questions.length - 1) {
      setCurrentQ((prev) => prev + 1);
    } else {
      finishQuiz();
    }
  };
  const saveSubmission = async () => {
    if (!quiz || submitting) return;

    // setSubmitting(true);
    // try {
    //   const res = await fetch('/api/submission', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       quizId,
    //       score: cheatingDetected ? 0 : score,
    //       points: cheatingDetected ? 0 : points,
    //       cheatingDetected,
    //       email: email // Include the user's email in the submission
    //     }),
    //   });
    //
    //   const data = await res.json();
    //   console.log('Submission saved:', data);
    //   setHasSubmitted(true);
    // } catch (err) {
    //   console.error('Error saving submission:', err);
    // } finally {
    //setSubmitting(false);
    // }
  };

  const fetchScore = async () => {
    setLoadingScore(true);
    try {
      const res = await fetch(`/api/scorecalc?quizId=${quizId}`);

      if (!res.ok) {
        throw new Error(`Failed to fetch score: ${res.status}`);
      }

      const json = await res.json();
      console.log('Score calculation results:', json);

      if (json) {
        setScore(json.score || 0);
        setPoints(json.points || 0);
      }

      if (cheatingDetected) {
        setScore(0);
        setPoints(0);
      }
    } catch (error) {
      console.error('Error fetching score:', error);
    } finally {
      setLoadingScore(false);
    }
  };


  const finishQuiz = () => {
    // Stop the timer if it's running
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    fetchScore();
    // Set finished state
    setFinished(true);


    if (!hasSubmitted) {
      saveSubmission();
    }
  };


  const viewQuizLeaderboard = () => {
    router.push(`/leaderboard?quizId=${quizId}`);
  };

  if (loading || status === 'loading') {
    return <div className="p-4 text-center">Loading quiz...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="p-4 text-center">
        <p className="mb-4">Please sign in to continue</p>
        <Link href="/api/auth/signin" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Sign In
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center text-red-500">
        {error}
        <Link href="/" className="block mt-4 text-blue-500 hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  if (fullscreenError) {
    return (
      <div className="p-4 text-center">
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
          <p className="font-bold">Browser Compatibility Issue</p>
          <p>{fullscreenError}</p>
        </div>
        <Link href="/" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Return Home
        </Link>
      </div>
    );
  }

  // If already submitted, show results immediately
  if (hasSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F2F2F2' }}>
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: score > questions.length / 2 ? '#D97904' : '#6E7073' }}>
              <span className="text-white text-2xl">
                {score > questions.length / 2 ? '🏆' : '📝'}
              </span>
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: '#3C3E40' }}>Quiz Completed</h2>
            <div className="mb-6">
              <p className="text-gray-500 mb-3">Your final score</p>
              <div className="flex items-center justify-center space-x-2">
                <span className="text-4xl font-bold" style={{ color: '#3C3E40' }}>{points}</span>
                <span className="text-gray-500">points</span>
              </div>
              <p className="text-gray-500 mt-2">You answered {score} out of {questions.length} questions correctly</p>

            </div>
            <div className="mt-8 space-y-3">
              {/* <button */}
              {/*   onClick={viewQuizLeaderboard} */}
              {/*   className="block w-full py-3 px-4 rounded-lg font-medium transition-all" */}
              {/*   style={{ backgroundColor: '#D97904', color: 'white' }} */}
              {/* > */}
              {/*   View Quiz Leaderboard */}
              {/* </button> */}
              <Link href="/leaderboard" className="block w-full py-3 px-4 rounded-lg font-medium transition-all" style={{ backgroundColor: '#A86403', color: 'white' }}>
                📊 Global Leaderboard
              </Link>
              <Link href="/" className="block w-full py-3 px-4 rounded-lg font-medium transition-all" style={{ backgroundColor: '#6E7073', color: 'white' }}>
                🏠 Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show full screen prompt if not in full screen mode and attempted to start
  if (!isFullScreen && (attemptedToStart || !hasSubmitted)) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center max-w-sm">
          <h2 className="text-xl font-bold mb-4" style={{ color: '#3C3E40' }}>Quiz Mode</h2>
          <p className="mb-4 text-lg font-medium text-gray-800">
            {fullScreenExitCount > 0
              ? `Warning: You've exited full-screen ${fullScreenExitCount} time${fullScreenExitCount !== 1 ? 's' : ''}. If you exit ${3 - fullScreenExitCount} more time${fullScreenExitCount !== 2 ? 's' : ''}, your score will be reset to zero.`
              : 'Please enter full-screen mode to continue the quiz.'}
          </p>
          {/* <div className="mb-4"> */}
          {/*   <p className="text-sm text-gray-600 mb-2">Quiz: {quiz?.title}</p> */}
          {/*   <p className="text-sm text-gray-600">Questions: {questions.length}</p> */}
          {/*   {email && <p className="text-sm text-gray-600">Results will be sent to: {email}</p>} */}
          {/* </div> */}
          <button onClick={(e) => {
            // This is crucial - the event must come directly from user interaction
            e.preventDefault();
            try {
              const elem = document.documentElement;

              if (document.fullscreenEnabled ||
                (document as any).webkitFullscreenEnabled ||
                (document as any).mozFullScreenEnabled ||
                (document as any).msFullscreenEnabled) {

                setAttemptedToStart(true);

                if (elem.requestFullscreen) {
                  elem.requestFullscreen().catch(err => {
                    // Show a user-friendly message only on the first attempt
                    console.log("Initial fullscreen error:", err.message);
                    // We can still show an alert here as it's the initial attempt
                    alert("Fullscreen mode is required for the quiz. Please ensure you allow fullscreen when prompted.");
                  });
                } else if ((elem as any).webkitRequestFullscreen) {
                  (elem as any).webkitRequestFullscreen(); // Safari
                } else if ((elem as any).mozRequestFullScreen) {
                  (elem as any).mozRequestFullScreen(); // Firefox
                } else if ((elem as any).msRequestFullscreen) {
                  (elem as any).msRequestFullscreen(); // IE/Edge
                }
              } else {
                alert("Fullscreen is not supported in your browser. Please try a different browser.");
              }
            } catch (error) {
              console.error("Error attempting to go fullscreen:", error);
              alert("Unable to enter fullscreen mode. Please try a different browser.");
            }
          }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            Start Quiz in Full-Screen
          </button>
          <div className="mt-4">
            <Link href="/" className="text-sm text-blue-600 hover:underline">
              Return Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || !questions.length) {
    return (
      <div className="p-4 text-center">
        No questions available for this quiz.
        <Link href="/" className="block mt-4 text-blue-500 hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  const progressPercentage = ((currentQ + 1) / questions.length) * 100;
  const question = questions[currentQ];

  // Check if question or options are invalid
  if (!question?.question || !question.options?.length) {
    return (
      <div className="p-4 text-center">
        Invalid question data.
        <Link href="/" className="block mt-4 text-blue-500 hover:underline">
          Return Home
        </Link>
      </div>
    );
  }

  // Render the finished screen when done or when cheating is detected
  if (finished || cheatingDetected) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F2F2F2' }}>
        <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
          <div className="text-center">
            {cheatingDetected ? (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: '#DC2626' }}>
                  <span className="text-white text-2xl">⚠️</span>
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#DC2626' }}>Cheating Detected</h2>
                <p className="text-gray-700 mb-6">
                  You exited full-screen mode too many times. For security reasons, your score has been reset to zero.
                </p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4" style={{ backgroundColor: score > questions.length / 2 ? '#D97904' : '#6E7073' }}>
                  <span className="text-white text-2xl">
                    {score > questions.length / 2 ? '🏆' : '📝'}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mb-2" style={{ color: '#3C3E40' }}>Quiz Completed!</h2>
              </>
            )}
            <div className="mb-6">
              {loadingScore ? (
                <div className="py-4">
                  <LoadingSpinner />
                  <p className="text-gray-500 mt-3">Calculating your score...</p>
                </div>
              ) : (
                <>
                  <p className="text-gray-500 mb-3">Your final score</p>
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-4xl font-bold" style={{ color: '#3C3E40' }}>{points}</span>
                    <span className="text-gray-500">points</span>
                  </div>
                  <p className="text-gray-500 mt-2">You answered {score} out of {questions.length} questions correctly</p>
                </>
              )}
            </div>
            <div className="mt-8 space-y-3">
              <button
                onClick={viewQuizLeaderboard}
                disabled={loadingScore}
                className={`block w-full py-3 px-4 rounded-lg font-medium transition-all ${loadingScore ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ backgroundColor: '#D97904', color: 'white' }}
              >
                {hasSubmitted ? 'View Quiz Leaderboard' : submitting ? 'Saving...' : 'Submit Quiz'}
              </button>
              <Link href="/leaderboard" className={`block w-full py-3 px-4 rounded-lg font-medium transition-all ${loadingScore ? 'opacity-50 pointer-events-none' : ''}`} style={{ backgroundColor: '#A86403', color: 'white' }}>
                📊 Global Leaderboard
              </Link>
              <Link href="/" className={`block w-full py-3 px-4 rounded-lg font-medium transition-all ${loadingScore ? 'opacity-50 pointer-events-none' : ''}`} style={{ backgroundColor: '#6E7073', color: 'white' }}>
                🏠 Return Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#F2F2F2' }}>
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gray-50 px-6 py-3 border-b">
          <h1 className="text-lg font-semibold text-gray-800">{quiz.title}</h1>
          <p className="text-sm text-gray-500">Topic: {quiz.topic}</p>
          {email && <p className="text-xs text-gray-400">User: {email}</p>}
        </div>
        <div className="w-full h-1.5 bg-gray-200">
          <div className="h-full transition-all duration-300" style={{ width: `${progressPercentage}%`, backgroundColor: '#D97904' }}></div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-medium" style={{ color: '#6E7073' }}>
              Question {currentQ + 1}/{questions.length}
            </span>
            <div className="flex items-center">
              <div className={`flex items-center justify-center h-8 w-8 rounded-full ${timeLeft > 5 ? 'bg-green-100' : 'bg-red-100'}`}>
                <span className={`text-sm font-semibold ${timeLeft > 5 ? 'text-green-600' : 'text-red-600'}`}>
                  {timeLeft}
                </span>
              </div>
              <span className="ml-2 text-sm" style={{ color: '#6E7073' }}>seconds</span>
            </div>
          </div>
          <h2 className="text-xl font-semibold mb-6" style={{ color: '#3C3E40' }}>
            {question.question}
          </h2>
          <div className="space-y-3 mb-6">
            {question.options.map((opt, index) => (
              <div
                key={`${opt.text}-${index}`}
                onClick={() => setSelected({ id: opt.id, text: opt.text })}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${selected?.text === opt.text ? 'border-2 shadow-sm' : 'border hover:border-gray-300'}`}
                style={{
                  borderColor: selected?.text === opt.text ? '#D97904' : '#E5E7EB',
                  backgroundColor: selected?.text === opt.text ? 'rgba(217, 121, 4, 0.05)' : 'white',
                }}
              >
                <div className="flex items-center">
                  <div className={`w-5 h-5 flex items-center justify-center rounded-full mr-3 border ${selected?.text === opt.text ? 'border-0' : 'border-gray-300'}`} style={{ backgroundColor: selected?.text === opt.text ? '#D97904' : 'white' }}>
                    {selected?.text === opt.text && <div className="w-2 h-2 rounded-full bg-white"></div>}
                  </div>
                  <span style={{ color: selected?.text === opt.text ? '#3C3E40' : '#6E7073' }}>{opt.text}</span>
                </div>
              </div>
            ))}
          </div>
          <button
            disabled={!selected || submitting}
            onClick={() => {
              if (timerRef.current) clearInterval(timerRef.current);
              goToNext();
            }}
            className={`w-full py-3 rounded-lg font-medium transition-all ${!selected || submitting ? 'cursor-not-allowed' : 'hover:shadow-md'}`}
            style={{
              backgroundColor: selected && !submitting ? '#D97904' : '#6E7073',
              opacity: selected && !submitting ? 1 : 0.5,
              color: 'white',
            }}
          >
            {submitting ? 'Submitting...' : currentQ === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          </button>
        </div>
      </div>
    </div>
  );
}
