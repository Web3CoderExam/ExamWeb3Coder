"use client";

import { useState, useMemo } from "react";
import styles from "./PlanningPage.module.css";

export default function PlanningPage({ events = [] }) {
  const [selected, setSelected] = useState(null);
  const [activeCell, setActiveCell] = useState(null);

  if (!events.length) return <p>Aucun événement</p>;

  const event = events[0];
  const sessions = event.sessions;

  const rooms = ["Room A", "Room B", "Room C"];

  const dates = [event.date];
  const [selectedDate, setSelectedDate] = useState(event.date);

  //  END TIME
  const getEndTime = (time, duration) => {
    const [h, m] = time.split(":").map(Number);
    const d = new Date();
    d.setHours(h, m + duration * 60);
    return d.toTimeString().slice(0, 5);
  };

  //  LIVE
  const now = new Date();

  const isLive = (session) => {
    const [h, m] = session.time.split(":").map(Number);

    const start = new Date();
    start.setHours(h, m, 0);

    const end = new Date(start);
    end.setMinutes(end.getMinutes() + session.duration * 60);

    return now >= start && now <= end;
  };

  // HOURS
  const hoursUsed = useMemo(() => {
    const hours = sessions.map((s) =>
      parseInt(s.time.split(":")[0])
    );

    const min = Math.min(...hours);
    const max = Math.max(...hours);

    return {
      start: Math.max(0, min - 1),
      end: max + 2,
    };
  }, [sessions]);

  const hours = Array.from({
    length: hoursUsed.end - hoursUsed.start + 1,
  });

  return (
    <div className={styles.container}>

      {/* DATE TABS */}
      <div className={styles.dateTabs}>
        {dates.map((d) => {
          const isActive = selectedDate === d;

          return (
            <div
              key={d}
              className={`${styles.dateTab} ${
                isActive ? styles.activeTab : ""
              }`}
              onClick={() => setSelectedDate(d)}
            >
              {new Date(d).toLocaleDateString("fr-FR", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </div>
          );
        })}
      </div>

      {/* HEADER */}
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
        {hours.map((_, i) => {
          const hour = hoursUsed.start + i;

          return (
            <div key={hour} className={styles.row}>
              <div className={styles.timeCell}>
                {hour}:00
              </div>

              {rooms.map((room) => {
                const eventItem = sessions.find(
                  (s) =>
                    s.room === room &&
                    parseInt(s.time) === hour
                );

                const cellId = room + hour;
                const isActive = activeCell === cellId;

                return (
                  <div key={cellId} className={styles.cell}>

                    {eventItem && (
                      <div
                        className={styles.event}
                        onClick={() => {
                          setSelected(eventItem);
                          setActiveCell(cellId);
                        }}
                      >
                        <strong>{eventItem.title}</strong>
                        <small>{eventItem.speaker}</small>

                        {isLive(eventItem) && (
                          <span className={styles.liveBadge}>
                            LIVE
                          </span>
                        )}
                      </div>
                    )}

                    {selected && isActive && (
                      <div className={styles.inlinePopup}>
                        <div className={styles.popupHeader}>
                          <h4>{selected.title}</h4>
                          <span onClick={() => {
                            setSelected(null);
                            setActiveCell(null);
                          }}>
                            ✕
                          </span>
                        </div>

                        <div className={styles.popupRow}>
                          {selected.time} -{" "}
                          {getEndTime(
                            selected.time,
                            selected.duration
                          )}
                        </div>

                        <div className={styles.popupRow}>
                          {selected.speaker}
                        </div>

                        <div className={styles.popupRow}>
                          {selected.room}
                        </div>

                        {isLive(selected) && (
                          <div className={styles.liveText}>
                            🔴 Session en cours
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}