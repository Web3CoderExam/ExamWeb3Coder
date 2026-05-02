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
        <span className={styles.eyebrow}>Speakers</span>
        <h1>Intervenants</h1>
        <p>Cliquez sur un intervenant pour voir les d&eacute;tails et ses sessions.</p>
      </div>

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

      {selected && (
        <div
          className={styles.overlay}
          onClick={() => setSelected(null)}
        />
      )}

      {selected && (
        <div className={styles.panel}>
          <div className={styles.panelContent}>
            <div className={styles.header}>
              <div className={styles.headerTop}>
                <img src={selected.avatar} alt={selected.name} />

                <div>
                  <h2 className={styles.title}>{selected.name}</h2>
                  <p className={styles.role}>{selected.role}</p>
                </div>

                <button
                  className={styles.close}
                  onClick={() => setSelected(null)}
                  type="button"
                  aria-label="Fermer"
                >
                  &times;
                </button>
              </div>
            </div>

            <div className={styles.section}>
              <h4>BIOGRAPHIE</h4>
              <p className={styles.bio}>{selected.bio}</p>
            </div>

            <div className={styles.section}>
              <h4>RESEAUX</h4>
              <div className={styles.socials}>
                <button type="button">Twitter</button>
                <button type="button">LinkedIn</button>
                <button type="button">Site web</button>
              </div>
            </div>

            <div className={styles.section}>
              <h4>SESSIONS</h4>

              {getSessions(selected.id).map((s) => (
                <div key={s.id} className={styles.session}>
                  <strong>{s.title}</strong>
                  <small>{s.time} &bull; {s.room}</small>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
