import styles from "./SpeakerCard.module.css";

export default function SpeakerCard({ speaker, sessionsCount, onClick }) {
  return (
    <div className={styles.card} onClick={onClick}>

      {/* LEFT */}
      <div className={styles.left}>
        <div className={styles.avatarWrapper}>
          <img src={speaker.avatar} className={styles.avatar} />
          <span className={styles.badge}>{sessionsCount}</span>
        </div>

        <div className={styles.info}>
          <h3 className={styles.name}>{speaker.name}</h3>
          <p className={styles.role}>{speaker.role}</p>
        </div>
      </div>

      {/* RIGHT */}
      <div className={styles.right}>
        <span className={styles.arrow}>›</span>
      </div>

    </div>
  );
}