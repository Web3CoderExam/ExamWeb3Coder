import FavoritesView from "@/components/Favorites/FavoritesView";
import data from "@/data/mockData.json";

export default function Page() {
  const sessions = data.events.flatMap((event) => {
    return event.sessions.map((session) => ({
      ...session,
      eventId: event.id,
      eventTitle: event.title,
    }));
  });

  return (
    <FavoritesView
      sessions={sessions}
      defaultFavorites={data.favorites}
    />
  );
}
