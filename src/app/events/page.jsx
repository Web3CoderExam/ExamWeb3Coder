"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import data from "../../data/mockData.json";
import "./event.css";

export default function EventsPage() {
  const [event, setEvent] = useState(null);
  const router = useRouter();

  // 🔥 Charger les données depuis Mockdata.json
  useEffect(() => {
    if (data.events && data.events.length > 0) {
      setEvent(data.events[0]); // on prend le premier event
    }
  }, []);

  if (!event) return <p className="loading">Chargement...</p>;

  return (
      <div className="home-container">

        <div className="hero">
          <h1>{event.title}</h1>

          <p className="hero-desc">
            {event.description}
          </p>

          <div className="hero-date">
            📅 {event.date} • 📍 {event.location}
          </div>
        </div>

        <div className="session-header">
          <h2>Sessions</h2>

          <button onClick={() => router.push("/planning")}>
            Voir le planning
          </button>
        </div>

        <div className="sessions">
          {event.sessions && event.sessions.length > 0 ? (
              event.sessions.map((s) => (
                  <div key={s.id} className="session-card">

                    <h3 className="session-title">
                      {s.title}
                    </h3>

                    {/* 🔥 DESCRIPTION */}
                    <p className="desc">
                      {s.description}
                    </p>

                    <div className="meta">
                      <span>🕒 {s.time}</span>
                      <span>📍 {s.room}</span>
                      <span>👤 {s.speaker}</span>
                    </div>

                  </div>
              ))
          ) : (
              <p>Aucune session disponible</p>
          )}
        </div>

      </div>
  );
}