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
    const where = parsedFilter.title
      ? { title: { contains: parsedFilter.title, mode: 'insensitive' } }
      : {};

    const [sessions, total] = await Promise.all([
      prisma.session.findMany({
        skip: rangeStart,
        take: perPage,
        where,
        include: { event: true, room: true, speakers: { include: { speaker: true } }, questions: true },
      }),
      prisma.session.count({ where }),
    ]);

    return NextResponse.json(sessions, {
      headers: { ...CORS, "Content-Range": `sessions ${rangeStart}-${rangeEnd}/${total}` },
    });
  } catch (error) {
    console.error("SESSION GET ERROR:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS });
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    console.log("SESSION POST BODY:", JSON.stringify(body, null, 2));
    const { title, description, startTime, endTime, capacity, eventId, roomId, speakerIds } = body;

    const speakerIdsArray = Array.isArray(speakerIds) ? speakerIds : speakerIds ? [speakerIds] : [];

    const session = await prisma.session.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity: capacity ? parseInt(capacity) : null,
        eventId: eventId ? parseInt(eventId) : null,
        roomId: roomId ? parseInt(roomId) : null,
        speakers: { create: speakerIdsArray.map((speakerId) => ({ speakerId })) },
      },
    });
    return NextResponse.json(session, { status: 201, headers: CORS });
  } catch (error) {
    console.error("SESSION POST ERROR:", error.message, error);
    return NextResponse.json({ error: error.message }, { status: 500, headers: CORS });
  }
}