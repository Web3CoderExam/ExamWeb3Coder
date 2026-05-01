"use client";

import { useState } from "react";
import styles from "./SpeakersPage.module.css";
import SpeakerCard from "./SpeakerCard";

export default function SpeakersPage({ speakers, sessions }) {
  const [selected, setSelected] = useState(null);

  const getSessions = (id) =>
    (sessions || []).filter((s) => s.speakerId === id);

  return (
    <div className={styles.container}>

    <div className={styles.headerPage}>
  <h1>Intervenants</h1>
  <p>Cliquez sur un intervenant pour voir les détails</p>
</div>

      {/* GRID */}
      <div className={styles.grid}>
        {speakers.map((speaker) => {
          const speakerSessions = getSessions(speaker.id);

          return (
            <SpeakerCard
              key={speaker.id}
              speaker={speaker}
              sessionsCount={speakerSessions.length}
              onClick={() => setSelected(speaker)}
            />
          );
        })}
      </div>

      {/* OVERLAY */}
      {selected && (
        <div
          className={styles.overlay}
          onClick={() => setSelected(null)}
        />
      )}

      {/* PANEL */}
      {selected && (
        <div className={styles.panel}>
          <div className={styles.panelContent}>

            {/* HEADER */}
            <div className={styles.header}>
              <div className={styles.headerTop}>
                <img src={selected.avatar} />

                <div>
                  <h2 className={styles.title}>{selected.name}</h2>
                  <p className={styles.role}>{selected.role}</p>
                </div>

                <span
                  className={styles.close}
                  onClick={() => setSelected(null)}
                >
                  ✕
                </span>
              </div>
            </div>

            {/* BIO */}
            <div className={styles.section}>
              <h4>BIOGRAPHIE</h4>
              <p className={styles.bio}>{selected.bio}</p>
            </div>

            {/* SOCIAL */}
            <div className={styles.section}>
              <h4>RÉSEAUX</h4>
              <div className={styles.socials}>
                <button>Twitter</button>
                <button>LinkedIn</button>
                <button>Site web</button>
              </div>
            </div>

            {/* SESSIONS */}
            <div className={styles.section}>
              <h4>SESSIONS</h4>

              {getSessions(selected.id).map((s) => (
                <div key={s.id} className={styles.session}>
                  <strong>{s.title}</strong>
                  <small>{s.time} • {s.room}</small>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}