import { NextRequest, NextResponse } from "next/server";
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

    const { questionId, optionId, time } = body;
    console.log(body);
    // Validate required fields
    if (!userId || !questionId || !optionId) {
      return NextResponse.json(
        { error: `Missing required fields: userId, questionId, and optionId are required` },
        { status: 400 }
      );
    }

    // Create user answer
    const userAnswer = await prisma.userAnswer.create({
      data: {
        userId,
        questionId,
        optionId,
        time: time || 0, // Default to 0 if time is not provided
      },
    });

    return NextResponse.json({
      message: 'Submission successful',
      userAnswer
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating submission:', error);
    return NextResponse.json(
      { error: 'Failed to save submission' },
      { status: 500 }
    );
  }
}
