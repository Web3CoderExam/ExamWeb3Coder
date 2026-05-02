import SessionView from "./SessionView";
import data from "@/data/mockData.json";

export default async function Page({ params }) {
  const { id } = await params;

  const sessionId = String(id);

  let session = null;

  for (const event of data.events) {
    session = event.sessions.find(
      (s) => String(s.id) === sessionId
    );

    if (session) break;
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
      session={session}
      speakers={data.speakers}
    />
  );
}