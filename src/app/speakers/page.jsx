import data from "@/data/mockData.json";
import SpeakersPage from "@/components/Speakers/SpeakersPage";

export default function Page() {
  return (
    <SpeakersPage
      speakers={data.speakers}
      sessions={data.events[0].sessions}
    />
  );
}