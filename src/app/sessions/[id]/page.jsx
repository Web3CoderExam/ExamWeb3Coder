import SessionView from "./SessionView";
import data from "@/data/mockData.json";

export default async function Page({ params }) {
  const { id } = await params;

  const sessionId = String(id);

  let session = null;
<<<<<<< HEAD
  let selectedEvent = null;
=======
  let event = null;
>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4

  for (const item of data.events) {
    session = item.sessions.find(
      (s) => String(s.id) === sessionId
    );

    if (session) {
<<<<<<< HEAD
      selectedEvent = event;
=======
      event = item;
>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4
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
<<<<<<< HEAD
      event={selectedEvent}
      session={session}
      speakers={data.speakers || []}
=======
      event={event}
      session={session}
      speakers={data.speakers}
      defaultFavorites={data.favorites}
>>>>>>> 42f4429e0c79a5cd7bb243449f4fcf600ba2d8e4
    />
  );
}
