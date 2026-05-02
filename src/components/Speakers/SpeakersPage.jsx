import styles from "./SpeakersPage.module.css";
import SpeakerCard from "./SpeakerCard";

export default function SpeakersPage({ speakers, sessions }) {
  const getSessions = (id) => {
    return (sessions || []).filter((session) => session.speakerId === id);
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
