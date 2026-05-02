import data from "@/data/mockData.json";
import SpeakersPage from "@/components/Speakers/SpeakersPage";

export default function Page() {
  const sessions = data.events.flatMap((event) => event.sessions);
  const speakerNames = [...new Set(sessions.map((session) => session.speaker))];

  const speakers = speakerNames.map((name) => ({
    id: name,
    name,
    role: "Intervenant",
    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
    bio: `${name} participe aux sessions EventSync.`,
  }));

  return (
    <SpeakersPage
      speakers={speakers}
      sessions={sessions}
    />
  );
}
