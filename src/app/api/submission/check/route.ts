// app/api/submission/check/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserDetail } from '@/lib/getUserDetails';

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user details instead of relying on frontend params
    const userInfo = await getUserDetail();

    if (!userInfo || !userInfo.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = userInfo.id;

    // Get quizId from query params
    const { searchParams } = new URL(req.url);
    const quizId = Number(searchParams.get('quizId'));

    if (!quizId || isNaN(quizId)) {
      return NextResponse.json({ error: 'Invalid quiz ID' }, { status: 400 });
    }

    // Check if user has already submitted this quiz
    const existingSubmission = await prisma.quizSubmission.findUnique({
      where: {
        userId_quizId: {
          userId,
          quizId,
        },
      },
      select: {
        id: true,
        score: true,
        points: true,
        createdAt: true
      }
    });

    if (existingSubmission) {
      return NextResponse.json({
        hasSubmitted: true,
        score: existingSubmission.score,
        points: existingSubmission.points || 0,
        submittedAt: existingSubmission.createdAt
      });
    } else {
      return NextResponse.json({ hasSubmitted: false });
    }
  } catch (error) {
    console.error('Error checking submission:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
