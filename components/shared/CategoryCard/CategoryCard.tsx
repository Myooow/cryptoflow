import Link from "next/link";
import Image from "next/image";
import { formatLargeNumber, formatPercent } from "@/lib/utils";
import type { MarketCategory } from "@/types/market";
import styles from "./CategoryCard.module.scss";

interface CategoryCardProps {
  category: MarketCategory;
}

export function CategoryCard({ category }: CategoryCardProps) {
  const isUp = (category.marketCapChange24h ?? 0) >= 0;

  return (
    <Link href={`/markets?category=${category.id}`} className={styles.card}>
      <div className={styles.top}>
        <div className={styles.coins}>
          {category.top3Coins.slice(0, 3).map((src, i) => (
            <Image
              key={i}
              src={src}
              alt=""
              width={24}
              height={24}
              className={styles.coin}
              style={{ zIndex: 3 - i }}
              unoptimized
            />
          ))}
        </div>
        {category.marketCapChange24h !== null && (
          <span className={`${styles.change} ${isUp ? styles.up : styles.down}`}>
            {formatPercent(category.marketCapChange24h)}
          </span>
        )}
      </div>

      <div className={styles.bottom}>
        <span className={styles.name}>{category.name}</span>
        <span className={styles.marketCap}>{formatLargeNumber(category.marketCap)}</span>
      </div>
    </Link>
  );
}
