import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const questionId = Number(id);
    const body = await request.json();
    const { action } = body;

    if (action !== "upvote") {
      return NextResponse.json(
        { success: false, error: "Action non supportée" },
        { status: 400 }
      );
    }

    const question = await prisma.question.update({
      where: { id: questionId },
      data: {
        upvotes: {
          increment: 1,
        },
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: question.id,
          sessionId: question.sessionId,
          content: question.content,
          author: question.author,
          upvotes: question.upvotes,
          createdAt: question.createdAt.toISOString(),
        },
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
