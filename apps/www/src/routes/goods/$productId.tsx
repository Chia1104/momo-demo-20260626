import { useState } from "react";

import { Button, Skeleton, Table, Typography } from "@heroui/react";
import { ORPCError } from "@orpc/client";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, Minus, PackageX, Plus, ShoppingCart, Star } from "lucide-react";

import { Price } from "@/components/commerce/price";
import { ProductCard } from "@/components/commerce/product-card";
import { PromoTagBadge } from "@/components/commerce/promo-tag";
import { SectionHeader } from "@/components/commerce/section-header";
import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/stores/cart";

export const Route = createFileRoute("/goods/$productId")({
  loader: async ({ params }) => {
    try {
      return await getQueryClient().ensureQueryData(
        orpc.catalog.getProduct.queryOptions({
          input: { id: params.productId },
        })
      );
    } catch (error) {
      // Surface the dedicated not-found UI for unknown products; rethrow
      // everything else so the route error boundary can handle it.
      if (error instanceof ORPCError && error.code === "NOT_FOUND") {
        throw notFound();
      }
      throw error;
    }
  },
  component: ProductDetailPage,
  pendingComponent: DetailSkeleton,
  notFoundComponent: ProductNotFound,
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
      <nav className="text-muted text-xs">
        <Link to="/" className="hover:text-accent">
          首頁
        </Link>
        <span className="mx-1">/</span>
        <Link
          to="/search"
          search={{ categoryId: product.categoryId, page: 1 }}
          className="hover:text-accent">
          {product.categoryId}
        </Link>
      </nav>

      <div className="grid gap-6 md:grid-cols-[minmax(0,440px)_1fr]">
        <div className="space-y-3">
          <div className="border-border bg-surface-secondary aspect-square overflow-hidden rounded-lg border">
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
                aria-label={`預覽圖 ${i + 1}`}
                onClick={() => setActiveImage(i)}
                className={cn(
                  "h-16 w-16 overflow-hidden rounded border-2",
                  i === activeImage ? "border-accent" : "border-border"
                )}>
                <img src={img} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {product.brand && (
            <span className="text-muted text-sm">{product.brand}</span>
          )}
          <Typography
            type="h1"
            className="text-xl leading-snug font-bold md:text-2xl">
            {product.name}
          </Typography>

          <div className="text-muted flex items-center gap-4 text-sm">
            {product.rating != null && (
              <span className="flex items-center gap-1">
                <Star className="fill-warning text-warning h-4 w-4" />
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

          <div className="bg-surface-secondary rounded-lg p-4">
            <Price
              value={product.price}
              original={product.originalPrice}
              size="lg"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-muted text-sm">數量</span>
            <div className="flex items-center rounded-md">
              <Button
                isIconOnly
                variant="tertiary"
                size="sm"
                aria-label="減少"
                onPress={() => setQty((q) => Math.max(1, q - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-10 text-center text-sm">{qty}</span>
              <Button
                isIconOnly
                variant="tertiary"
                size="sm"
                aria-label="增加"
                onPress={() => setQty((q) => q + 1)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <Button
            fullWidth
            size="lg"
            variant="primary"
            isDisabled={product.soldOut}
            onPress={onAdd}>
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
          </Button>

          <div className="space-y-2">
            <h2 className="text-sm font-semibold">商品規格</h2>
            <Table aria-label="商品規格">
              <Table.ScrollContainer>
                <Table.Content>
                  <Table.Header>
                    <Table.Column isRowHeader>規格項目</Table.Column>
                    <Table.Column>說明</Table.Column>
                  </Table.Header>
                  <Table.Body>
                    {product.specs.map((spec) => (
                      <Table.Row key={spec.label}>
                        <Table.Cell className="text-muted">
                          {spec.label}
                        </Table.Cell>
                        <Table.Cell>{spec.value}</Table.Cell>
                      </Table.Row>
                    ))}
                  </Table.Body>
                </Table.Content>
              </Table.ScrollContainer>
            </Table>
          </div>

          <p className="text-muted text-sm leading-relaxed">
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
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="space-y-4">
        <Skeleton className="h-6 w-1/3 rounded" />
        <Skeleton className="h-8 w-3/4 rounded" />
        <Skeleton className="h-20 w-full rounded" />
        <Skeleton className="h-12 w-full rounded" />
      </div>
    </div>
  );
}

function ProductNotFound() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <PackageX className="text-muted h-16 w-16" />
      <Typography type="h1" className="text-2xl font-bold">
        找不到這個商品
      </Typography>
      <p className="text-muted text-sm">
        商品可能已下架或網址有誤，看看其他熱賣商品吧！
      </p>
      <div className="flex gap-3">
        <Link
          to="/"
          className="bg-accent text-accent-foreground rounded-md px-6 py-2 text-sm font-semibold hover:opacity-90">
          回到首頁
        </Link>
        <Link
          to="/search"
          search={{ page: 1 }}
          className="border-border text-foreground hover:border-accent rounded-md border px-6 py-2 text-sm font-semibold">
          逛逛全部商品
        </Link>
      </div>
    </div>
  );
}
