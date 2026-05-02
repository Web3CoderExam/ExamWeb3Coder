"use client";

import { useRouter } from "next/navigation";
import useFavorites from "@/hooks/useFavorites";
import styles from "./EventPage.module.css";

export default function EventPage({ event, sessions = [], speakers = [] }) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites(event.id);

  const getSpeakerName = (session) => {
    const speaker = speakers.find((item) => item.id === session.speakerId);
    return speaker?.name || session.speaker || "Intervenant";
  };

  const getDuration = (session) => session.duration || 1;
  const getRoom = (session) => session.room || "Salle principale";

  const isLive = (session) => {
    const now = new Date();
    const start = new Date(`${event.date}T${session.time}`);
    const end = new Date(start.getTime() + getDuration(session) * 60 * 60 * 1000);

    return now >= start && now <= end;
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.title}>{event.title}</h1>
          <p className={styles.subtitle}>{event.description}</p>

          <div className={styles.meta}>
            <span>{event.date}</span>
            <span>{event.location}</span>
          </div>

          <button
            type="button"
            className={styles.planningBtn}
            onClick={() => router.push(`/planning?event=${event.id}`)}
          >
            Voir le planning complet
          </button>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Sessions</h2>

          <div className={styles.grid}>
            {sessions.map((session) => {
              const live = isLive(session);
              const favorite = isFavorite(session.id);

              return (
                <div key={session.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    {live && <span className={styles.live}>LIVE</span>}
                    <button
                      type="button"
                      className={styles.favBtn}
                      onClick={() => toggleFavorite(session.id)}
                    >
                      {favorite ? "Favori" : "Ajouter"}
                    </button>
                  </div>

                  <h3>{session.title}</h3>

                  <div className={styles.cardMeta}>
                    <span>{session.time}</span>
                    <span>{getRoom(session)}</span>
                  </div>

                  <div className={styles.speakerMini}>
                    <span>{getSpeakerName(session)}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
