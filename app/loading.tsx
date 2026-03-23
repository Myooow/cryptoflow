import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.page}>
      <div className={styles.grid}>
        {Array.from({ length: 2 }, (_, i) => (
          <div key={i} className={styles.card}>
            <div className={styles.title} />
            {Array.from({ length: 8 }, (_, j) => (
              <div key={j} className={styles.row} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
