import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

function computeEndTime(startTime, duration) {
  if (!startTime || duration == null) return null;

  const [hours, minutes] = startTime.split(":").map(Number);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  date.setMinutes(date.getMinutes() + Math.round(duration * 60));

  return date.toTimeString().slice(0, 5);
}

function isSessionLive(session) {
  const sessionDate = session.date || session.event.startDate || session.event.date;
  const dateText = sessionDate.toISOString().slice(0, 10);
  const startTime = session.startTime || session.time;
  const endTime = session.endTime || computeEndTime(startTime, session.duration);
  const start = new Date(`${dateText}T${startTime}`);
  const end = endTime
    ? new Date(`${dateText}T${endTime}`)
    : new Date(start.getTime() + session.duration * 60 * 60 * 1000);

  return new Date() >= start && new Date() <= end;
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
    const body = await request.json();
    const { action } = body;

    if (action !== "upvote") {
      return NextResponse.json(
        { success: false, error: "Action non supportée" },
        { status: 400 }
      );
    }

    const existingQuestion = await prisma.question.findUnique({
      where: { id: questionId },
      include: {
        session: {
          include: { event: true },
        },
      },
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
      data: {
        upvotes: {
          increment: 1,
        },
      },
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
