import FavoritesView from "@/components/Favorites/FavoritesView";
import { getDefaultFavorites, getSessions } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [sessions, defaultFavorites] = await Promise.all([
    getSessions(),
    getDefaultFavorites(),
  ]);

  return (
    <FavoritesView
      sessions={sessions}
      defaultFavorites={defaultFavorites}
    />
  );
}
