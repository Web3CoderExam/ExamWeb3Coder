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
      include: { event: true },
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
