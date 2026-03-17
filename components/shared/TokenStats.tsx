import { formatPrice, formatLargeNumber, formatPercent, formatSupply } from "@/lib/utils";
import type { TokenDetail } from "@/types/token";
import styles from "./TokenStats.module.scss";

interface TokenStatsProps {
  token: TokenDetail;
}

export function TokenStats({ token }: TokenStatsProps) {
  return (
    <div className={styles.grid}>
      <StatItem label="Market Cap" value={formatLargeNumber(token.marketCap)} />
      <StatItem label="24h Volume" value={formatLargeNumber(token.totalVolume)} />
      <StatItem label="24h High" value={`$${formatPrice(token.high24h)}`} />
      <StatItem label="24h Low" value={`$${formatPrice(token.low24h)}`} />
      <StatItem label="ATH" value={`$${formatPrice(token.ath)}`} sub={formatPercent(token.athChangePercentage)} subDown={token.athChangePercentage < 0} />
      <StatItem label="ATL" value={`$${formatPrice(token.atl)}`} sub={formatPercent(token.atlChangePercentage)} subDown={token.atlChangePercentage < 0} />
      <StatItem label="Circulating Supply" value={formatSupply(token.circulatingSupply)} />
      {token.maxSupply && <StatItem label="Max Supply" value={formatSupply(token.maxSupply)} />}
      {token.totalSupply && <StatItem label="Total Supply" value={formatSupply(token.totalSupply)} />}
      {token.marketCapRank && <StatItem label="CMC Rank" value={`#${token.marketCapRank}`} />}
    </div>
  );
}

interface StatItemProps {
  label: string;
  value: string;
  sub?: string;
  subDown?: boolean;
}

function StatItem({ label, value, sub, subDown }: StatItemProps) {
  return (
    <div className={styles.item}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
      {sub && (
        <span className={`${styles.sub} ${subDown ? styles.down : styles.up}`}>{sub}</span>
      )}
    </div>
  );
}
