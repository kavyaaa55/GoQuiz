import { NextRequest, NextResponse } from "next/server";
import prisma from '@/lib/prisma';
import { getUserDetail } from '@/lib/getUserDetails';

type QuizQuestion = {
  id: number;
  text: string;
  answer: string;
};

type QuestionAnswerMap = {
  [key: number]: string;
};

export async function GET(req: NextRequest) {
  try {
    const userinfo = await getUserDetail();
    const userId = userinfo?.id;

    if (!userId) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const url = new URL(req.url);
    //const questionId = url.searchParams.get('questionId');
    const quizId = url.searchParams.get('quizId');

    const query: { userId: number; questionId?: number } = {
      userId
    };

    // if (questionId) {
    //   query.questionId = parseInt(questionId);
    // }

    const quizQuestions: QuizQuestion[] = [];

    // if (quizId) {
    //   const quiz = await prisma.quiz.findUnique({
    //     where: { id: parseInt(quizId) },
    //     include: {
    //       questions: {
    //         select: {
    //           id: true,
    //           text: true,
    //           answer: true
    //         }
    //       }
    //     }
    //   });
    //
    //   if (quiz) {
    //     quizQuestions = quiz.questions;
    //   }
    // }

    const userAnswers = await prisma.userAnswer.findMany({
      where: query,
      include: {
        question: {
          select: {
            id: true,
            text: true,
            answer: true
          }
        },
        option: {
          select: {
            id: true,
            text: true
          }
        }
      }
    });

    let score = 0;
    let points = 0;

    console.log(userAnswers);
    console.log(quizQuestions)
    if (quizId) {
      for (const userAnswer of userAnswers) {
        if (userAnswer.option.text === userAnswer.question.answer) {
          score++;
          points += (userAnswer.time * 10); // or modify logic here as needed
          console.log(`score: ${score} points: ${points}`);

        }
      }

      const existingSubmission = await prisma.quizSubmission.findUnique({
        where: {
          userId_quizId: {
            userId,
            quizId: parseInt(quizId)
          }
        }
      });

      if (existingSubmission) {
        await prisma.quizSubmission.update({
          where: { id: existingSubmission.id },
          data: { score, points }
        });
      } else {
        await prisma.quizSubmission.create({
          data: {
            userId,
            quizId: parseInt(quizId),
            score,
            points
          }
        });
      }
    }

    return NextResponse.json({
      score,
      points,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching user answers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user answers' },
      { status: 500 }
    );
  }
}
