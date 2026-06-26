import { Button, Spinner } from "@heroui/react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { ProductCard } from "@/components/commerce/product-card";
import { SectionHeader } from "@/components/commerce/section-header";
import { ProductGridSkeleton } from "@/components/commerce/skeletons";
import { orpc } from "@/lib/orpc";

export const Route = createFileRoute("/discover/")({
  component: DiscoverPage,
});

function DiscoverPage() {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useInfiniteQuery(
      orpc.discover.feed.infiniteOptions({
        input: (cursor: string | undefined) => (cursor ? { cursor } : {}),
        initialPageParam: undefined as string | undefined,
        getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
      })
    );

  const items = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div className="space-y-5">
      <SectionHeader title="逛逛" subtitle="為你精選的人氣好物" />

      {isLoading ? (
        <ProductGridSkeleton count={12} />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="flex justify-center pt-4">
            {hasNextPage ? (
              <Button
                variant="outline"
                isPending={isFetchingNextPage}
                onPress={() => fetchNextPage()}>
                {isFetchingNextPage ? (
                  <>
                    <Spinner size="sm" color="current" /> 載入中...
                  </>
                ) : (
                  "載入更多"
                )}
              </Button>
            ) : (
              <span className="text-muted text-sm">已經到底囉</span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
