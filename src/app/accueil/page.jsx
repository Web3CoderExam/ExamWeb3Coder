import EventsList from "@/components/EventsList/EventsList";
import SearchBanner from "@/components/SearchBanner/SearchBanner";
import { getEvents } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function AccueilPage({ searchParams }) {
  const params = await searchParams;
  const events = await getEvents(params?.search);

  return (
    <>
      <SearchBanner />
      <EventsList events={events} />
    </>
  );
}
