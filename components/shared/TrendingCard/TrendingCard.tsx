import Link from "next/link";
import Image from "next/image";
import { formatPrice, formatPercent } from "@/lib/utils";
import type { TrendingToken } from "@/types/token";
import styles from "./TrendingCard.module.scss";

interface TrendingCardProps {
  token: TrendingToken;
  rank: number;
}

export function TrendingCard({ token, rank }: TrendingCardProps) {
  const isUp = token.data.priceChangePercentage24h >= 0;

  return (
    <Link href={`/token/${token.id}`} className={styles.card}>
      <div className={styles.header}>
        <span className={styles.rank}>#{rank}</span>
        <div className={styles.meta}>
          <Image src={token.thumb} alt={token.name} width={32} height={32} className={styles.image} />
          <div className={styles.names}>
            <span className={styles.name}>{token.name}</span>
            <span className={styles.symbol}>{token.symbol.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <div className={styles.footer}>
        <span className={styles.price}>${formatPrice(token.data.price)}</span>
        <span className={`${styles.change} ${isUp ? styles.up : styles.down}`}>
          {isUp ? "▲" : "▼"} {Math.abs(token.data.priceChangePercentage24h).toFixed(2)}%
        </span>
      </div>

      {token.data.sparkline && (
        <Image
          src={token.data.sparkline}
          alt="sparkline"
          width={200}
          height={50}
          className={styles.sparkline}
          unoptimized
        />
      )}
    </Link>
  );
}
