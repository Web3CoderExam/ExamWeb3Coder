import Link from "next/link";
import Image from "next/image";
import styles from "./SpeakerProfile.module.css";
import { getSessions, getSpeakerById } from "@/lib/public-data";

export const dynamic = "force-dynamic";

function getSessionSpeakerIds(session) {
  if (Array.isArray(session.speakerIds) && session.speakerIds.length > 0) {
    return session.speakerIds;
  }

  return session.speakerId ? [session.speakerId] : [];
}

export default async function Page({ params }) {
  const { id } = await params;
  const speaker = await getSpeakerById(id);

  if (!speaker) {
    return (
      <main className={styles.container}>
        <div className={styles.notFound}>
          <h1>Intervenant introuvable</h1>
          <Link href="/speakers" className={styles.backLink}>
            Retour aux intervenants
          </Link>
        </div>
      </main>
    );
  }

  const sessions = (await getSessions()).filter((session) =>
    getSessionSpeakerIds(session).includes(speaker.id)
  );

  const links = Object.entries(speaker.links || {});
  const questions = sessions
    .flatMap((session) =>
      (session.questions || []).map((question) => ({
        ...question,
        sessionTitle: session.title,
      }))
    )
    .sort((a, b) => b.upvotes - a.upvotes || new Date(b.createdAt) - new Date(a.createdAt));

  return (
    <main className={styles.container}>
      <div className={styles.page}>
        <Link href="/speakers" className={styles.backLink}>
          Retour aux intervenants
        </Link>

        <section className={styles.hero}>
          <Image
            src={speaker.avatar}
            alt={speaker.name}
            className={styles.avatar}
            width={140}
            height={140}
          />

          <div className={styles.heroText}>
            <span className={styles.badge}>Intervenant</span>
            <h1>{speaker.name}</h1>
            <p>{speaker.role}</p>
          </div>

          <div className={styles.stat}>
            <strong>{sessions.length}</strong>
            <span>session{sessions.length > 1 ? "s" : ""}</span>
          </div>
        </section>

        <section className={styles.content}>
          <article className={styles.card}>
            <h2>Biographie</h2>
            <p className={styles.bio}>{speaker.bio}</p>
          </article>

          <article className={styles.card}>
            <h2>Liens externes</h2>

            {links.length > 0 ? (
              <div className={styles.links}>
                {links.map(([label, href]) => (
                  <a key={label} href={href} target="_blank" rel="noreferrer">
                    {label}
                  </a>
                ))}
              </div>
            ) : (
              <p className={styles.empty}>Aucun lien ajouté pour le moment.</p>
            )}
          </article>
        </section>

        <section className={styles.sessions}>
          <div className={styles.sectionTitle}>
            <span className={styles.badge}>Programme</span>
            <h2>Sessions associées</h2>
          </div>

          <div className={styles.sessionList}>
            {sessions.map((session) => (
              <Link
                key={session.id}
                href={`/sessions/${session.id}`}
                className={styles.sessionCard}
              >
                <div>
                  <strong>{session.title}</strong>
                  <p>{session.eventTitle}</p>
                </div>

                <div className={styles.sessionMeta}>
                  <span>{session.timeRange || session.time}</span>
                  <span>{session.room}</span>
                  <span>{session.duration}h</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className={styles.sessions}>
          <div className={styles.sectionTitle}>
            <span className={styles.badge}>Questions</span>
            <h2>Questions associées</h2>
          </div>

          {questions.length > 0 ? (
            <div className={styles.questionList}>
              {questions.map((question) => (
                <article key={question.id} className={styles.questionCard}>
                  <div>
                    <strong>{question.content}</strong>
                    <p>
                      {question.sessionTitle} - {question.author || "Anonyme"}
                    </p>
                  </div>
                  <span>{question.upvotes} vote{question.upvotes > 1 ? "s" : ""}</span>
                </article>
              ))}
            </div>
          ) : (
            <p className={styles.empty}>Aucune question pour le moment.</p>
          )}
        </section>
      </div>
    </main>
  );
}
