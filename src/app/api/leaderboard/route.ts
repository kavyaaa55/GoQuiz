import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Get all users along with their quiz submissions
    const users = await prisma.user.findMany({
      include: {
        quizSubmissions: true,
      },
    });

    const leaderboard = [];

    // Loop through each user
    for (const user of users) {
      let totalScore = 0;

      // Loop through each quiz submission to sum scores and points
      for (const submission of user.quizSubmissions) {
        totalScore += submission.score;
        if (submission.points) {
          totalScore += submission.points;
        }
      }

      leaderboard.push({
        userId: user.id,
        name: user.name,
        totalScore,
      });
    }

    // Sort the leaderboard by total score in descending order
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);

    return NextResponse.json({
      success: true,
      leaderboard,
    });
  } catch (error) {
    console.error('Leaderboard generation error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to generate leaderboard',
      },
      { status: 500 }
    );
  }
}
