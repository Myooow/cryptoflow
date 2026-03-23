"use client";

import { useBinanceTicker } from "@/hooks/useBinanceStream";
import { isSupportedOnBinance } from "@/lib/api/mapper";
import { TrendingUp, TrendingDown } from "lucide-react";
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
  const isUp = change === null || change >= 0;

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.price}>
        ${price.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 8 })}
      </h1>
      {change !== null && (
        <span className={`${styles.badge} ${isUp ? styles.up : styles.down}`}>
          {isUp ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {Math.abs(change).toFixed(2)}%
        </span>
      )}
      {supported && (
        <span className={`${styles.dot} ${styles[status]}`} title={status} />
      )}
    </div>
  );
}
