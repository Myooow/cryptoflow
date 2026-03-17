import { Suspense } from "react";
import { notFound } from "next/navigation";
import { getTokenDetail, getOhlc } from "@/lib/api/coingecko";
import { isSupportedOnBinance } from "@/lib/api/mapper";
import { PriceTicker } from "@/components/shared/PriceTicker";
import { CandlestickChart } from "@/components/shared/CandlestickChart";
import { LiveTrades } from "@/components/shared/LiveTrades";
import { TokenStats } from "@/components/shared/TokenStats";
import styles from "./page.module.scss";

interface TokenPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: TokenPageProps) {
  const { id } = await params;
  try {
    const token = await getTokenDetail(id);
    return { title: `${token.name} (${token.symbol.toUpperCase()})` };
  } catch {
    return { title: "Token" };
  }
}

export default async function TokenPage({ params }: TokenPageProps) {
  const { id } = await params;

  let token;
  try {
    token = await getTokenDetail(id);
  } catch {
    notFound();
  }

  const candles = await getOhlc(id, 7).catch(() => []);
  const hasLiveData = isSupportedOnBinance(id);

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.tokenIdentity}>
          {token.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={token.image} alt={token.name} className={styles.tokenImage} />
          )}
          <div className={styles.tokenNames}>
            <h1 className={styles.tokenName}>{token.name}</h1>
            <span className={styles.tokenSymbol}>{token.symbol.toUpperCase()}</span>
          </div>
        </div>

        <Suspense fallback={<div className={styles.priceSkeleton} />}>
          <PriceTicker coingeckoId={id} fallbackPrice={token.currentPrice} />
        </Suspense>
      </div>

      <div className={styles.layout}>
        <div className={styles.main}>
          <CandlestickChart coingeckoId={id} initialCandles={candles} />
          <TokenStats token={token} />

          {token.description && (
            <div className={styles.description}>
              <h2 className={styles.descriptionTitle}>About {token.name}</h2>
              <p
                className={styles.descriptionText}
                dangerouslySetInnerHTML={{ __html: token.description }}
              />
            </div>
          )}
        </div>

        {hasLiveData && (
          <div className={styles.sidebar}>
            <LiveTrades coingeckoId={id} />
          </div>
        )}
      </div>
    </div>
  );
}
