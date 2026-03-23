import Image from "next/image";
import { formatLargeNumber, formatPercent } from "@/lib/utils";
import type { MarketCategory } from "@/types/market";
import styles from "./CategoryCard.module.scss";
import { TrendingUp, TrendingDown } from "lucide-react";

interface CategoryCardProps {
  category: MarketCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const change = category.marketCapChange24h;
  const isUp = change == null || change >= 0;

  return (
    <tr className={styles.row}>
      <td className={styles.nameCell}>{category.name}</td>
      <td className={styles.gainersCell}>
        <div className={styles.gainers}>
          {category.top3Coins.slice(0, 3).map((url, i) => (
            <Image key={i} src={url} alt="coin" width={28} height={28} className={styles.coinImage} />
          ))}
        </div>
      </td>
      <td className={styles.changeCell}>
        <span className={`${styles.change} ${isUp ? styles.up : styles.down}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {formatPercent(change)}
        </span>
      </td>
      <td className={styles.marketCapCell}>{formatLargeNumber(category.marketCap)}</td>
      <td className={styles.volumeCell}>{formatLargeNumber(category.volume24h)}</td>
    </tr>
  );
}
