import { Button, Card, Chip } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { ShoppingCart, Star } from "lucide-react";

import type { Product } from "@/lib/api-types";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart";

import { Price } from "./price";
import { PromoTagBadge } from "./promo-tag";

interface ProductCardProps {
  product: Product;
  /** Optional 1-based rank badge for ranking lists (熱銷精選). */
  rank?: number;
  className?: string;
}

/**
 * Uses an "overlay link" pattern: the whole card is navigable via an absolutely
 * positioned Link, while the add-to-cart Button sits above it (z-10) as a
 * sibling — avoiding an invalid <button> nested inside an <a>.
 */
export function ProductCard({ product, rank, className }: ProductCardProps) {
  const add = useCartStore((s) => s.add);

  return (
    <Card
      className={cn(
        "group relative flex flex-col overflow-hidden p-0 transition-shadow hover:shadow-md",
        className
      )}>
      <Link
        to="/goods/$productId"
        params={{ productId: product.id }}
        aria-label={product.name}
        className="absolute inset-0 z-0"
      />

      <div className="bg-surface-secondary pointer-events-none relative aspect-square overflow-hidden">
        {rank != null && (
          <span className="bg-accent text-accent-foreground absolute top-0 left-0 z-10 flex h-7 w-7 items-center justify-center text-sm font-bold">
            {rank}
          </span>
        )}
        {product.discountRate != null && (
          <Chip
            color="warning"
            variant="primary"
            size="sm"
            className="absolute top-1 right-1 z-10">
            {product.discountRate}% OFF
          </Chip>
        )}
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className={cn(
            "h-full w-full object-cover transition-transform duration-300 group-hover:scale-105",
            product.soldOut && "opacity-60 grayscale"
          )}
        />
        {product.soldOut && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="rounded-full bg-black/65 px-4 py-1.5 text-sm font-semibold text-white">
              熱銷一空
            </span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        {product.brand && (
          <span className="text-muted text-xs">{product.brand}</span>
        )}
        <h3 className="text-foreground line-clamp-2 min-h-[2.5rem] text-sm leading-tight">
          {product.name}
        </h3>

        {product.tags.length > 0 && (
          <div className="pointer-events-none flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <PromoTagBadge key={tag.type} tag={tag} />
            ))}
          </div>
        )}

        <div className="mt-auto flex items-end justify-between pt-1">
          <Price
            value={product.price}
            original={product.originalPrice}
            size="md"
          />
          <Button
            isIconOnly
            size="sm"
            variant="primary"
            aria-label="加入購物車"
            isDisabled={product.soldOut}
            onPress={() => add(product)}
            className="relative z-10 rounded-full">
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>

        {(product.rating != null || product.sales > 0) && (
          <div className="text-muted flex items-center gap-2 text-xs">
            {product.rating != null && (
              <span className="flex items-center gap-0.5">
                <Star className="fill-warning text-warning h-3 w-3" />
                {product.rating.toFixed(1)}
              </span>
            )}
            {product.sales > 0 && (
              <span>已售 {product.sales.toLocaleString()}</span>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
