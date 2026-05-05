"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import useFavorites from "@/hooks/useFavorites";
import styles from "./EventPage.module.css";

export default function EventPage({
  event,
  sessions,
  speakers,
  defaultFavorites,
}) {
  const router = useRouter();
  const { isFavorite, toggleFavorite } = useFavorites(defaultFavorites);

  const getSpeaker = (id) => speakers.find((speaker) => speaker.id === id);
  const startDate = event.startDate || event.date;
  const endDate = event.endDate || event.date;
  const dateText = startDate === endDate ? startDate : `${startDate} - ${endDate}`;

  const isLive = (session) => {
    const now = new Date();
    const start = new Date(`${startDate}T${session.time}`);
    const end = new Date(start.getTime() + session.duration * 60 * 60 * 1000);

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
            const speaker = getSpeaker(session.speakerId);
            const live = isLive(session);
            const favorite = isFavorite(session.id);

            return (
              <article
                key={session.id}
                className={styles.card}
              >
                <div className={styles.cardTop}>
                  <span className={styles.time}>{session.time}</span>
                  {live && <span className={styles.live}>LIVE</span>}
                </div>

                <h3>{session.title}</h3>
                <p>{session.description}</p>

                <div className={styles.cardMeta}>
                  <span>{session.room}</span>
                  <span>{session.duration}h</span>
                  <span>{session.capacity} places</span>
                </div>

                {speaker && (
                  <div className={styles.speaker}>
                    <img src={speaker.avatar} alt={speaker.name} />
                    <div>
                      <strong>{speaker.name}</strong>
                      <span>{speaker.role}</span>
                    </div>
                  </div>
                )}

                <div className={styles.cardActions}>
                  <Link
                    href={`/sessions/${session.id}`}
                    className={styles.detailsBtn}
                  >
                    Voir la session
                  </Link>

                  <button
                    type="button"
                    className={
                      favorite ? styles.favoriteActive : styles.favoriteBtn
                    }
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
