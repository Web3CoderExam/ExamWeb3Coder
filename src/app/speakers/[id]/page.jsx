import Link from "next/link";
import data from "@/data/mockData.json";
import styles from "./SpeakerProfile.module.css";

export default async function Page({ params }) {
  const { id } = await params;
  const speaker = data.speakers.find((item) => item.id === id);

  if (!speaker) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <h1>Intervenant introuvable</h1>
          <Link href="/speakers" className={styles.backLink}>
            Retour aux intervenants
          </Link>
        </div>
      </div>
    );
  }

  const sessions = data.events
    .flatMap((event) => event.sessions)
    .filter((session) => session.speakerId === speaker.id);

  const links = speaker.links || {};
  const linkEntries = Object.entries(links);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <img src={speaker.avatar} alt={speaker.name} className={styles.avatar} />

        <div>
          <span className={styles.badge}>Intervenant</span>
          <h1>{speaker.name}</h1>
          <p className={styles.role}>{speaker.role}</p>
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.card}>
          <h2>Biographie</h2>
          <p className={styles.bio}>{speaker.bio}</p>
        </div>

        <div className={styles.card}>
          <h2>Liens externes</h2>

          {linkEntries.length > 0 ? (
            <div className={styles.links}>
              {linkEntries.map(([label, href]) => (
                <a key={label} href={href} target="_blank" rel="noreferrer">
                  {label}
                </a>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Aucun lien ajoute pour le moment.</p>
          )}
        </div>

        <div className={styles.card}>
          <h2>Sessions</h2>

          <div className={styles.sessionList}>
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className={styles.sessionLink}
              >
                <strong>{session.title}</strong>
                <span>
                  {session.time} - {session.room}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className={styles.footer}>
        <Link href="/speakers" className={styles.backLink}>
          Retour aux intervenants
        </Link>
      </div>
    </div>
  );
}
