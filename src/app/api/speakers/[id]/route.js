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
    const speaker = await prisma.speaker.findUnique({
      where: { id },
      include: { sessions: { include: { session: true } } },
    });
    if (!speaker) return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json(speaker, { headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS });
  }
}

export async function PUT(req, { params }) {
  const { id } = await params;
  try {
    const body = await req.json();

    let expertise = undefined;
    if (body.expertise !== undefined) {
      if (Array.isArray(body.expertise)) {
        expertise = body.expertise.filter(e => typeof e === 'string' && e.trim() !== '');
      } else if (typeof body.expertise === 'string') {
        expertise = body.expertise.split(',').map(e => e.trim()).filter(Boolean);
      } else {
        expertise = [];
      }
    }

    const speaker = await prisma.speaker.update({
      where: { id },
      data: {
        ...(body.name              !== undefined && { name: body.name }),
        ...(body.bio               !== undefined && { bio: body.bio }),
        ...(body.photo             !== undefined && { photo: body.photo }),
        ...(expertise              !== undefined && { expertise }),
        ...(body.linkedin          !== undefined && { linkedin: body.linkedin }),
        ...(body.website           !== undefined && { website: body.website }),
      },
    });
    return NextResponse.json(speaker, { headers: CORS });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS });
  }
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  try {
    await prisma.sessionSpeaker.deleteMany({ where: { speakerId: id } });
    await prisma.speaker.delete({ where: { id } });
    return NextResponse.json({ id }, { headers: CORS });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS });
  }
}