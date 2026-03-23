import Image from "next/image";
import Link from "next/link";
import { formatPercent, formatPrice } from "@/lib/utils";
import type { TrendingToken } from "@/types/token";
import styles from "./TrendingCard.module.scss";
import { TrendingUp, TrendingDown } from "lucide-react";

interface TrendingCardProps {
  token: TrendingToken;
}

export function TrendingCard({ token }: TrendingCardProps) {
  const change = token.data.priceChangePercentage24h;
  const isUp = change >= 0;

  return (
    <tr className={styles.row}>
      <td className={styles.nameCell}>
        <Link href={`/token/${token.id}`} className={styles.nameLink}>
          <Image src={token.small} alt={token.name} width={36} height={36} className={styles.image} />
          <span className={styles.name}>{token.name}</span>
        </Link>
      </td>
      <td className={styles.changeCell}>
        <span className={`${styles.change} ${isUp ? styles.up : styles.down}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {formatPercent(change)}
        </span>
      </td>
      <td className={styles.priceCell}>
        ${formatPrice(token.data.price)}
      </td>
    </tr>
  );
}
