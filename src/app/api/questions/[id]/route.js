import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function isSessionLive(session) {
  const now = new Date();
  const start = new Date(session.startTime);
  const end = new Date(session.endTime);
  return now >= start && now <= end;
}

function mapQuestion(question) {
  return {
    id: question.id,
    sessionId: question.sessionId,
    content: question.content,
    author: question.author,
    upvotes: question.upvotes,
    createdAt: question.createdAt.toISOString(),
  };
}

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const questionId = Number(id);

    const existingQuestion = await prisma.question.findUnique({
      where: { id: questionId },
      include: { session: true },
    });

    if (!existingQuestion) {
      return NextResponse.json(
        { success: false, error: "Question non trouvée" },
        { status: 404 }
      );
    }

    if (!isSessionLive(existingQuestion.session)) {
      return NextResponse.json(
        { success: false, error: "Les votes sont disponibles pendant le live" },
        { status: 403 }
      );
    }

    const question = await prisma.question.update({
      where: { id: questionId },
      data: { upvotes: { increment: 1 } },
    });

    revalidatePath(`/sessions/${question.sessionId}`);

    return NextResponse.json(
      {
        success: true,
        data: mapQuestion(question),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur PUT questions:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}