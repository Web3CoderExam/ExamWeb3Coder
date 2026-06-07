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
    const filter = searchParams.get("filter");
    const rangeStart = range ? parseInt(JSON.parse(range)[0]) : 0;
    const rangeEnd = range ? parseInt(JSON.parse(range)[1]) : 9;
    const perPage = rangeEnd - rangeStart + 1;

    const parsedFilter = filter ? JSON.parse(filter) : {};
    const where = parsedFilter.title
      ? {
          OR: [
            { title: { contains: parsedFilter.title, mode: 'insensitive' } },
            { location: { contains: parsedFilter.title, mode: 'insensitive' } },
            { category: { contains: parsedFilter.title, mode: 'insensitive' } },
          ]
        }
      : {};

    const [events, total] = await Promise.all([
      prisma.event.findMany({
        skip: rangeStart,
        take: perPage,
        where,
        include: { sessions: { include: { speakers: true, questions: true } } },
      }),
      prisma.event.count({ where }),
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