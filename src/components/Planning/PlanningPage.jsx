"use client";

import { useState } from "react";
import styles from "./PlanningPage.module.css";
import { Clock, Mic, MapPin, X } from "lucide-react";

const START = 9;
const END = 18;
const HOUR_HEIGHT = 100;

export default function PlanningPage({ events = [] }) {
  const [selected, setSelected] = useState(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  if (!events.length) return <p>Aucun événement</p>;

  const sessions = events[0].sessions;

  const rooms = ["Room A", "Room B", "Room C"];

  const gridTemplate = `80px repeat(${rooms.length}, 250px)`;

  return (
    <div className={styles.container}>

      {/* HEADER */}
      <div
        className={styles.header}
        style={{ gridTemplateColumns: gridTemplate }}
      >
        <div></div>
        {rooms.map((room) => (
          <div key={room} className={styles.roomHeader}>
            {room}
          </div>
        ))}
      </div>

      {/* GRID */}
      <div
        className={styles.grid}
        style={{ gridTemplateColumns: gridTemplate }}
      >

        {/* HOURS */}
        <div className={styles.timeColumn}>
          {Array.from({ length: END - START }).map((_, i) => (
            <div key={i} className={styles.timeCell}>
              {START + i}:00
            </div>
          ))}
        </div>

        {/* ROOMS */}
        {rooms.map((room) => (
          <div key={room} className={styles.roomColumn}>

            {sessions
              .filter((s) => s.room === room)
              .map((s) => {
                const [h, m] = s.time.split(":").map(Number);

                const top =
                  (h - START) * HOUR_HEIGHT +
                  (m / 60) * HOUR_HEIGHT;

                const height = (s.duration || 1) * HOUR_HEIGHT;

                return (
                  <div
                    key={s.id}
                    className={styles.event}
                    style={{ top, height }}
                    onClick={(e) => {
                      setSelected(s);
                      setPos({
                        x: e.clientX,
                        y: e.clientY,
                      });
                    }}
                  >
                    <strong>{s.title}</strong>
                    <br />
                    <small>{s.speaker}</small>
                  </div>
                );
              })}
          </div>
        ))}
      </div>

      {/* SMALL CARD */}
      {selected && (
        <div
          className={styles.smallCard}
          style={{
            top: Math.min(pos.y, window.innerHeight - 200),
            left: Math.min(pos.x + 15, window.innerWidth - 280),
            transform: "translateY(-50%)",
          }}
        >

          <div className={styles.smallHeader}>
            <h4>{selected.title}</h4>

            <span
              className={styles.closeX}
              onClick={() => setSelected(null)}
            >
              <X size={16} />
            </span>
          </div>

          <div className={styles.smallRow}>
            <Clock size={14} /> {selected.time}
          </div>

          <div className={styles.smallRow}>
            <Mic size={14} /> {selected.speaker}
          </div>

          <div className={styles.smallRow}>
            <MapPin size={14} /> {selected.room}
          </div>

          {selected.description && (
            <p className={styles.smallDesc}>
              {selected.description}
            </p>
          )}

        </div>
      )}

    </div>
  );
}