import SessionView from "./SessionView";
import { getDefaultFavorites, getSessionById, getSpeakers } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export default async function Page({ params }) {
  const { id } = await params;
  const sessionId = String(id);
  const [sessionData, speakers, defaultFavorites] = await Promise.all([
    getSessionById(sessionId),
    getSpeakers(),
    getDefaultFavorites(),
  ]);

  if (!sessionData) {
    return (
      <div style={{ padding: 20 }}>
        Session introuvable (id: {sessionId})
      </div>
    );
  }

  return (
    <SessionView
      event={sessionData.event}
      session={sessionData.session}
      speakers={speakers}
      defaultFavorites={defaultFavorites}
    />
  );
}
