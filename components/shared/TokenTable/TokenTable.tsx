import Image from "next/image";
import Link from "next/link";
import { formatLargeNumber, formatPercent, formatPrice } from "@/lib/utils";
import type { Token } from "@/types/token";
import styles from "./TokenTable.module.scss";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TokenTableProps {
  tokens: Token[];
}

export function TokenTable({ tokens }: TokenTableProps) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr className={styles.headerRow}>
            <th className={`${styles.th} ${styles.rankTh}`}>#</th>
            <th className={styles.th}>Name</th>
            <th className={styles.th}>Price</th>
            <th className={styles.th}>24h %</th>
            <th className={`${styles.th} ${styles.hiddenSm}`}>7d %</th>
            <th className={`${styles.th} ${styles.hiddenMd}`}>Market Cap</th>
            <th className={`${styles.th} ${styles.volumeTh}`}>Volume 24h</th>
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
  const change24h = token.priceChangePercentage24h;
  const change7d = token.priceChangePercentage7d;
  const isUp24h = change24h >= 0;
  const isUp7d = change7d == null || change7d >= 0;

  return (
    <tr className={styles.row}>
      <td className={`${styles.td} ${styles.rankTd}`}>
        <Link href={`/token/${token.id}`} className={styles.rowLink} />
        <span className={styles.rank}>{token.marketCapRank}</span>
      </td>
      <td className={styles.td}>
        <div className={styles.tokenInfo}>
          <Image src={token.image} alt={token.name} width={32} height={32} className={styles.tokenImage} />
          <div>
            <p className={styles.tokenName}>{token.name}</p>
            <p className={styles.tokenSymbol}>{token.symbol.toUpperCase()}</p>
          </div>
        </div>
      </td>
      <td className={`${styles.td} ${styles.priceCell}`}>${formatPrice(token.currentPrice)}</td>
      <td className={styles.td}>
        <span className={`${styles.change} ${isUp24h ? styles.up : styles.down}`}>
          {isUp24h ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {formatPercent(change24h)}
        </span>
      </td>
      <td className={`${styles.td} ${styles.hiddenSm}`}>
        <span className={`${styles.change} ${isUp7d ? styles.up : styles.down}`}>
          {formatPercent(change7d)}
        </span>
      </td>
      <td className={`${styles.td} ${styles.hiddenMd}`}>{formatLargeNumber(token.marketCap)}</td>
      <td className={`${styles.td} ${styles.volumeTd}`}>{formatLargeNumber(token.totalVolume)}</td>
    </tr>
  );
}
