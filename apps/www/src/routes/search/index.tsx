import { Button, Pagination } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import * as z from "zod";

import { ProductCard } from "@/components/commerce/product-card";
import { SectionHeader } from "@/components/commerce/section-header";
import { ProductGridSkeleton } from "@/components/commerce/skeletons";
import type { SortOption } from "@/lib/api-types";
import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query-client";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

const searchSchema = z.object({
  keyword: z.string().optional(),
  categoryId: z.string().optional(),
  sort: z.enum(["price_asc", "price_desc", "sales", "newest"]).optional(),
  page: z.coerce.number().int().min(1).catch(1).default(1),
});

const SORT_LABELS: { value: SortOption; label: string }[] = [
  { value: "sales", label: "依銷量" },
  { value: "newest", label: "最新" },
  { value: "price_asc", label: "價格低→高" },
  { value: "price_desc", label: "價格高→低" },
];

export const Route = createFileRoute("/search/")({
  validateSearch: (input: Record<string, unknown>) => searchSchema.parse(input),
  loaderDeps: ({ search }) => search,
  loader: ({ deps }) =>
    getQueryClient().ensureQueryData(
      orpc.catalog.search.queryOptions({
        input: {
          keyword: deps.keyword,
          categoryId: deps.categoryId,
          sort: deps.sort,
          page: deps.page,
          pageSize: PAGE_SIZE,
        },
      })
    ),
  component: SearchPage,
});

function SearchPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });

  const { data, isFetching } = useQuery(
    orpc.catalog.search.queryOptions({
      input: {
        keyword: search.keyword,
        categoryId: search.categoryId,
        sort: search.sort,
        page: search.page,
        pageSize: PAGE_SIZE,
      },
    })
  );
  const { data: categories } = useQuery(orpc.category.list.queryOptions());

  const title = search.keyword ? `「${search.keyword}」的搜尋結果` : "全部商品";
  const goToPage = (page: number) =>
    navigate({ search: (p) => ({ ...p, page }) });

  return (
    <div className="space-y-5">
      <SectionHeader
        title={title}
        subtitle={data ? `共 ${data.total} 件` : undefined}
      />

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant={!search.categoryId ? "primary" : "outline"}
          onPress={() =>
            navigate({
              search: (p) => ({ ...p, categoryId: undefined, page: 1 }),
            })
          }>
          全部分類
        </Button>
        {categories?.map((c) => (
          <Button
            key={c.id}
            size="sm"
            variant={search.categoryId === c.id ? "primary" : "outline"}
            onPress={() =>
              navigate({ search: (p) => ({ ...p, categoryId: c.id, page: 1 }) })
            }>
            {c.name}
          </Button>
        ))}
      </div>

      <div className="border-border flex items-center gap-2 border-b pb-2">
        {SORT_LABELS.map((opt) => (
          <Button
            key={opt.value}
            size="sm"
            variant={
              (search.sort ?? "sales") === opt.value ? "primary" : "ghost"
            }
            onPress={() =>
              navigate({ search: (p) => ({ ...p, sort: opt.value, page: 1 }) })
            }>
            {opt.label}
          </Button>
        ))}
      </div>

      {!data ? (
        <ProductGridSkeleton count={PAGE_SIZE} />
      ) : data.items.length === 0 ? (
        <div className="text-muted py-20 text-center">
          找不到符合條件的商品，試試其他關鍵字。
        </div>
      ) : (
        <div
          className={cn(
            "grid grid-cols-2 gap-3 transition-opacity sm:grid-cols-3 lg:grid-cols-5",
            isFetching && "opacity-60"
          )}>
          {data.items.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {data && data.totalPages > 1 && (
        <Pagination className="justify-center pt-4">
          <Pagination.Content>
            <Pagination.Item>
              <Pagination.Previous
                isDisabled={data.page === 1}
                onPress={() => goToPage(data.page - 1)}>
                <Pagination.PreviousIcon />
              </Pagination.Previous>
            </Pagination.Item>
            {Array.from({ length: data.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <Pagination.Item key={page}>
                  <Pagination.Link
                    isActive={page === data.page}
                    onPress={() => goToPage(page)}>
                    {page}
                  </Pagination.Link>
                </Pagination.Item>
              )
            )}
            <Pagination.Item>
              <Pagination.Next
                isDisabled={data.page === data.totalPages}
                onPress={() => goToPage(data.page + 1)}>
                <Pagination.NextIcon />
              </Pagination.Next>
            </Pagination.Item>
          </Pagination.Content>
        </Pagination>
      )}
    </div>
  );
}
