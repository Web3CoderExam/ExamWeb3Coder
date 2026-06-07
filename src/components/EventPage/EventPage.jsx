"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useFavorites from "@/hooks/useFavorites";
import styles from "./EventPage.module.css";

function getSessionTimeRange(session) {
  const start = session.startTime
    ? new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  const end = session.endTime
    ? new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  return end ? `${start} - ${end}` : start;
}

export default function EventPage({ event, sessions, defaultFavorites }) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites(defaultFavorites);

  const dateText =
    event.startDate === event.endDate
      ? event.startDate
      : `${event.startDate} - ${event.endDate}`;

  const isLive = (session) => {
    const now = new Date();
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    return now >= start && now <= end;
  };

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div>
          <span className={styles.badge}>Événement</span>
          <h1>{event.title}</h1>
          <p>{event.description}</p>
          <div className={styles.meta}>
            <span>{dateText}</span>
            <span>{event.location}</span>
            <span>{sessions.length} sessions</span>
          </div>
        </div>
        <button
          type="button"
          className={styles.planningBtn}
          onClick={() => router.push(`/planning?event=${event.id}`)}
        >
          Voir le planning complet
        </button>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <div>
            <span className={styles.badge}>Programme</span>
            <h2>Sessions</h2>
          </div>
        </div>

        <div className={styles.grid}>
          {sessions.map((session) => {
            const live = isLive(session);
            const favorite = isFavorite(session.id);

            return (
              <article key={session.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={styles.time}>{getSessionTimeRange(session)}</span>
                  {live && <span className={styles.live}>LIVE</span>}
                </div>
                <h3>{session.title}</h3>
                <p>{session.description}</p>
                <div className={styles.cardMeta}>
                  <span>{session.room}</span>
                  <span>{((new Date(session.endTime) - new Date(session.startTime)) / (1000 * 60 * 60)).toFixed(1)}h</span>
                  <span>{session.capacity} places</span>
                </div>

                {session.speakers && session.speakers.length > 0 && (
                  <div className={styles.speakers}>
                    {session.speakers.map((speaker) => (
                      <Link key={speaker.id} href={`/speakers/${speaker.id}`} className={styles.speaker}>
                        <Image
                          src={speaker.photo || "/default-avatar.png"}
                          alt={speaker.name}
                          width={48}
                          height={48}
                        />
                        <div>
                          <strong>{speaker.name}</strong>
                          <span>{speaker.bio || "Intervenant"}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}

                <div className={styles.cardActions}>
                  <Link href={`/sessions/${session.id}`} className={styles.detailsBtn}>
                    Voir la session
                  </Link>
                  <button
                    type="button"
                    className={favorite ? styles.favoriteActive : styles.favoriteBtn}
                    onClick={() => toggleFavorite(session.id)}
                  >
                    {favorite ? "Retirer" : "Ajouter"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}