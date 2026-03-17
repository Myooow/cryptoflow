import styles from "./loading.module.scss";

export default function TokenLoading() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.identity}>
          <div className={styles.image} />
          <div className={styles.names}>
            <div className={styles.skeletonName} />
            <div className={styles.skeletonSymbol} />
          </div>
        </div>
        <div className={styles.skeletonPrice} />
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={styles.skeletonChart} />
          <div className={styles.skeletonStats} />
        </div>
        <div className={styles.skeletonSidebar} />
      </div>
    </div>
  );
}
