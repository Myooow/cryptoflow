import styles from "./loading.module.scss";

export default function TokenLoading() {
  return (
    <div className={styles.page}>
      <div className={styles.primary}>
        <div className={styles.tokenName} />
        <div className={styles.coinInfo}>
          <div className={styles.image} />
          <div className={styles.price} />
        </div>
        <div className={styles.chart} />
      </div>
      <div className={styles.secondary}>
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className={styles.detailItem} />
        ))}
      </div>
    </div>
  );
}
