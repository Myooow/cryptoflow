"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./Header.module.scss";

const NAV_ITEMS = [
  { label: "Discovery", href: "/" },
  { label: "Markets", href: "/markets" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoIcon}>◈</span>
          <span className={styles.logoText}>CryptoFlow</span>
        </Link>

        <nav className={styles.nav}>
          {NAV_ITEMS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`${styles.navLink} ${pathname === href ? styles.active : ""}`}
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <kbd className={styles.shortcut}>⌘K</kbd>
        </div>
      </div>
    </header>
  );
}
