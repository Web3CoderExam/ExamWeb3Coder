export default function EventCard({ session, isLive, onClick }) {
  return (
    <div className={`card ${isLive ? "live" : ""}`} onClick={() => onClick(session)}>

      {/* BADGE LIVE */}
      {isLive && <span className="badge">LIVE</span>}

      {/* TITLE */}
      <h3>{session.title}</h3>

      {/* TIME + ROOM */}
      <p>
        {session.time} • {session.room}
      </p>

      {/* SPEAKERS */}
      <div className="speakers">
        {session.speakers?.map((s, i) => (
          <img key={i} src={s.photo} title={s.name} />
        ))}
      </div>

    </div>
  );
}