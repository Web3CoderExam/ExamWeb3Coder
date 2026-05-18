
import EventsList from "@/components/EventsList/EventsList";
import { getEvents } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const events = await getEvents();

  return <EventsList events={events} />;
}
