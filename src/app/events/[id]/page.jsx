import Link from "next/link";
import EventPage from "@/components/EventPage/EventPage";
import { getDefaultFavorites, getEventById, getSpeakers } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { id } = await params;
  const [event, speakers, defaultFavorites] = await Promise.all([
    getEventById(id),
    getSpeakers(),
    getDefaultFavorites(),
  ]);

  if (!event) {
    return (
      <div style={{ padding: 24 }}>
        <h1>Evénement introuvable</h1>
        <Link href="/events">Retour aux événements</Link>
      </div>
    );
  }

  return (
    <EventPage
      event={event}
      sessions={event.sessions}
      speakers={speakers}
      defaultFavorites={defaultFavorites}
    />
  );
}
