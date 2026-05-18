import PlanningPage from "@/components/Planning/PlanningPage";
import { getDefaultFavorites, getEvents, getSpeakers } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }) {
  const params = await searchParams;
  const selectedEventId = params?.event;
  const [events, speakers, defaultFavorites] = await Promise.all([
    getEvents(),
    getSpeakers(),
    getDefaultFavorites(),
  ]);

  return (
    <PlanningPage
      events={events}
      speakers={speakers}
      selectedEventId={selectedEventId}
      defaultFavorites={defaultFavorites}
    />
  );
}
