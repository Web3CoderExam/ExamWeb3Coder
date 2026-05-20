import Link from "next/link";
import Image from "next/image";
import styles from "./SpeakerCard.module.css";

export default function SpeakerCard({ speaker, sessionsCount, href }) {
  return (
    <Link href={href} className={styles.card}>
      <div className={styles.left}>
        <div className={styles.avatarWrapper}>
          <Image
            src={speaker.avatar}
            className={styles.avatar}
            alt={speaker.name}
            width={64}
            height={64}
          />
          <span className={styles.badge}>{sessionsCount}</span>
        </div>

        <div className={styles.info}>
          <h3 className={styles.name}>{speaker.name}</h3>
          <p className={styles.role}>{speaker.role}</p>
          <span className={styles.meta}>
            {sessionsCount} session{sessionsCount > 1 ? "s" : ""} pr&eacute;vue{sessionsCount > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.arrow}>&rsaquo;</span>
      </div>
    </Link>
  );
}
