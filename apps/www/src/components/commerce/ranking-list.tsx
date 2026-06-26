import type { ProductGroup } from "@/lib/api-types";

import { ProductCard } from "./product-card";

/**
 * Horizontal, rank-badged product rail used for 熱銷精選 / 品牌新品 sections.
 */
export function RankingList({ group }: { group: ProductGroup }) {
  if (group.items.length === 0) return null;
  return (
    <div className="flex snap-x [scrollbar-width:none] gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
      {group.items.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          rank={i + 1}
          className="w-[160px] shrink-0 snap-start md:w-[180px]"
        />
      ))}
    </div>
  );
}
