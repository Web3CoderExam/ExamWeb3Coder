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

  let defaultEventId = selectedEventId;


  if (!defaultEventId && events.length > 0) {
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    
    
    const eventCoveringToday = events.find(e => {
      const start = e.startDate?.slice(0,10);
      const end = e.endDate?.slice(0,10);
      return start <= today && end >= today;
    });
    
    if (eventCoveringToday) {
      defaultEventId = eventCoveringToday.id;
    } else {
      const now = new Date();
      const sorted = [...events].sort((a,b) => {
        const da = new Date(a.startDate || a.date);
        const db = new Date(b.startDate || b.date);
        return Math.abs(da - now) - Math.abs(db - now);
      });
      defaultEventId = sorted[0]?.id;
    }
  }

  return (
    <PlanningPage
      events={events}
      speakers={speakers}
      selectedEventId={defaultEventId}
      defaultFavorites={defaultFavorites}
    />
  );
}