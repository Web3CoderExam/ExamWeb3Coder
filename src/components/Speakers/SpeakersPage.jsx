import styles from "./SpeakersPage.module.css";
import SpeakerCard from "./SpeakerCard";

function getSessionSpeakerIds(session) {
  if (Array.isArray(session.speakerIds) && session.speakerIds.length > 0) {
    return session.speakerIds;
  }

  return session.speakerId ? [session.speakerId] : [];
}

export default function SpeakersPage({ speakers, sessions }) {
  const getSessions = (id) => {
    return (sessions || []).filter((session) => {
      return getSessionSpeakerIds(session).includes(id);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.headerPage}>
        <span className={styles.eyebrow}>Speakers</span>
        <h1>Intervenants</h1>
        <p>Consultez la page publique de chaque intervenant.</p>
      </div>

      <div className={styles.grid}>
        {speakers.map((speaker) => {
          const speakerSessions = getSessions(speaker.id);

          return (
            <SpeakerCard
              key={speaker.id}
              speaker={speaker}
              sessionsCount={speakerSessions.length}
              href={`/speakers/${speaker.id}`}
            />
          );
        })}
      </div>
    </div>
  );
}
