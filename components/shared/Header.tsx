import Link from "next/link";
import styles from "./Header.module.scss";

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span className={styles.logoText}>CryptoFlow</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Discovery
          </Link>
          <Link href="/markets" className={styles.navLink}>
            Markets
          </Link>
        </nav>

        <div className={styles.actions}>
          <kbd className={styles.shortcut}>⌘K</kbd>
        </div>
      </div>
    </header>
  );
}
