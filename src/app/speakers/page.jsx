import SpeakersPage from "@/components/Speakers/SpeakersPage";
import { getSessions, getSpeakers } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function Page() {
  const [speakers, sessions] = await Promise.all([
    getSpeakers(),
    getSessions(),
  ]);

  return (
    <SpeakersPage
      speakers={speakers}
      sessions={sessions}
    />
  );
}
