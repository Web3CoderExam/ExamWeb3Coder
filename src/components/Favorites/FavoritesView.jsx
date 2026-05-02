"use client";
import useFavorites from "@/hooks/useFavorites";

export default function FavoritesView({ eventId, sessions }) {
  const { favorites, toggleFavorite } = useFavorites(eventId);

  const favSessions = sessions
    .filter(s => favorites.some(f => f.sessionId === s.id))
    .sort((a, b) => a.time.localeCompare(b.time));

  if (favSessions.length === 0) {
    return <p>Aucune session en favori</p>;
  }

  return (
    <div>
      {favSessions.map(session => (
        <div key={session.id} style={{ marginBottom: 20 }}>
          <h3>{session.title}</h3>
          <p>{session.time} — {session.room}</p>

          <button onClick={() => toggleFavorite(session.id)}>
            ❌ Retirer
          </button>
        </div>
      ))}
    </div>
  );
}