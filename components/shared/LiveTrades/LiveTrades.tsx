"use client";

import { useBinanceTrades } from "@/hooks/useBinanceStream";
import { formatPrice } from "@/lib/utils";
import { LIVE_TRADES_MAX_ITEMS } from "@/lib/constants";
import styles from "./LiveTrades.module.scss";

interface LiveTradesProps {
  coingeckoId: string;
}

export function LiveTrades({ coingeckoId }: LiveTradesProps) {
  const { trades, status } = useBinanceTrades({ coingeckoId, maxItems: LIVE_TRADES_MAX_ITEMS });

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.title}>Live Trades</span>
        <span className={`${styles.dot} ${styles[status]}`} />
      </div>

      <div className={styles.labels}>
        <span>Price (USD)</span>
        <span>Amount</span>
        <span>Time</span>
      </div>

      <div className={styles.list}>
        {trades.length === 0 && (
          <div className={styles.empty}>Connecting...</div>
        )}
        {trades.map((trade) => (
          <div key={trade.id} className={`${styles.trade} ${trade.isBuyerMaker ? styles.sell : styles.buy}`}>
            <span className={styles.tradePrice}>${formatPrice(trade.price)}</span>
            <span className={styles.tradeQty}>{trade.quantity.toFixed(4)}</span>
            <span className={styles.tradeTime}>
              {new Date(trade.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
