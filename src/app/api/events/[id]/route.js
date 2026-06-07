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
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
      include: { sessions: { include: { speakers: true, questions: true } } },
    });
    if (!event) return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json(event, { headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title: body.title,
        description: body.description ?? "",
        startDate: new Date(body.startDate),
        endDate: new Date(body.endDate),
        location: body.location,
        category: body.category ?? "Conference",
        image: body.image ?? "",
      },
    });
    return NextResponse.json(event, { headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    await prisma.event.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ id: parseInt(id) }, { headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}
