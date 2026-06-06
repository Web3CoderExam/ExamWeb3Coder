import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CORS = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Range, Accept",
  "Access-Control-Expose-Headers": "Content-Range, X-Total-Count",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS });
}

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const session = await prisma.session.findUnique({
      where: { id: Number(id) },
      include: { event: true, room: true, speakers: { include: { speaker: true } }, questions: true },
    });
    if (!session) return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json(session, { headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const session = await prisma.session.update({
      where: { id: Number(id) },
      data: {
        title: body.title,
        description: body.description,
        startTime: body.startTime ? new Date(body.startTime) : undefined,
        endTime: body.endTime ? new Date(body.endTime) : undefined,
        roomId: body.roomId,
        capacity: body.capacity,
      },
    });
    return NextResponse.json(session, { headers: CORS });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    await prisma.question.deleteMany({ where: { sessionId: Number(id) } });
    await prisma.sessionSpeaker.deleteMany({ where: { sessionId: Number(id) } });
    await prisma.session.delete({ where: { id: Number(id) } });
    return NextResponse.json({ id: Number(id) }, { headers: CORS });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}
