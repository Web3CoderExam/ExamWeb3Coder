import Link from "next/link";
import data from "@/data/mockData.json";
import EventPage from "@/components/EventPage/EventPage";

export default async function Page({ params }) {
  const { id } = await params;
  const event = data.events.find((item) => String(item.id) === String(id));

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
      speakers={data.speakers}
      defaultFavorites={data.favorites}
    />
  );
}
