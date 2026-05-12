"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useFavorites from "@/hooks/useFavorites";
import styles from "./PlanningPage.module.css";

export default function PlanningPage({
  events = [],
  selectedEventId,
  defaultFavorites = [],
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("Toutes");
  const { isFavorite, toggleFavorite } = useFavorites(defaultFavorites);

  const event =
    events.find((item) => String(item.id) === String(selectedEventId)) ||
    events[0];
  const startDate = event?.startDate || event?.date;
  const endDate = event?.endDate || event?.date;
  const dateText = startDate === endDate ? startDate : `${startDate} - ${endDate}`;

  const sessions = event?.sessions ?? [];
  const rooms = Array.from(new Set(sessions.map((session) => session.room)));
  const visibleRooms = selectedRoom === "Toutes" ? rooms : [selectedRoom];
  const visibleSessions = sessions.filter((session) => {
    return selectedRoom === "Toutes" || session.room === selectedRoom;
  });

  const isLive = (session) => {
    const now = new Date();
    const sessionDate = session.date || startDate;
    const start = new Date(`${sessionDate}T${session.time}`);
    const end = new Date(start.getTime() + session.duration * 60 * 60 * 1000);

    return now >= start && now <= end;
  };

  const hours = visibleSessions.length
    ? (() => {
        const allHours = visibleSessions.map((s) => parseInt(s.time.split(":")[0], 10));
        const min = Math.min(...allHours);
        const max = Math.max(...allHours);

        return Array.from({ length: max - min + 2 }, (_, i) => min - 1 + i);
      })()
    : [];

  const openSession = (session) => {
    setSelected((current) => (current?.id === session.id ? null : session));
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
    setSelected(null);
  };

  if (!event) return <p>Aucun &eacute;v&eacute;nement</p>;

  const scheduleClassName =
    selectedRoom === "Toutes"
      ? styles.schedule
      : `${styles.schedule} ${styles.singleRoom}`;
  const roomGridStyle = {
    gridTemplateColumns: `74px repeat(${visibleRooms.length}, minmax(0, 1fr))`,
  };

  return (
    <div className={styles.container}>
      <div className={styles.eventHeader}>
        <div>
          <span className={styles.eyebrow}>Planning</span>
          <h2 className={styles.eventTitle}>{event.title}</h2>
        </div>
        <span className={styles.eventDate}>{dateText}</span>
      </div>

      <div className={styles.roomFilters}>
        {["Toutes", ...rooms].map((room) => (
          <button
            key={room}
            type="button"
            className={selectedRoom === room ? styles.roomActive : styles.roomBtn}
            onClick={() => selectRoom(room)}
          >
            {room}
          </button>
        ))}
      </div>

      <div className={styles.planningShell}>
        <div className={scheduleClassName}>
          <div className={styles.headerGrid} style={roomGridStyle}>
            <div></div>
            {visibleRooms.map((room) => (
              <div key={room} className={styles.headerCell}>
                {room}
              </div>
            ))}
          </div>

          <div className={styles.grid}>
            {hours.map((hour) => (
              <div key={hour} className={styles.row} style={roomGridStyle}>
                <div className={styles.timeCell}>{hour}:00</div>

                {visibleRooms.map((room) => {
                  const session = visibleSessions.find((s) => {
                    const sessionHour = parseInt(s.time.split(":")[0], 10);
                    return s.room === room && sessionHour === hour;
                  });

                  const isSelected = selected?.id === session?.id;
                  const eventClassName = isSelected
                    ? `${styles.event} ${styles.eventSelected}`
                    : styles.event;

                  return (
                    <div key={`${room}-${hour}`} className={styles.cell}>
                      {session && (
                        <button
                          type="button"
                          className={eventClassName}
                          onClick={() => openSession(session)}
                        >
                          <strong>{session.title}</strong>
                          <small>{session.time} &bull; {session.room}</small>

                          {isLive(session) && (
                            <span className={styles.liveBadge}>LIVE</span>
                          )}

                          {isFavorite(session.id) && (
                            <span className={styles.favoriteBadge}>Favori</span>
                          )}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <aside className={styles.detailsPanel}>
          {selected ? (
            <>
              <div className={styles.detailsHeader}>
                <div>
                  <span className={styles.detailsLabel}>Session</span>
                  <h3>{selected.title}</h3>
                </div>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setSelected(null)}
                  aria-label="Fermer les details"
                >
                  &times;
                </button>
              </div>

              <div className={styles.detailList}>
                <div>
                  <span>Horaire</span>
                  <strong>{selected.time}</strong>
                </div>
                <div>
                  <span>Salle</span>
                  <strong>{selected.room}</strong>
                </div>
                <div>
                  <span>Dur&eacute;e</span>
                  <strong>{selected.duration}h</strong>
                </div>
              </div>

              {selected.description && (
                <p className={styles.description}>{selected.description}</p>
              )}

              {isLive(selected) && (
                <div className={styles.liveText}>Live maintenant</div>
              )}

              <button
                type="button"
                className={
                  isFavorite(selected.id)
                    ? styles.favoritePanelActive
                    : styles.favoritePanelBtn
                }
                onClick={() => toggleFavorite(selected.id)}
              >
                {isFavorite(selected.id)
                  ? "Retirer des favoris"
                  : "Ajouter aux favoris"}
              </button>

              <button
                type="button"
                className={styles.joinBtn}
                onClick={() => router.push(`/sessions/${selected.id}`)}
              >
                Rejoindre la session
              </button>
            </>
          ) : (
            <div className={styles.emptyPanel}>
              <span className={styles.detailsLabel}>D&eacute;tails</span>
              <h3>S&eacute;lectionnez une carte</h3>
              <p>Les informations de la session apparaissent ici sans cacher le planning.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
