import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EventPage from '@/components/EventPage/EventPage'

async function getEventData(id) {
  const event = await prisma.event.findUnique({
    where: { id: Number(id) },
    include: {
      sessions: {
        include: {
          room: true,
          speakers: { include: { speaker: true } },
          questions: true,
        },
        orderBy: { startTime: 'asc' },
      },
    },
  })
  if (!event) return null
  return {
    event: {
      id: event.id,
      title: event.title,
      description: event.description,
      startDate: event.startDate.toISOString().slice(0, 10),
      endDate: event.endDate.toISOString().slice(0, 10),
      location: event.location,
    },
    sessions: event.sessions.map(session => ({
      id: session.id,
      title: session.title,
      description: session.description,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      room: session.room.name,
      capacity: session.capacity,
      speakers: session.speakers.map(s => s.speaker),
      questions: session.questions,
    })),
    speakers: [],
  }
}

export default async function Page({ params }) {
  const { id } = await params
  const data = await getEventData(id)
  if (!data) return <div style={{ padding: 20 }}>Événement introuvable</div>
  return <EventPage {...data} defaultFavorites={[]} />
}