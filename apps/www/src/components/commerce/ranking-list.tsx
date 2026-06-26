import { ScrollShadow } from "@heroui/react";

import type { ProductGroup } from "@/lib/api-types";

import { ProductCard } from "./product-card";

/**
 * Horizontal, rank-badged product rail used for 熱銷精選 / 品牌新品 sections.
 */
export function RankingList({ group }: { group: ProductGroup }) {
  if (group.items.length === 0) return null;
  return (
    <ScrollShadow
      orientation="horizontal"
      className="flex max-w-full gap-3 pb-2">
      {group.items.map((product, i) => (
        <ProductCard
          key={product.id}
          product={product}
          rank={i + 1}
          className="w-[160px] shrink-0 snap-start md:w-[180px]"
        />
      ))}
    </ScrollShadow>
  );
}
