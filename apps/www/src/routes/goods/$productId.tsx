import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Minus, Plus, ShoppingCart, Star } from "lucide-react";

import { Price } from "@/components/commerce/price";
import { ProductCard } from "@/components/commerce/product-card";
import { PromoTagBadge } from "@/components/commerce/promo-tag";
import { SectionHeader } from "@/components/commerce/section-header";
import { Shimmer } from "@/components/commerce/skeletons";
import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart";

export const Route = createFileRoute("/goods/$productId")({
  loader: ({ params }) =>
    getQueryClient().ensureQueryData(
      orpc.catalog.getProduct.queryOptions({ input: { id: params.productId } })
    ),
  component: ProductDetailPage,
  pendingComponent: DetailSkeleton,
});

function ProductDetailPage() {
  const { productId } = Route.useParams();
  const { data: product } = useQuery(
    orpc.catalog.getProduct.queryOptions({ input: { id: productId } })
  );
  const { data: related } = useQuery(
    orpc.catalog.search.queryOptions({
      input: { categoryId: product?.categoryId, sort: "sales", pageSize: 10 },
    })
  );

  const add = useCartStore((s) => s.add);
  const [qty, setQty] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [added, setAdded] = useState(false);

  if (!product) return <DetailSkeleton />;

  const onAdd = () => {
    add(product, qty);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const relatedItems = related?.items.filter((p) => p.id !== product.id) ?? [];

  return (
    <div className="space-y-8">
      <nav className="text-xs text-[var(--muted)]">
        <Link to="/" className="hover:text-[#e3197b]">
          首頁
        </Link>
        <span className="mx-1">/</span>
        <Link
          to="/search"
          search={{ categoryId: product.categoryId, page: 1 }}
          className="hover:text-[#e3197b]">
          {product.categoryId}
        </Link>
      </nav>

      <div className="grid gap-6 md:grid-cols-[minmax(0,440px)_1fr]">
        <div className="space-y-3">
          <div className="aspect-square overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface-secondary)]">
            <img
              src={product.images[activeImage] ?? product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            {product.images.map((img, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setActiveImage(i)}
                className={cn(
                  "h-16 w-16 overflow-hidden rounded border-2",
                  i === activeImage
                    ? "border-[#e3197b]"
                    : "border-[var(--border)]"
                )}>
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {product.brand && (
            <span className="text-sm text-[var(--muted)]">{product.brand}</span>
          )}
          <h1 className="text-xl leading-snug font-bold md:text-2xl">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 text-sm text-[var(--muted)]">
            {product.rating != null && (
              <span className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-[#faad14] text-[#faad14]" />
                {product.rating.toFixed(1)}
              </span>
            )}
            <span>已售 {product.sales.toLocaleString()}</span>
          </div>

          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <PromoTagBadge key={tag.type} tag={tag} />
              ))}
            </div>
          )}

          <div className="rounded-lg bg-[var(--surface-secondary)] p-4">
            <Price
              value={product.price}
              original={product.originalPrice}
              size="lg"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--muted)]">數量</span>
            <div className="flex items-center rounded-md border border-[var(--border)]">
              <button
                type="button"
                aria-label="減少"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="flex h-9 w-9 items-center justify-center">
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <button
                type="button"
                aria-label="增加"
                onClick={() => setQty((q) => q + 1)}
                className="flex h-9 w-9 items-center justify-center">
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          <button
            type="button"
            disabled={product.soldOut}
            onClick={onAdd}
            className={cn(
              "flex w-full items-center justify-center gap-2 rounded-md py-3 font-semibold text-white transition-colors",
              product.soldOut
                ? "cursor-not-allowed bg-[var(--surface-tertiary)] text-[var(--muted)]"
                : added
                  ? "bg-[#389e0d]"
                  : "bg-[#e3197b] hover:opacity-90"
            )}>
            {product.soldOut ? (
              "熱銷一空"
            ) : added ? (
              <>
                <Check className="h-5 w-5" /> 已加入購物車
              </>
            ) : (
              <>
                <ShoppingCart className="h-5 w-5" /> 加入購物車
              </>
            )}
          </button>

          <div className="rounded-lg border border-[var(--border)]">
            <h2 className="border-b border-[var(--border)] px-4 py-2 text-sm font-semibold">
              商品規格
            </h2>
            <dl className="divide-y divide-[var(--border)]">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex px-4 py-2 text-sm">
                  <dt className="w-24 shrink-0 text-[var(--muted)]">
                    {spec.label}
                  </dt>
                  <dd className="text-[var(--foreground)]">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <p className="text-sm leading-relaxed text-[var(--muted)]">
            {product.description}
          </p>
        </div>
      </div>

      {relatedItems.length > 0 && (
        <section>
          <SectionHeader title="相關商品" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {relatedItems.slice(0, 5).map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,440px)_1fr]">
      <Shimmer className="aspect-square w-full" />
      <div className="space-y-4">
        <Shimmer className="h-6 w-1/3" />
        <Shimmer className="h-8 w-3/4" />
        <Shimmer className="h-20 w-full" />
        <Shimmer className="h-12 w-full" />
      </div>
    </div>
  );
}
