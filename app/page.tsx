import { Suspense } from "react";
import { getTrending, getCategories } from "@/lib/api/coingecko";
import { TrendingCard } from "@/components/shared/TrendingCard";
import { CategoryCard } from "@/components/shared/CategoryCard";
import styles from "./page.module.scss";

export const metadata = {
  title: "Discovery",
};

export default function DiscoveryPage() {
  return (
    <div className={styles.page}>
      <Suspense fallback={<TrendingGridSkeleton />}>
        <TrendingSection />
      </Suspense>

      <Suspense fallback={<CategoryGridSkeleton />}>
        <CategoriesSection />
      </Suspense>
    </div>
  );
}

async function TrendingSection() {
  const tokens = await getTrending();

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Trending</h2>
      <div className={styles.trendingGrid}>
        {tokens.map((token, i) => (
          <TrendingCard key={token.id} token={token} rank={i + 1} />
        ))}
      </div>
    </section>
  );
}

async function CategoriesSection() {
  const categories = await getCategories();

  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Top Categories</h2>
      <div className={styles.categoryGrid}>
        {categories.slice(0, 10).map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </section>
  );
}

function TrendingGridSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.skeletonTitle} />
      <div className={styles.trendingGrid}>
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className={styles.skeletonCard} />
        ))}
      </div>
    </section>
  );
}

function CategoryGridSkeleton() {
  return (
    <section className={styles.section}>
      <div className={styles.skeletonTitle} />
      <div className={styles.categoryGrid}>
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={i} className={styles.skeletonCard} />
        ))}
      </div>
    </section>
  );
}
