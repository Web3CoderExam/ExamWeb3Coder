import { promises as fs } from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";

const DATA_PATH = path.join(process.cwd(), "src/data/mockData.json");

const eventInclude = {
  sessions: {
    include: {
      speakers: true,
      questions: {
        orderBy: [{ upvotes: "desc" }, { createdAt: "desc" }],
      },
    },
    orderBy: [{ date: "asc" }, { time: "asc" }],
  },
};

const sessionInclude = {
  event: true,
  speakers: true,
  questions: {
    orderBy: [{ upvotes: "desc" }, { createdAt: "desc" }],
  },
};

export function getDb() {
  return prisma;
}

export async function getAllEvents() {
  if (process.env.DATABASE_URL) {
    return prisma.event.findMany({
      include: eventInclude,
      orderBy: [{ date: "asc" }, { id: "asc" }],
    });
  }

  const fileContent = await fs.readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(fileContent);
  return data.events;
}

export async function getEventById(id) {
  const eventId = Number(id);
  if (process.env.DATABASE_URL) {
    return prisma.event.findUnique({
      where: { id: eventId },
      include: eventInclude,
    });
  }

  const events = await getAllEvents();
  return events.find((event) => event.id === eventId) || null;
}

export async function getAllSpeakers() {
  if (process.env.DATABASE_URL) {
    return prisma.speaker.findMany({
      orderBy: [{ name: "asc" }],
    });
  }

  const fileContent = await fs.readFile(DATA_PATH, "utf-8");
  const data = JSON.parse(fileContent);
  return data.speakers;
}

export async function getSpeakerById(id) {
  if (process.env.DATABASE_URL) {
    return prisma.speaker.findUnique({
      where: { id },
      include: {
        sessions: true,
      },
    });
  }

  const speakers = await getAllSpeakers();
  return speakers.find((speaker) => speaker.id === id) || null;
}

export async function getAllSessions() {
  if (process.env.DATABASE_URL) {
    return prisma.session.findMany({
      include: sessionInclude,
      orderBy: [{ date: "asc" }, { time: "asc" }],
    });
  }

  const events = await getAllEvents();
  return events.flatMap((event) =>
    (event.sessions || []).map((session) => ({
      ...session,
      eventId: event.id,
      eventTitle: event.title,
    }))
  );
}

export async function getSessionById(id) {
  const sessionId = Number(id);
  if (process.env.DATABASE_URL) {
    return prisma.session.findUnique({
      where: { id: sessionId },
      include: sessionInclude,
    });
  }

  const sessions = await getAllSessions();
  return sessions.find((session) => session.id === sessionId) || null;
}
