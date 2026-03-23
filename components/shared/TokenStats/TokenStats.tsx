import { formatLargeNumber, formatPercent, formatPrice } from "@/lib/utils";
import type { TokenDetail } from "@/types/token";
import styles from "./TokenStats.module.scss";

interface TokenStatsProps {
  token: TokenDetail;
}

export function TokenStats({ token }: TokenStatsProps) {
  const stats = [
    { label: "Market Cap", value: formatLargeNumber(token.marketCap) },
    { label: "Rank", value: `#${token.marketCapRank}` },
    { label: "24h Volume", value: formatLargeNumber(token.totalVolume) },
    { label: "24h High", value: `$${formatPrice(token.high24h)}` },
    { label: "24h Low", value: `$${formatPrice(token.low24h)}` },
    { label: "All-Time High", value: `$${formatPrice(token.ath)}` },
    { label: "ATH Change", value: formatPercent(token.athChangePercentage) },
    {
      label: "Circulating Supply",
      value: `${formatLargeNumber(token.circulatingSupply).replace("$", "")} ${token.symbol.toUpperCase()}`,
    },
    ...(token.maxSupply
      ? [{ label: "Max Supply", value: `${formatLargeNumber(token.maxSupply).replace("$", "")} ${token.symbol.toUpperCase()}` }]
      : []),
  ];

  return (
    <div className={styles.wrapper}>
      <h3 className={styles.title}>Statistics</h3>
      <ul className={styles.grid}>
        {stats.map(({ label, value }) => (
          <li key={label} className={styles.item}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
