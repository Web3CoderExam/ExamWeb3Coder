import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, content, author } = body;

    if (!sessionId || !content) {
      return NextResponse.json(
        { success: false, error: "sessionId et content sont requis" },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        sessionId: Number(sessionId),
        content,
        author: author || null,
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
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur POST questions:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
