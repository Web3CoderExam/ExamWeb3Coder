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
    const filter = searchParams.get("filter");
    const rangeStart = range ? parseInt(JSON.parse(range)[0]) : 0;
    const rangeEnd = range ? parseInt(JSON.parse(range)[1]) : 9;
    const perPage = rangeEnd - rangeStart + 1;

    const parsedFilter = filter ? JSON.parse(filter) : {};
    const where = parsedFilter.name
      ? { name: { contains: parsedFilter.name, mode: 'insensitive' } }
      : {};

    const [rooms, total] = await Promise.all([
      prisma.room.findMany({
        skip: rangeStart,
        take: perPage,
        where,
        include: { sessions: true },
      }),
      prisma.room.count({ where }),
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
    const room = await prisma.room.create({
      data: {
        name: body.name,
        capacity: body.capacity ?? null,
        description: body.description ?? null,
      }
    });
    return NextResponse.json(room, { status: 201, headers: CORS });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500, headers: CORS });
  }
}