"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import styles from "./PlanningPage.module.css";

export default function PlanningPage({ events = [] }) {
  const router = useRouter();

  const [selected, setSelected] = useState(null);
  const [activeCell, setActiveCell] = useState(null);

  if (!events.length) return <p>Aucun événement</p>;

  const event = events[0];
  const sessions = event.sessions;

  const rooms = ["Room A", "Room B", "Room C"];

  // LIVE CHECK 
  const isLive = (session) => {
    const now = new Date();

    const [h, m] = session.time.split(":").map(Number);

    const start = new Date();
    start.setHours(h, m, 0, 0);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + session.duration * 60);

    return now >= start && now <= end;
  };

  // heures du planning
  const hours = useMemo(() => {
    const allHours = sessions.map((s) =>
      parseInt(s.time.split(":")[0])
    );

    const min = Math.min(...allHours);
    const max = Math.max(...allHours);

    return Array.from({ length: max - min + 2 }, (_, i) => min - 1 + i);
  }, [sessions]);

  return (
    <div className={styles.container}>

      {/* HEADER */}
      <div className={styles.eventHeader}>
        <h2 className={styles.eventTitle}>{event.title}</h2>
      </div>

      {/* GRID HEADER */}
      <div className={styles.headerGrid}>
        <div></div>
        {rooms.map((room) => (
          <div key={room} className={styles.headerCell}>
            {room}
          </div>
        ))}
      </div>


      {/* GRID */}
      <div className={styles.grid}>
        {hours.map((hour) => (
          <div key={hour} className={styles.row}>
            <div className={styles.timeCell}>{hour}:00</div>


            {rooms.map((room) => {
              const session = sessions.find((s) => {
                const sessionHour = parseInt(s.time.split(":")[0]);
                return s.room === room && sessionHour === hour;
              });

              const cellId = room + hour;

              return (
                <div key={cellId} className={styles.cell}>

                  {session && (
                    <div
                      className={styles.event}
                      onClick={() => {
                        setSelected(session);
                        setActiveCell(cellId);
                      }}
                    >
                      <strong>{session.title}</strong>
                      <small>{session.speaker}</small>

                      {isLive(session) && (
                        <span className={styles.liveBadge}>
                          LIVE
                        </span>
                      )}
                    </div>
                  )}

                  {/* POPUP */}
                  {selected && activeCell === cellId && (
                    <div className={styles.inlinePopup}>
                      <div className={styles.popupHeader}>
                        <h4>{selected.title}</h4>
                        <span
                          onClick={() => {
                            setSelected(null);
                            setActiveCell(null);
                          }}
                        >
                          ✕
                        </span>
                      </div>

                      <div className={styles.popupRow}>
                        {selected.time}
                      </div>

                      <div className={styles.popupRow}>
                        {selected.speaker}
                      </div>

                      <div className={styles.popupRow}>
                        {selected.room}
                      </div>

                      {isLive(selected) && (
                        <div className={styles.liveText}>
                          🔴 Live
                        </div>
                      )}

                      {/* ACTION */}
                      <button
                        className={styles.joinBtn}
                        onClick={() =>
                          router.push(`/sessions/${selected.id}`)
                        }
                      >
                        Rejoindre la session
                      </button>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}