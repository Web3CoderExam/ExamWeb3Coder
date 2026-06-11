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
    const filter = searchParams.get("filter");
    const rangeStart = range ? parseInt(JSON.parse(range)[0]) : 0;
    const rangeEnd = range ? parseInt(JSON.parse(range)[1]) : 9;
    const perPage = rangeEnd - rangeStart + 1;

    const parsedFilter = filter ? JSON.parse(filter) : {};
    const where = parsedFilter.name
      ? {
          OR: [
            { name: { contains: parsedFilter.name, mode: 'insensitive' } },
            { bio: { contains: parsedFilter.name, mode: 'insensitive' } },
          ]
        }
      : {};

    const [speakers, total] = await Promise.all([
      prisma.speaker.findMany({
        skip: rangeStart,
        take: perPage,
        where,
        include: { sessions: { include: { session: true } } },
      }),
      prisma.speaker.count({ where }),
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
        linkedin: body.linkedin || null,
        website: body.website || null,
      },
    });
    return NextResponse.json(speaker, { status: 201, headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}