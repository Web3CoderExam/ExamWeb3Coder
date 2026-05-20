import PlanningPage from "@/components/Planning/PlanningPage";
import { getDefaultFavorites, getEvents } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const selectedEventId = params?.event;
  const [events, defaultFavorites] = await Promise.all([
    getEvents(),
    getDefaultFavorites(),
  ]);

  return (
    <PlanningPage
      events={events}
      selectedEventId={selectedEventId}
      defaultFavorites={defaultFavorites}
    />
  );
}
