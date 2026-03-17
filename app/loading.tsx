import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.grid}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    </div>
  );
}
