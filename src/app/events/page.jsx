import data from "@/data/mockData.json";
import EventPage from "@/components/EventPage/EventPage";

export default function Page() {
  return (
    <EventPage
      event={data.events[0]}
      sessions={data.events[0].sessions}
      speakers={data.speakers}
      defaultFavorites={data.favorites}
    />
  );
}