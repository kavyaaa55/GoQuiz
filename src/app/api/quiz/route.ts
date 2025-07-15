import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Fetch all quizzes with their questions count
    const quizzes = await prisma.quiz.findMany({
      include: {
        _count: {
          select: { questions: true }
        },
        questions: {
          select: {
            id: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc' // Most recent quizzes first
      }
    });

    // Transform the data to include the questions count
    const formattedQuizzes = quizzes.map(quiz => ({
      id: quiz.id,
      title: quiz.title,
      topic: quiz.topic,
      createdAt: quiz.createdAt.toISOString(),
      questionsCount: quiz._count.questions,
      questions: quiz.questions
    }));

    return NextResponse.json({
      success: true,
      data: formattedQuizzes
    });
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quizzes'
      },
      { status: 500 }
    );
  }
}
