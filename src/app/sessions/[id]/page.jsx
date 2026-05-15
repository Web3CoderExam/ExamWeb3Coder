import SessionView from "./SessionView";
import data from "@/data/mockData.json";

export default async function Page({ params }) {
  const { id } = await params;

  const sessionId = String(id);

  let session = null;
  let event = null;

  for (const item of data.events) {
    session = item.sessions.find(
      (s) => String(s.id) === sessionId
    );

    if (session) {
      event = item;
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
      event={event}
      session={session}
      speakers={data.speakers}
      defaultFavorites={data.favorites}
    />
  );
}
