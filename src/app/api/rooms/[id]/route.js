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
  const { id: rawId } = await params;
  const id = Number(rawId);
  try {
    const room = await prisma.room.findUnique({ where: { id }, include: { sessions: true } });
    if (!room) return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json(room, { headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function PUT(req, { params }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  try {
    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: "Nom requis" }, { status: 400, headers: CORS });
    const room = await prisma.room.update({ 
      where: { id }, 
      data: { 
        name: body.name,
        capacity: body.capacity ?? null,
        description: body.description ?? null,
      } 
    });
    return NextResponse.json(room, { headers: CORS });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function DELETE(req, { params }) {
  const { id: rawId } = await params;
  const id = Number(rawId);
  try {

    const sessions = await prisma.session.findMany({ where: { roomId: id }, select: { id: true } });
    const sessionIds = sessions.map(s => s.id);
    await prisma.question.deleteMany({ where: { sessionId: { in: sessionIds } } });
    await prisma.sessionSpeaker.deleteMany({ where: { sessionId: { in: sessionIds } } });
    await prisma.session.deleteMany({ where: { roomId: id } });
    await prisma.room.delete({ where: { id } });

    return NextResponse.json({ id }, { headers: CORS });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS });
  }
}