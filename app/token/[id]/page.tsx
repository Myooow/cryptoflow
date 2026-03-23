import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getTokenDetail, getOhlc } from "@/lib/api/coingecko";
import { isSupportedOnBinance } from "@/lib/api/mapper";
import { PriceTicker } from "@/components/shared/PriceTicker/PriceTicker";
import { CandlestickChart } from "@/components/shared/CandlestickChart/CandlestickChart";
import { LiveTrades } from "@/components/shared/LiveTrades/LiveTrades";
import { TokenStats } from "@/components/shared/TokenStats/TokenStats";
import styles from "./page.module.scss";

interface TokenPageProps {
  params: Promise<{ id: string }>;
}

function sanitizeDescription(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "")
    .replace(/javascript:/gi, "");
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
  } catch (err) {
    const status = (err as Error & { status?: number }).status;
    if (status === 404) notFound();
    throw err;
  }

  const [candles] = await Promise.all([
    getOhlc(id, 1).catch(() => []),
  ]);

  const hasLiveData = isSupportedOnBinance(id);

  return (
    <div className={styles.page}>
      <div className={styles.primary}>
        <h3 className={styles.tokenName}>{token.name}</h3>

        <div className={styles.coinInfo}>
          <Image src={token.image} alt={token.name} width={75} height={75} className={styles.tokenImage} />
          <div className={styles.priceRow}>
            <Suspense fallback={<div className={styles.priceSkeleton} />}>
              <PriceTicker coingeckoId={id} fallbackPrice={token.currentPrice} />
            </Suspense>
          </div>
        </div>

        <CandlestickChart coingeckoId={id} initialCandles={candles} />

        {hasLiveData && <LiveTrades coingeckoId={id} />}

        <TokenStats token={token} />

        {token.description && (
          <div className={styles.description}>
            <h2 className={styles.descriptionTitle}>About {token.name}</h2>
            <p
              className={styles.descriptionText}
              dangerouslySetInnerHTML={{ __html: sanitizeDescription(token.description) }}
            />
          </div>
        )}
      </div>

      <div className={styles.secondary}>
        <div className={styles.detailsGrid}>
          <ul className={styles.detailsList}>
            {token.links.homepage[0] && (
              <li className={styles.detailItem}>
                <span className={styles.detailLabel}>Website</span>
                <a href={token.links.homepage[0]} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
                  {new URL(token.links.homepage[0]).hostname}
                </a>
              </li>
            )}
            {token.links.twitterScreenName && (
              <li className={styles.detailItem}>
                <span className={styles.detailLabel}>Twitter</span>
                <a href={`https://twitter.com/${token.links.twitterScreenName}`} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
                  @{token.links.twitterScreenName}
                </a>
              </li>
            )}
            {token.links.subredditUrl && (
              <li className={styles.detailItem}>
                <span className={styles.detailLabel}>Reddit</span>
                <a href={token.links.subredditUrl} target="_blank" rel="noopener noreferrer" className={styles.detailLink}>
                  {token.links.subredditUrl.split("/r/")[1]?.replace("/", "")}
                </a>
              </li>
            )}
            {token.genesisDate && (
              <li className={styles.detailItem}>
                <span className={styles.detailLabel}>Genesis Date</span>
                <span className={styles.detailValue}>{token.genesisDate}</span>
              </li>
            )}
            <li className={styles.detailItem}>
              <span className={styles.detailLabel}>Watchlist Users</span>
              <span className={styles.detailValue}>{token.watchlistPortfolioUsers.toLocaleString()}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
