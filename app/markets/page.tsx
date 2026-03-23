import { getMarkets } from "@/lib/api/coingecko";
import { TokenTable } from "@/components/shared/TokenTable/TokenTable";
import styles from "./page.module.scss";

interface MarketsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export const metadata = { title: "Markets" };

export default async function MarketsPage({ searchParams }: MarketsPageProps) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const tokens = await getMarkets({ page, perPage: 50 });

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>Cryptocurrency Markets</h1>
        <p className={styles.subtitle}>Page {page}</p>
      </div>
      <TokenTable tokens={tokens} />
      <div className={styles.pagination}>
        {page > 1 && (
          <a href={`/markets?page=${page - 1}`} className={styles.pageBtn}>← Prev</a>
        )}
        <span className={styles.pageInfo}>Page {page}</span>
        <a href={`/markets?page=${page + 1}`} className={styles.pageBtn}>Next →</a>
      </div>
    </div>
  );
}
