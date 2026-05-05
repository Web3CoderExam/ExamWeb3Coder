import data from "@/data/mockData.json";
import SpeakersPage from "@/components/Speakers/SpeakersPage";

export default function Page() {
  const sessions = data.events.flatMap((event) => {
    return event.sessions.map((session) => ({
      ...session,
      eventTitle: event.title,
    }));
  });

  return (
    <SpeakersPage
      speakers={data.speakers}
      sessions={sessions}
    />
  );
}
