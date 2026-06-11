import { prisma } from "@/lib/prisma";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4";
const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d";

function toDateString(value) {
  if (!value) return null;
  return new Date(value).toISOString().slice(0, 10);
}

function mapQuestion(question) {
  return {
    id: question.id,
    sessionId: question.sessionId,
    content: question.content,
    author: question.author,
    upvotes: question.upvotes,
    createdAt: question.createdAt.toISOString(),
  };
}

function getSessionTimeRange(session) {
  const start = new Date(session.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const end = new Date(session.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return `${start} - ${end}`;
}

function mapSession(session, event) {
  const speakers = session.speakers || [];
  const speakerIds = speakers.map(s => s.speaker?.id || s.id);
  return {
    id: session.id,
    title: session.title,
    description: session.description || "",
    startTime: session.startTime.toISOString(),
    endTime: session.endTime.toISOString(),
    timeRange: getSessionTimeRange(session),
    roomId: session.roomId,
    room: session.room,
    capacity: session.capacity,
    speakerId: speakerIds[0],
    speakerIds,
    questions: (session.questions || []).map(mapQuestion),
  };
}

export function mapSpeaker(speaker) {
  return {
    id: speaker.id,
    name: speaker.name,
    role: speaker.bio || "Intervenant",
    bio: speaker.bio || "Biographie à venir.",
    avatar: speaker.photo || FALLBACK_AVATAR,
    image: speaker.photo || FALLBACK_AVATAR,
    expertise: speaker.expertise || [],
    linkedin: speaker.linkedin || null,
    website: speaker.website || null,
    links: {},
  };
}

export function mapEvent(event) {
  return {
    id: event.id,
    title: event.title,
    date: toDateString(event.startDate),
    startDate: toDateString(event.startDate),
    endDate: toDateString(event.endDate),
    location: event.location,
    category: event.category || "Événement",
    description: event.description || "",
    image: event.image || FALLBACK_IMAGE,
    sessions: (event.sessions || []).map(s => mapSession(s, event)),
  };
}

const eventInclude = {
  sessions: {
    include: {
      room: true,
      speakers: { include: { speaker: true } },
      questions: {
        orderBy: [{ upvotes: "desc" }, { createdAt: "desc" }],
      },
    },
    orderBy: [{ startTime: "asc" }],
  },
};

export async function getEvents(searchQuery) {
  const search = searchQuery?.trim();
  const events = await prisma.event.findMany({
    where: search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
            { category: { contains: search, mode: "insensitive" } },
            { location: { contains: search, mode: "insensitive" } },
          ],
        }
      : undefined,
    include: eventInclude,
    orderBy: [{ startDate: "asc" }, { id: "asc" }],
  });
  return events.map(mapEvent);
}

export async function getEventById(id) {
  const event = await prisma.event.findUnique({
    where: { id: Number(id) },
    include: eventInclude,
  });
  return event ? mapEvent(event) : null;
}

export async function getSpeakers() {
  const speakers = await prisma.speaker.findMany({ orderBy: [{ name: "asc" }] });
  return speakers.map(mapSpeaker);
}

export async function getSpeakerById(id) {
  const speaker = await prisma.speaker.findUnique({ where: { id } });
  return speaker ? mapSpeaker(speaker) : null;
}

export async function getSessions() {
  const events = await getEvents();
  return events.flatMap((event) =>
    event.sessions.map((session) => ({
      ...session,
      eventId: event.id,
      eventTitle: event.title,
    }))
  );
}

export async function getSessionById(id) {
  const session = await prisma.session.findUnique({
    where: { id: Number(id) },
    include: {
      event: true,
      room: true,
      speakers: { include: { speaker: true } },
      questions: {
        orderBy: [{ upvotes: "desc" }, { createdAt: "desc" }],
      },
    },
  });
  if (!session) return null;
  return {
    event: mapEvent({ ...session.event, sessions: [] }),
    session: mapSession(session, session.event),
  };
}

export async function getDefaultFavorites() {
  return [];
}