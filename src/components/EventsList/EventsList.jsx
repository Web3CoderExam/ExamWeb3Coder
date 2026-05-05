import Link from "next/link";
import styles from "./EventsList.module.css";

export default function EventsList({ events }) {
  return (
    <div className={styles.container}>
      <section className={styles.header}>
        <span className={styles.eyebrow}>Evénements</span>
        <h1>Explorer les événements</h1>
        <p>Consultez les conférences, ateliers et forums disponibles sur EventSync.</p>
      </section>

      <section className={styles.grid}>
        {events.map((event) => {
          const startDate = event.startDate || event.date;
          const endDate = event.endDate || event.date;
          const dateText = startDate === endDate ? startDate : `${startDate} - ${endDate}`;

          return (
            <article key={event.id} className={styles.card}>
              <img src={event.image} alt={event.title} className={styles.image} />

              <div className={styles.content}>
                <div className={styles.topline}>
                  <span className={styles.category}>{event.category}</span>
                  <span className={styles.count}>
                    {event.sessions.length} session{event.sessions.length > 1 ? "s" : ""}
                  </span>
                </div>

                <h2>{event.title}</h2>
                <p>{event.description}</p>

                <div className={styles.meta}>
                  <span>{dateText}</span>
                  <span>{event.location}</span>
                </div>

                <div className={styles.actions}>
                  <Link href={`/events/${event.id}`} className={styles.primary}>
                    Voir l&apos;événement
                  </Link>
                  <Link href={`/planning?event=${event.id}`} className={styles.secondary}>
                    Planning
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}
