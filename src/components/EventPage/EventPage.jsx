"use client";

import { useRouter } from "next/navigation";
import styles from "./EventPage.module.css";

export default function EventPage({ event, sessions, speakers }) {
  const router = useRouter();

  const getSpeaker = (id) => speakers.find((s) => s.id === id);

  const isLive = (session) => {
    const now = new Date();

    const start = new Date(`${event.date}T${session.time}`);
    const end = new Date(start.getTime() + session.duration * 60 * 60 * 1000);

    return now >= start && now <= end;
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>

        {/* HERO */}
        <div className={styles.header}>
          <h1 className={styles.title}>{event.title}</h1>
          <p className={styles.subtitle}>{event.description}</p>

          <div className={styles.meta}>
            <span>{event.date}</span>
            <span>{event.location}</span>
          </div>

          {/* 🔥 CTA PLANNING */}
          <button
            className={styles.planningBtn}
            onClick={() => router.push(`/planning?event=${event.id}`)}
          >
            Voir le planning complet →
          </button>
        </div>

        {/* SESSIONS */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Sessions</h2>

          <div className={styles.grid}>
            {sessions.map((s) => {
              const speaker = getSpeaker(s.speakerId);
              const live = isLive(s);

              return (
                <div key={s.id} className={styles.card}>

                  <div className={styles.cardTop}>
                    {live && <span className={styles.live}>LIVE</span>}
                    <button className={styles.favBtn}>☆</button>
                  </div>

                  <h3>{s.title}</h3>

                  <div className={styles.cardMeta}>
                    <span>{s.time}</span>
                    <span>{s.room}</span>
                  </div>

                  {speaker && (
                    <div className={styles.speakerMini}>
                      <img src={speaker.avatar} alt="" />
                      <span>{speaker.name}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}