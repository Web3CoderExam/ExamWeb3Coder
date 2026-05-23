import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import SessionView from './SessionView'

async function getSessionData(id) {
  const session = await prisma.session.findUnique({
    where: { id: Number(id) },
    include: {
      event: true,
      room: true,
      speakers: { include: { speaker: true } },
      questions: { orderBy: [{ upvotes: 'desc' }, { createdAt: 'desc' }] }
    }
  })
  if (!session) return null
  return {
    event: {
      ...session.event,
      startDate: session.event.startDate.toISOString(),
      endDate: session.event.endDate.toISOString(),
    },
    session: {
      id: session.id,
      title: session.title,
      description: session.description,
      startTime: session.startTime.toISOString(),
      endTime: session.endTime.toISOString(),
      capacity: session.capacity,
      room: session.room,
      speakers: session.speakers.map(s => s.speaker),
      questions: session.questions.map(q => ({
        ...q,
        createdAt: q.createdAt.toISOString()
      }))
    }
  }
}

export default async function Page({ params }) {
  const { id } = await params
  const data = await getSessionData(id)
  if (!data) return <div style={{ padding: 20 }}>Session introuvable (id: {id})</div>
  return <SessionView {...data} defaultFavorites={[]} />
}