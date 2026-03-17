"use client";

import { useBinanceTicker } from "@/hooks/useBinanceStream";
import { isSupportedOnBinance } from "@/lib/api/mapper";
import styles from "./PriceTicker.module.scss";

interface PriceTickerProps {
  coingeckoId: string;
  fallbackPrice: number;
}

export function PriceTicker({ coingeckoId, fallbackPrice }: PriceTickerProps) {
  const supported = isSupportedOnBinance(coingeckoId);
  const { ticker, status } = useBinanceTicker({ coingeckoId, enabled: supported });

  const price = ticker?.price ?? fallbackPrice;
  const change = ticker?.priceChangePercent ?? null;
  const isUp = change !== null && change >= 0;

  return (
    <div className={styles.wrapper}>
      <span className={styles.price}>
        ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
      </span>

      {change !== null && (
        <span className={`${styles.change} ${isUp ? styles.up : styles.down}`}>
          {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
        </span>
      )}

      {supported && (
        <span className={`${styles.dot} ${styles[status]}`} title={status} />
      )}
    </div>
  );
}
