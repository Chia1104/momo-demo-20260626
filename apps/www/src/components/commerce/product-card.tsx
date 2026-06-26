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

export function ProductCard({ product, rank, className }: ProductCardProps) {
  const add = useCartStore((s) => s.add);

  return (
    <Link
      to="/goods/$productId"
      params={{ productId: product.id }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-md border border-[var(--border)] bg-[var(--surface)] transition-shadow hover:shadow-md",
        className
      )}>
      <div className="relative aspect-square overflow-hidden bg-[var(--surface-secondary)]">
        {rank != null && (
          <span className="absolute top-0 left-0 z-10 flex h-7 w-7 items-center justify-center bg-[#e3197b] text-sm font-bold text-white">
            {rank}
          </span>
        )}
        {product.discountRate != null && (
          <span className="absolute top-0 right-0 z-10 bg-[#ff5500] px-1.5 py-0.5 text-xs font-bold text-white">
            {product.discountRate}% OFF
          </span>
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
          <span className="text-xs text-[var(--muted)]">{product.brand}</span>
        )}
        <h3 className="line-clamp-2 min-h-[2.5rem] text-sm leading-tight text-[var(--foreground)]">
          {product.name}
        </h3>

        {product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
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
          <button
            type="button"
            aria-label="加入購物車"
            disabled={product.soldOut}
            onClick={(e) => {
              e.preventDefault();
              add(product);
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e3197b] text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
            <ShoppingCart className="h-4 w-4" />
          </button>
        </div>

        {(product.rating != null || product.sales > 0) && (
          <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
            {product.rating != null && (
              <span className="flex items-center gap-0.5">
                <Star className="h-3 w-3 fill-[#faad14] text-[#faad14]" />
                {product.rating.toFixed(1)}
              </span>
            )}
            {product.sales > 0 && (
              <span>已售 {product.sales.toLocaleString()}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
