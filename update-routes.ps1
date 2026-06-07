# events/route.js
Set-Content -Path "src\app\api\events\route.js" -Value @'
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const CORS = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Range, Accept",
  "Access-Control-Expose-Headers": "Content-Range, X-Total-Count",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS });
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range");
    const rangeStart = range ? parseInt(JSON.parse(range)[0]) : 0;
    const rangeEnd = range ? parseInt(JSON.parse(range)[1]) : 9;
    const perPage = rangeEnd - rangeStart + 1;

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        skip: rangeStart,
        take: perPage,
        include: { sessions: { include: { speakers: true, questions: true } } },
      }),
      prisma.event.count(),
    ]);

    return NextResponse.json(events, {
      headers: { ...CORS, "Content-Range": `events ${rangeStart}-${rangeEnd}/${total}` },
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const event = await prisma.event.create({
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
    return NextResponse.json(event, { status: 201, headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}
'@

# events/[id]/route.js
Set-Content -LiteralPath "src\app\api\events\[id]\route.js" -Value @'
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
'@

# sessions/route.js
Set-Content -Path "src\app\api\sessions\route.js" -Value @'
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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range");
    const rangeStart = range ? parseInt(JSON.parse(range)[0]) : 0;
    const rangeEnd = range ? parseInt(JSON.parse(range)[1]) : 9;
    const perPage = rangeEnd - rangeStart + 1;

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        skip: rangeStart,
        take: perPage,
        include: { event: true, room: true, speakers: { include: { speaker: true } }, questions: true },
      }),
      prisma.session.count(),
    ]);

    return NextResponse.json(sessions, {
      headers: { ...CORS, "Content-Range": `sessions ${rangeStart}-${rangeEnd}/${total}` },
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { title, description, startTime, endTime, capacity, eventId, roomId, speakerIds } = body;
    const session = await prisma.session.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity,
        eventId,
        roomId,
        speakers: { create: speakerIds?.map((speakerId) => ({ speakerId })) || [] },
      },
    });
    return NextResponse.json(session, { status: 201, headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}
'@

# sessions/[id]/route.js
Set-Content -LiteralPath "src\app\api\sessions\[id]\route.js" -Value @'
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
'@

# speakers/route.js
Set-Content -Path "src\app\api\speakers\route.js" -Value @'
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";

const CORS = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Range, Accept",
  "Access-Control-Expose-Headers": "Content-Range, X-Total-Count",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: CORS });
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range");
    const rangeStart = range ? parseInt(JSON.parse(range)[0]) : 0;
    const rangeEnd = range ? parseInt(JSON.parse(range)[1]) : 9;
    const perPage = rangeEnd - rangeStart + 1;

    const [speakers, total] = await Promise.all([
      prisma.speaker.findMany({
        skip: rangeStart,
        take: perPage,
        include: { sessions: { include: { session: true } } },
      }),
      prisma.speaker.count(),
    ]);

    return NextResponse.json(speakers, {
      headers: { ...CORS, "Content-Range": `speakers ${rangeStart}-${rangeEnd}/${total}` },
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const speaker = await prisma.speaker.create({
      data: {
        id: randomUUID(),
        name: body.name,
        bio: body.bio || null,
        photo: body.photo || null,
        expertise: body.expertise || [],
      },
    });
    return NextResponse.json(speaker, { status: 201, headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}
'@

# speakers/[id]/route.js
Set-Content -LiteralPath "src\app\api\speakers\[id]\route.js" -Value @'
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
  const { id } = params;
  try {
    const speaker = await prisma.speaker.findUnique({
      where: { id },
      include: { sessions: { include: { session: true } } },
    });
    if (!speaker) return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json(speaker, { headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function PUT(req, { params }) {
  const { id } = params;
  try {
    const body = await req.json();
    const speaker = await prisma.speaker.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.bio !== undefined && { bio: body.bio }),
        ...(body.photo && { photo: body.photo }),
        ...(body.expertise && { expertise: body.expertise }),
      },
    });
    return NextResponse.json(speaker, { headers: CORS });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function DELETE(req, { params }) {
  const { id } = params;
  try {
    await prisma.sessionSpeaker.deleteMany({ where: { speakerId: id } });
    await prisma.speaker.delete({ where: { id } });
    return NextResponse.json({ id }, { headers: CORS });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}
'@

# rooms/route.js
Set-Content -Path "src\app\api\rooms\route.js" -Value @'
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

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range");
    const rangeStart = range ? parseInt(JSON.parse(range)[0]) : 0;
    const rangeEnd = range ? parseInt(JSON.parse(range)[1]) : 9;
    const perPage = rangeEnd - rangeStart + 1;

    const [rooms, total] = await Promise.all([
      prisma.room.findMany({ skip: rangeStart, take: perPage, include: { sessions: true } }),
      prisma.room.count(),
    ]);

    return NextResponse.json(rooms, {
      headers: { ...CORS, "Content-Range": `rooms ${rangeStart}-${rangeEnd}/${total}` },
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: "Nom requis" }, { status: 400, headers: CORS });
    const room = await prisma.room.create({ data: { name: body.name } });
    return NextResponse.json(room, { status: 201, headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}
'@

# rooms/[id]/route.js
Set-Content -LiteralPath "src\app\api\rooms\[id]\route.js" -Value @'
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
  const id = Number(params.id);
  try {
    const room = await prisma.room.findUnique({ where: { id }, include: { sessions: true } });
    if (!room) return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json(room, { headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function PUT(req, { params }) {
  const id = Number(params.id);
  try {
    const body = await req.json();
    if (!body.name) return NextResponse.json({ error: "Nom requis" }, { status: 400, headers: CORS });
    const room = await prisma.room.update({ where: { id }, data: { name: body.name } });
    return NextResponse.json(room, { headers: CORS });
  } catch (error) {
    if (error.code === "P2025")
      return NextResponse.json({ error: "Not found" }, { status: 404, headers: CORS });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}

export async function DELETE(req, { params }) {
  const id = Number(params.id);
  try {
    await prisma.room.delete({ where: { id } });
    return NextResponse.json({ id }, { headers: CORS });
  } catch (error) {
    if (error.code === "P2003")
      return NextResponse.json({ error: "Salle liee a des sessions existantes" }, { status: 400, headers: CORS });
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}
'@

Write-Host "Tous les fichiers ont ete mis a jour !" -ForegroundColor Green
