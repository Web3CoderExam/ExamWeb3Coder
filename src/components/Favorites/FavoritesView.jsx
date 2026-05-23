"use client";

import Link from "next/link";
import useFavorites from "@/hooks/useFavorites";
import styles from "./FavoritesView.module.css";

function getSessionTimeRange(session) {
  const start = session.startTime ? new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  const end = session.endTime ? new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "";
  return end ? `${start} - ${end}` : start;
}

export default function FavoritesView({ sessions, defaultFavorites }) {
  const { favorites, toggleFavorite } = useFavorites(defaultFavorites);

  const favoriteSessions = sessions
    .filter((session) => favorites.includes(session.id))
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div>
          <span className={styles.badge}>Itinéraire personnel</span>
          <h1>Mes favoris</h1>
          <p>Votre sélection personnelle de sessions</p>
        </div>
        <span className={styles.counter}>
          {favoriteSessions.length} session{favoriteSessions.length > 1 ? "s" : ""}
        </span>
      </section>

      <section className={styles.content}>
        {favoriteSessions.length === 0 ? (
          <div className={styles.empty}>
            <h2>Aucune session favorite</h2>
            <p>
              Ajoute des sessions depuis la page détail ou le planning pour
              préparer ton parcours pendant cet événement.
            </p>
            <Link href="/planning" className={styles.planningLink}>
              Voir le planning
            </Link>
          </div>
        ) : (
          <div className={styles.grid}>
            {favoriteSessions.map((session) => (
              <article key={session.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.time}>{getSessionTimeRange(session)}</span>
                  <span className={styles.room}>{session.room?.name || session.room}</span>
                </div>
                <h2>{session.title}</h2>
                <p>{session.description}</p>
                <div className={styles.meta}>
                  <span>{session.eventTitle}</span>
                  <span>{session.duration ? `${session.duration}h` : "—"}</span>
                  <span>{session.capacity} places</span>
                </div>
                <div className={styles.actions}>
                  <Link href={`/sessions/${session.id}`} className={styles.detailsLink}>
                    Voir la session
                  </Link>
                  <button
                    type="button"
                    className={styles.removeButton}
                    onClick={() => toggleFavorite(session.id)}
                  >
                    Retirer
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}