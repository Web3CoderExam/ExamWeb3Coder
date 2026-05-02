import FavoritesView from "@/components/Favorites/FavoritesView";

export default function Page({ params }) {
  const event = null;
  const sessions = [];

  if (!event) {
    return (
      <div style={{ padding: 40 }}>
          Mes favoris
        <p>Aucun événement sélectionné</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Mes favoris</h1>

      <FavoritesView
        eventId={event.id}
        sessions={sessions}
      />
    </div>
  );
}