"use client";

export default function EventCard({ session, isLive, onClick }) {
  if (!session) return null;

  return (
    <div
      className={`card ${isLive ? "live" : ""}`}
      onClick={() => onClick?.(session)}
    >
      {isLive && <span className="badge">LIVE</span>}

      <p>
        {session.time} • {session.room || session.location}
      </p>

      <div className="speakers">
        {session.speakers?.map((s, i) => (
          <img key={i} src={s.photo} title={s.name} />
        ))}
      </div>
    </div>
  );
}