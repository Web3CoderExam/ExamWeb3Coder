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

export async function POST(request) {
  try {
    const body = await request.json();
    const { sessionId, content, author } = body;
    const cleanContent = content?.trim();
    const cleanAuthor = author?.trim();

    if (!sessionId || !cleanContent) {
      return NextResponse.json(
        { success: false, error: "sessionId et content sont requis" },
        { status: 400 }
      );
    }

    const session = await prisma.session.findUnique({
      where: { id: Number(sessionId) },
    });

    if (!session) {
      return NextResponse.json(
        { success: false, error: "Session non trouvée" },
        { status: 404 }
      );
    }

    if (!isSessionLive(session)) {
      return NextResponse.json(
        { success: false, error: "Les questions sont disponibles pendant le live" },
        { status: 403 }
      );
    }

    const question = await prisma.question.create({
      data: {
        sessionId: Number(sessionId),
        content: cleanContent,
        author: cleanAuthor || null,
        upvotes: 0,
      },
    });

    revalidatePath(`/sessions/${sessionId}`);

    return NextResponse.json(
      {
        success: true,
        data: mapQuestion(question),
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