import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const CORS = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Range, Accept",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS });
}

export async function GET(req, { params }) {
  const { id } = await params;
  try {
    const sessionSpeakers = await prisma.sessionSpeaker.findMany({
      where: { sessionId: Number(id) },
      include: { speaker: true },
    });
    return NextResponse.json(sessionSpeakers.map(ss => ss.speaker), { headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function POST(req, { params }) {
  const { id } = await params;
  try {
    const { speakerId } = await req.json();
    const sessionSpeaker = await prisma.sessionSpeaker.create({
      data: { sessionId: Number(id), speakerId },
    });
    return NextResponse.json(sessionSpeaker, { status: 201, headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    const { speakerId } = await req.json();
    await prisma.sessionSpeaker.deleteMany({
      where: { sessionId: Number(id), speakerId },
    });
    return NextResponse.json({ success: true }, { headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}