
// app/api/submission/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getUserDetail } from '@/lib/getUserDetails';

export async function POST(req: NextRequest) {
  try {

    const body = await req.json();
    const userinfo = await getUserDetail()
    const userId = userinfo?.id
    if (!userId) {
      return NextResponse.json({ "msg": "unautherised" }, { status: 402 })
    }
    const { quizId, score, points } = body;

    // Validate required fields
    if (!userId || !quizId || score == null) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate data types
    if (typeof score !== 'number' || (points != null && typeof points !== 'number')) {
      return NextResponse.json({ error: 'Score and points must be numbers' }, { status: 400 });
    }

    // Check if user and quiz exist
    const [user, quiz] = await Promise.all([
      prisma.user.findUnique({ where: { id: userId } }),
      prisma.quiz.findUnique({ where: { id: quizId } }),
    ]);

    if (!user || !quiz) {
      return NextResponse.json({ error: 'Invalid userId or quizId' }, { status: 400 });
    }

    // Check for existing submission
    const existingSubmission = await prisma.quizSubmission.findUnique({
      where: {
        userId_quizId: {
          userId,
          quizId,
        },
      },
    });

    if (existingSubmission) {
      return NextResponse.json(
        { error: 'You have already submitted this quiz.' },
        { status: 409 }
      );
    }

    // Create new submission
    const submission = await prisma.quizSubmission.create({
      data: {
        userId,
        quizId,
        score,
        points: points ?? null,
      },
    });

    return NextResponse.json({ message: 'Submission successful', submission }, { status: 201 });

  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    );
  }
}
