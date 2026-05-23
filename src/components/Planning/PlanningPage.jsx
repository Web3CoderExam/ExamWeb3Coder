"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useFavorites from "@/hooks/useFavorites";
import styles from "./PlanningPage.module.css";

const DEFAULT_ROOMS = ["Room A", "Room B", "Room C"];
const START_HOUR = 9;
const END_HOUR = 16;

function safeString(value, fallback = "") {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "object") {
    if (value.name && typeof value.name === "string") return value.name;
    console.error("Objet non affichable :", value);
    return fallback;
  }
  return fallback;
}

function getSessionTimeRange(session) {
  const start = session.startTime
    ? new Date(session.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  const end = session.endTime
    ? new Date(session.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "";
  return end ? `${start} - ${end}` : start;
}

function getDuration(startTime, endTime) {
  if (!startTime || !endTime) return "—";
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMinutes = Math.round((end - start) / (1000 * 60));
  const hours = Math.floor(diffMinutes / 60);
  const minutes = diffMinutes % 60;
  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} h`;
  return `${hours} h ${minutes} min`;
}

function formatDate(value) {
  if (!value) return "";
  return new Date(value).toLocaleDateString("fr-FR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getRoomName(room) {
  if (!room) return "Salle inconnue";
  if (typeof room === "string") return room;
  if (typeof room === "object" && room.name && typeof room.name === "string") return room.name;
  console.error("Room non reconnue :", room);
  return "Salle inconnue";
}

export default function PlanningPage({
  events = [],
  speakers = [],
  selectedEventId,
  defaultFavorites = [],
}) {
  const router = useRouter();
  const [selected, setSelected] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState("Toutes");
  const { isFavorite, toggleFavorite } = useFavorites(defaultFavorites);
  const [isClient, setIsClient] = useState(false);
  const [currentTime, setCurrentTime] = useState(null);

  useEffect(() => {
    setIsClient(true);
    setCurrentTime(new Date());
    const interval = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const event = events.find((item) => String(item.id) === String(selectedEventId)) || events[0];
  if (!event) return <p>Aucun événement</p>;

  const startDate = event?.startDate || event?.date;
  const endDate = event?.endDate || event?.date;
  const formattedStart = formatDate(startDate);
  const formattedEnd = formatDate(endDate);
  const dateText = formattedStart === formattedEnd ? formattedStart : `${formattedStart} - ${formattedEnd}`;

  const sessions = event?.sessions ?? [];

  const roomsSet = new Set(DEFAULT_ROOMS);
  sessions.forEach((s) => {
    const roomName = getRoomName(s.room);
    if (roomName !== "Salle inconnue") roomsSet.add(roomName);
  });
  const rooms = Array.from(roomsSet);

  const visibleRooms = selectedRoom === "Toutes" ? rooms : [selectedRoom];
  const visibleSessions = sessions.filter((s) => {
    const sRoom = getRoomName(s.room);
    return selectedRoom === "Toutes" || sRoom === selectedRoom;
  });

  const getSessionSpeakers = (session) => {
    const speakerIds = session.speakers?.map((s) => s.speaker?.id || s.speakerId) || [];
    return speakers.filter((speaker) => speakerIds.includes(speaker.id));
  };

  const isLive = (session) => {
    if (!isClient || !currentTime) return false;
    if (!session.startTime || !session.endTime) return false;
    const start = new Date(session.startTime);
    const end = new Date(session.endTime);
    return currentTime >= start && currentTime <= end;
  };

  const hours = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);
  const openSession = (session) => setSelected((prev) => (prev?.id === session.id ? null : session));
  const selectRoom = (room) => {
    setSelectedRoom(room);
    setSelected(null);
  };

  const scheduleClassName =
    selectedRoom === "Toutes" ? styles.schedule : `${styles.schedule} ${styles.singleRoom}`;
  const roomGridStyle = {
    gridTemplateColumns: `74px repeat(${visibleRooms.length}, minmax(0, 1fr))`,
  };

  return (
    <div className={styles.container}>
      <div className={styles.eventHeader}>
        <div>
          <span className={styles.eyebrow}>Planning</span>
          <h2 className={styles.eventTitle}>{safeString(event.title)}</h2>
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
                    if (!s.startTime) return false;
                    const sessionHour = new Date(s.startTime).getHours();
                    const sRoom = getRoomName(s.room);
                    return sRoom === room && sessionHour === hour;
                  });
                  const sessionSpeakers = session ? getSessionSpeakers(session) : [];
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
                          <strong>{safeString(session.title)}</strong>
                          {sessionSpeakers.length > 0 && (
                            <small>
                              {sessionSpeakers.map((speaker) => safeString(speaker.name)).join(", ")}
                            </small>
                          )}
                          {isLive(session) && <span className={styles.liveBadge}>LIVE</span>}
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
                  <h3>{safeString(selected.title)}</h3>
                  {isLive(selected) && <div className={styles.liveText}>Live maintenant</div>}
                </div>
                <button
                  type="button"
                  className={styles.closeBtn}
                  onClick={() => setSelected(null)}
                >
                  &times;
                </button>
              </div>
              <div className={styles.detailsContent}>
                <div className={styles.detailList}>
                  <div>
                    <span>Date</span>
                    <strong>{new Date(selected.startTime).toLocaleDateString('fr-FR')}</strong>
                  </div>
                  <div>
                    <span>Horaire</span>
                    <strong>{getSessionTimeRange(selected)}</strong>
                  </div>
                  <div>
                    <span>Salle</span>
                    <strong>{getRoomName(selected.room)}</strong>
                  </div>
                  <div>
                    <span>Durée</span>
                    <strong>{getDuration(selected.startTime, selected.endTime)}</strong>
                  </div>
                </div>
                {getSessionSpeakers(selected).length > 0 && (
                  <p className={styles.description}>
                    Intervenant{getSessionSpeakers(selected).length > 1 ? "s" : ""} :{" "}
                    {getSessionSpeakers(selected)
                      .map((s) => safeString(s.name))
                      .join(", ")}
                  </p>
                )}
                {selected.description && (
                  <p className={styles.description}>{safeString(selected.description)}</p>
                )}
              </div>
              <button
                type="button"
                className={isFavorite(selected.id) ? styles.favoritePanelActive : styles.favoritePanelBtn}
                onClick={() => toggleFavorite(selected.id)}
              >
                {isFavorite(selected.id) ? "Retirer des favoris" : "Ajouter aux favoris"}
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
              <span className={styles.detailsLabel}>Détails</span>
              <h3>Sélectionnez une carte</h3>
              <p>Les informations de la session apparaissent ici sans cacher le planning.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}