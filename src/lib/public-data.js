import { prisma } from "@/lib/prisma";

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4";
const FALLBACK_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d";

function toDateString(value) {
  if (!value) return null;
  if (typeof value === "string") return value.slice(0, 10);
  return value.toISOString().slice(0, 10);
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

export function mapSpeaker(speaker) {
  const avatar = speaker.avatar || speaker.image || FALLBACK_AVATAR;

  return {
    id: speaker.id,
    name: speaker.name,
    role: speaker.role || speaker.bio || "Intervenant",
    bio: speaker.bio || "Biographie a venir.",
    avatar,
    image: speaker.image || avatar,
    expertise: speaker.expertise || [],
    links: speaker.links || {},
  };
}

function mapSession(session, event) {
  const speakers = session.speakers || [];
  const speakerIds = speakers.map((speaker) => speaker.id);

  return {
    id: session.id,
    title: session.title,
    description: session.description || "",
    date: toDateString(session.date || event?.date),
    time: session.time,
    startTime: session.startTime || session.time,
    endTime: session.endTime,
    duration: session.duration,
    roomId: session.roomId,
    room: session.room,
    capacity: session.capacity,
    speakerId: speakerIds[0],
    speakerIds,
    questions: (session.questions || []).map(mapQuestion),
  };
}

export function mapEvent(event) {
  const date = toDateString(event.date);
  const startDate = toDateString(event.startDate) || date;
  const endDate = toDateString(event.endDate) || startDate;

  return {
    id: event.id,
    title: event.title,
    date,
    startDate,
    endDate,
    location: event.location,
    category: event.category || "Evenement",
    description: event.description || "",
    image: event.image || FALLBACK_IMAGE,
    sessions: (event.sessions || []).map((session) => mapSession(session, event)),
  };
}

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
    orderBy: [{ date: "asc" }, { id: "asc" }],
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
  const speakers = await prisma.speaker.findMany({
    orderBy: [{ name: "asc" }],
  });

  return speakers.map(mapSpeaker);
}

export async function getSpeakerById(id) {
  const speaker = await prisma.speaker.findUnique({
    where: { id },
  });

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
      speakers: true,
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
