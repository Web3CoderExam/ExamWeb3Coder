"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "./event.css"; // 🔥 IMPORTANT

export default function HomePage() {
  const [event, setEvent] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const data = {
      events: [
        {
          id: 1,
          title: "TechConf 2026",
          date: "lundi 20 avril 2026 - mercredi 22 avril 2026",
          location: "Antananarivo",
          description:
              "The premier technology conference bringing together developers, designers, and tech leaders from around the world.",
          sessions: [
            {
              id: 1,
              title: "Building Scalable Distributed Systems",
              time: "09:00 - 10:30",
              room: "Main Hall",
              description:
                  "Learn how to design and implement distributed systems that can handle millions of requests per second. We'll cover load balancing, data partitioning, and fault tolerance.",
            },
            {
              id: 2,
              title: "Modern Frontend Architecture",
              time: "09:00 - 10:30",
              room: "Room A",
              description:
                  "Explore cutting-edge frontend patterns including micro-frontends, server components, and state management strategies.",
            },
            {
              id: 3,
              title: "AI Ethics in Practice",
              time: "11:00 - 12:30",
              room: "Main Hall",
              description:
                  "Discussing real-world challenges in deploying ethical AI systems.",
            },
          ],
        },
      ],
    };

    setEvent(data.events[0]);
  }, []);

  if (!event) return <p className="loading">Chargement...</p>;

  return (
      <div className="home-container">

        {/* HERO */}
        <div className="hero">
          <h1>{event.title}</h1>
          <p className="hero-desc">{event.description}</p>

          <div className="hero-date">
            📅 {event.date}
          </div>
        </div>

        {/* HEADER */}
        <div className="session-header">
          <h2>Sessions</h2>

          <button onClick={() => router.push("/planning")}>
            Voir le planning
          </button>
        </div>

        {/* SESSIONS */}
        <div className="sessions">
          {event.sessions.map((s) => (
              <div key={s.id} className="session-card">
                <h3>{s.title}</h3>

                <p className="desc">{s.description}</p>

                <div className="meta">
                  <span>🕒 {s.time}</span>
                  <span>📍 {s.room}</span>
                </div>
              </div>
          ))}
        </div>

      </div>
  );
}