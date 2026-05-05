import SessionView from "./SessionView";
import data from "@/data/mockData.json";

export default async function Page({ params }) {
  const { id } = await params;

  const sessionId = String(id);

  let session = null;
  let selectedEvent = null;

  for (const item of data.events) {
    session = item.sessions.find(
      (s) => String(s.id) === sessionId
    );

    if (session) {
      selectedEvent = event;
      break;
    }
  }

  if (!session) {
    return (
      <div style={{ padding: 20 }}>
        Session introuvable (id: {sessionId})
      </div>
    );
  }

  return (
    <SessionView
      event={selectedEvent}
      session={session}
      speakers={data.speakers || []}
    />
  );
}
