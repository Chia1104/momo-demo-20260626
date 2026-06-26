import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
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

  return (
    <div className="space-y-5">
      <SectionHeader
        title={title}
        subtitle={data ? `共 ${data.total} 件` : undefined}
      />

      <div className="flex flex-wrap items-center gap-2">
        <FilterChip
          active={!search.categoryId}
          onClick={() =>
            navigate({
              search: (p) => ({ ...p, categoryId: undefined, page: 1 }),
            })
          }>
          全部分類
        </FilterChip>
        {categories?.map((c) => (
          <FilterChip
            key={c.id}
            active={search.categoryId === c.id}
            onClick={() =>
              navigate({ search: (p) => ({ ...p, categoryId: c.id, page: 1 }) })
            }>
            {c.name}
          </FilterChip>
        ))}
      </div>

      <div className="flex items-center gap-2 border-b border-[var(--border)] pb-2">
        {SORT_LABELS.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() =>
              navigate({ search: (p) => ({ ...p, sort: opt.value, page: 1 }) })
            }
            className={cn(
              "rounded-full px-3 py-1 text-sm transition-colors",
              (search.sort ?? "sales") === opt.value
                ? "bg-[#e3197b] text-white"
                : "text-[var(--muted)] hover:text-[#e3197b]"
            )}>
            {opt.label}
          </button>
        ))}
      </div>

      {!data ? (
        <ProductGridSkeleton count={PAGE_SIZE} />
      ) : data.items.length === 0 ? (
        <div className="py-20 text-center text-[var(--muted)]">
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
        <div className="flex items-center justify-center gap-2 pt-4">
          {Array.from({ length: data.totalPages }).map((_, i) => {
            const page = i + 1;
            return (
              <Link
                key={page}
                to="/search"
                search={(p) => ({ ...p, page })}
                className={cn(
                  "flex h-9 min-w-9 items-center justify-center rounded-md border px-3 text-sm",
                  page === data.page
                    ? "border-[#e3197b] bg-[#e3197b] text-white"
                    : "border-[var(--border)] text-[var(--foreground)] hover:border-[#e3197b]"
                )}>
                {page}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-sm transition-colors",
        active
          ? "border-[#e3197b] bg-[#fff0f6] text-[#e3197b]"
          : "border-[var(--border)] text-[var(--muted)] hover:border-[#e3197b]"
      )}>
      {children}
    </button>
  );
}
