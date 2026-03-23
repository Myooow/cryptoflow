import Image from "next/image";
import { getTokenDetail, getOhlc } from "@/lib/api/coingecko";
import { CandlestickChart } from "@/components/shared/CandlestickChart/CandlestickChart";
import { formatPrice } from "@/lib/utils";
import styles from "./CoinOverview.module.scss";

interface CoinOverviewProps {
  coinId?: string;
}

export async function CoinOverview({ coinId = "bitcoin" }: CoinOverviewProps) {
  const [token, candles] = await Promise.all([
    getTokenDetail(coinId),
    getOhlc(coinId, 1).catch(() => []),
  ]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Image
          src={token.image}
          alt={token.name}
          width={56}
          height={56}
          className={styles.image}
        />
        <div className={styles.info}>
          <p className={styles.symbol}>{token.symbol.toUpperCase()}</p>
          <h1 className={styles.price}>${formatPrice(token.currentPrice)}</h1>
        </div>
      </div>
      <CandlestickChart coingeckoId={coinId} initialCandles={candles} />
    </div>
  );
}
