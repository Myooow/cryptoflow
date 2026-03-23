import { Suspense } from "react";
import { getTrending, getCategories } from "@/lib/api/coingecko";
import { CoinOverview } from "@/components/shared/CoinOverview/CoinOverview";
import { TrendingCard } from "@/components/shared/TrendingCard/TrendingCard";
import { CategoryCard } from "@/components/shared/CategoryCard/CategoryCard";
import styles from "./page.module.scss";

async function CoinOverviewSection() {
  return <CoinOverview coinId="bitcoin" />;
}

async function TrendingSection() {
  let tokens;
  try {
    tokens = await getTrending();
  } catch {
    return (
      <div className={styles.trendingCard}>
        <h4 className={styles.sectionTitle}>Trending Coins</h4>
        <p className={styles.errorMsg}>Unable to load data. Check your API key.</p>
      </div>
    );
  }

  return (
    <div className={styles.trendingCard}>
      <h4 className={styles.sectionTitle}>Trending Coins</h4>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeaderRow}>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>24h %</th>
            <th className={styles.tableHeader}>Price</th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <TrendingCard key={token.id} token={token} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

async function CategoriesSection() {
  let categories;
  try {
    categories = await getCategories();
  } catch {
    return (
      <div className={styles.categoriesCard}>
        <h4 className={styles.sectionTitle}>Top Categories</h4>
        <p className={styles.errorMsg}>Unable to load data. Check your API key.</p>
      </div>
    );
  }

  return (
    <div className={styles.categoriesCard}>
      <h4 className={styles.sectionTitle}>Top Categories</h4>
      <table className={styles.table}>
        <thead>
          <tr className={styles.tableHeaderRow}>
            <th className={styles.tableHeader}>Category</th>
            <th className={styles.tableHeader}>Top Gainers</th>
            <th className={styles.tableHeader}>24h %</th>
            <th className={styles.tableHeader}>Market Cap</th>
            <th className={styles.tableHeader}>Volume 24h</th>
          </tr>
        </thead>
        <tbody>
          {categories.slice(0, 10).map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function OverviewSkeleton() {
  return <div className={styles.overviewSkeleton} />;
}

function TrendingSkeleton() {
  return (
    <div className={styles.trendingCard}>
      <div className={styles.skeletonTitle} />
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className={styles.skeletonRow} />
      ))}
    </div>
  );
}

function CategoriesSkeleton() {
  return (
    <div className={styles.categoriesCard}>
      <div className={styles.skeletonTitle} />
      {Array.from({ length: 10 }, (_, i) => (
        <div key={i} className={styles.skeletonRow} />
      ))}
    </div>
  );
}

export default function DiscoveryPage() {
  return (
    <div className={styles.page}>
      <div className={styles.topGrid}>
        <div className={styles.overviewCol}>
          <Suspense fallback={<OverviewSkeleton />}>
            <CoinOverviewSection />
          </Suspense>
        </div>
        <div className={styles.trendingCol}>
          <Suspense fallback={<TrendingSkeleton />}>
            <TrendingSection />
          </Suspense>
        </div>
      </div>

      <div className={styles.bottomRow}>
        <Suspense fallback={<CategoriesSkeleton />}>
          <CategoriesSection />
        </Suspense>
      </div>
    </div>
  );
}
