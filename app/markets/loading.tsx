import styles from "./loading.module.scss";

export default function MarketsLoading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.table}>
        <div className={styles.headerRow} />
        {Array.from({ length: 15 }, (_, i) => (
          <div key={i} className={styles.row} />
        ))}
      </div>
    </div>
  );
}
