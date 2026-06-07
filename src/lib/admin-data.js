import { prisma } from "@/lib/prisma";


// EVENTS (ADMIN)


export async function createEvent(data) {
  return await prisma.event.create({
    data: {
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      category: data.category,
      image: data.image,
    },
  });
}

export async function updateEvent(id, data) {
  return await prisma.event.update({
    where: { id: Number(id) },
    data: {
      title: data.title,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      category: data.category,
      image: data.image,
    },
  });
}

export async function deleteEvent(id) {
  return await prisma.event.delete({
    where: { id: Number(id) },
  });
}

export async function getAdminEvents() {
  return await prisma.event.findMany({
    include: {
      sessions: true,
    },
    orderBy: [
      { startDate: "desc" },
    ],
  });
}


// SESSIONS (ADMIN)


export async function createSession(data) {
  return await prisma.session.create({
    data: {
      title: data.title,
      description: data.description,
      startTime: data.startTime,
      endTime: data.endTime,
      capacity: data.capacity,
      eventId: data.eventId,
      roomId: data.roomId,
    },
  });
}

export async function updateSession(id, data) {
  return await prisma.session.update({
    where: { id: Number(id) },
    data,
  });
}

export async function deleteSession(id) {
  return await prisma.session.delete({
    where: { id: Number(id) },
  });
}