"use client";

import { useState } from "react";
import styles from "./Planning.module.css";

const START = 9;
const END = 13;
const HOUR_WIDTH = 200;

export default function PlanningPage({ events = [] }) {
  const [selected, setSelected] = useState(null);

  if (!events.length) return <p>Aucun événement</p>;

  const sessions = events[0].sessions.map((s) => {
    const [h, m] = s.time.split(":").map(Number);

    const left =
      (h - START) * HOUR_WIDTH + (m / 60) * HOUR_WIDTH;

    return {
      ...s,
      left,
      width: (s.duration || 1) * HOUR_WIDTH,
    };
  });

  return (
    <div className={styles.container}>

      <div className={styles.header}>
        {Array.from({ length: END - START }).map((_, i) => (
          <div key={i} className={styles.hour}>
            {formatHour(START + i)}
          </div>
        ))}
      </div>

      
      <div className={styles.timeline}>

        {/* LIGNES VERTICALES */}
        {Array.from({ length: END - START }).map((_, i) => (
          <div
            key={i}
            className={styles.vline}
            style={{ left: i * HOUR_WIDTH }}
          />
        ))}

        {/* EVENTS */}
        {sessions.map((s) => (
          <div
            key={s.id}
            className={styles.event}
            style={{
              left: s.left,
              width: s.width,
              top: 40,
            }}
            onClick={() => setSelected(s)}
          >
            <strong>{s.title}</strong>
            <br />
            <small>{s.speaker}</small>
          </div>
        ))}
      </div>

      {/* SIDEBAR */}
      <div className={styles.sidebar}>
        {selected ? (
          <>
            <h2>{selected.title}</h2>
            <p>{selected.time}</p>
            <p>{selected.speaker}</p>
            <p>{selected.description}</p>
          </>
        ) : (
          <p>Clique sur une session</p>
        )}
      </div>
    </div>
  );
}

function formatHour(h) {
  const suffix = h >= 12 ? "PM" : "AM";
  const hour = h > 12 ? h - 12 : h;
  return `${hour}:00 ${suffix}`;
}