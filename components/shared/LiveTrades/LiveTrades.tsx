"use client";

import { useBinanceTrades } from "@/hooks/useBinanceStream";
import { formatPrice } from "@/lib/utils";
import styles from "./LiveTrades.module.scss";

interface LiveTradesProps {
  coingeckoId: string;
}

function timeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  return `${Math.floor(seconds / 60)}m ago`;
}

export function LiveTrades({ coingeckoId }: LiveTradesProps) {
  const { trades, status } = useBinanceTrades({ coingeckoId });

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <h4 className={styles.title}>Recent Trades</h4>
        <span className={`${styles.dot} ${styles[status]}`} />
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr className={styles.headerRow}>
              <th className={styles.th}>Price</th>
              <th className={styles.th}>Amount</th>
              <th className={styles.th}>Type</th>
              <th className={`${styles.th} ${styles.timeHeader}`}>Time</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade) => (
              <tr key={trade.id} className={styles.row}>
                <td className={styles.priceCell}>${formatPrice(trade.price)}</td>
                <td className={styles.td}>{trade.quantity.toFixed(4)}</td>
                <td className={styles.td}>
                  <span className={trade.isBuyerMaker ? styles.sell : styles.buy}>
                    {trade.isBuyerMaker ? "Sell" : "Buy"}
                  </span>
                </td>
                <td className={`${styles.td} ${styles.timeCell}`}>{timeAgo(trade.timestamp)}</td>
              </tr>
            ))}
            {trades.length === 0 && (
              <tr>
                <td colSpan={4} className={styles.empty}>
                  {status === "connecting" ? "Connecting..." : "No trades yet"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
