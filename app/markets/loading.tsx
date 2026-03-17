import styles from "./loading.module.scss";

export default function MarketsLoading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.skeletonTitle} />
        <div className={styles.skeletonSubtitle} />
      </div>
      <div className={styles.table}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} className={styles.row} />
        ))}
      </div>
    </div>
  );
}
