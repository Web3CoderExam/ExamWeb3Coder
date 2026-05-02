import FavoritesView from "@/components/Favorites/FavoritesView";
import data from "@/data/mockData.json";

export default function Page() {
  const event = data.events[0];

  return (
    <FavoritesView
      event={event}
      sessions={event.sessions}
      defaultFavorites={data.favorites}
    />
  );
}
