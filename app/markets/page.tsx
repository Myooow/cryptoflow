import { getMarkets } from "@/lib/api/coingecko";
import { TokenTable } from "@/components/shared/TokenTable";
import { COINGECKO_MARKETS_PER_PAGE } from "@/lib/constants";
import styles from "./page.module.scss";

export const metadata = {
  title: "Markets",
};

interface MarketsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function MarketsPage({ searchParams }: MarketsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10));

  const tokens = await getMarkets({ page, perPage: COINGECKO_MARKETS_PER_PAGE });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Markets</h1>
        <span className={styles.subtitle}>Top cryptocurrencies by market cap</span>
      </div>

      <TokenTable tokens={tokens} />

      <div className={styles.pagination}>
        {page > 1 && (
          <a href={`/markets?page=${page - 1}`} className={styles.pageBtn}>
            ← Previous
          </a>
        )}
        <span className={styles.pageInfo}>Page {page}</span>
        <a href={`/markets?page=${page + 1}`} className={styles.pageBtn}>
          Next →
        </a>
      </div>
    </div>
  );
}
