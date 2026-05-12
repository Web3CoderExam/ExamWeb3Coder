
import data from "@/data/mockData.json";
import EventsList from "@/components/EventsList/EventsList";

export default function Page() {
  return <EventsList events={data.events} />;
}
