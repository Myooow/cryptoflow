"use client";

import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatLargeNumber, formatPercent } from "@/lib/utils";
import type { Token } from "@/types/token";
import styles from "./TokenTable.module.scss";

interface TokenTableProps {
  tokens: Token[];
}

export function TokenTable({ tokens }: TokenTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            <th className={styles.th}>#</th>
            <th className={styles.th}>Name</th>
            <th className={`${styles.th} ${styles.right}`}>Price</th>
            <th className={`${styles.th} ${styles.right}`}>24h %</th>
            <th className={`${styles.th} ${styles.right}`}>7d %</th>
            <th className={`${styles.th} ${styles.right}`}>Market Cap</th>
            <th className={`${styles.th} ${styles.right}`}>Volume 24h</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <TokenRow key={token.id} token={token} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TokenRow({ token }: { token: Token }) {
  const is24hUp = token.priceChangePercentage24h >= 0;
  const is7dUp = (token.priceChangePercentage7d ?? 0) >= 0;

  return (
    <tr className={styles.row}>
      <td className={`${styles.td} ${styles.rank}`}>{token.marketCapRank}</td>
      <td className={styles.td}>
        <Link href={`/token/${token.id}`} className={styles.nameCell}>
          <Image src={token.image} alt={token.name} width={28} height={28} className={styles.logo} />
          <span className={styles.tokenName}>{token.name}</span>
          <span className={styles.tokenSymbol}>{token.symbol.toUpperCase()}</span>
        </Link>
      </td>
      <td className={`${styles.td} ${styles.right} ${styles.price}`}>
        ${formatPrice(token.currentPrice)}
      </td>
      <td className={`${styles.td} ${styles.right}`}>
        <span className={`${styles.change} ${is24hUp ? styles.up : styles.down}`}>
          {formatPercent(token.priceChangePercentage24h)}
        </span>
      </td>
      <td className={`${styles.td} ${styles.right}`}>
        {token.priceChangePercentage7d !== null ? (
          <span className={`${styles.change} ${is7dUp ? styles.up : styles.down}`}>
            {formatPercent(token.priceChangePercentage7d)}
          </span>
        ) : (
          <span className={styles.na}>—</span>
        )}
      </td>
      <td className={`${styles.td} ${styles.right} ${styles.mono}`}>
        {formatLargeNumber(token.marketCap)}
      </td>
      <td className={`${styles.td} ${styles.right} ${styles.mono}`}>
        {formatLargeNumber(token.totalVolume)}
      </td>
    </tr>
  );
}
