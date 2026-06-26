import { Avatar, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { BannerCarousel } from "@/components/commerce/banner-carousel";
import { DealCard } from "@/components/commerce/deal-card";
import { RankingList } from "@/components/commerce/ranking-list";
import { SectionHeader } from "@/components/commerce/section-header";
import { ProductGridSkeleton } from "@/components/commerce/skeletons";
import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query-client";

export const Route = createFileRoute("/")({
  loader: () =>
    getQueryClient().ensureQueryData(orpc.catalog.home.queryOptions()),
  component: HomePage,
});

function HomePage() {
  const { data, isLoading } = useQuery(orpc.catalog.home.queryOptions());

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="aspect-[1200/420] w-full rounded-lg" />
        <ProductGridSkeleton count={10} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <BannerCarousel banners={data.banners} />

      <section>
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {data.flagshipBrands.map((brand) => (
            <Link
              key={brand.id}
              to="/search"
              search={{ keyword: brand.name, page: 1 }}
              className="flex flex-col items-center gap-1.5 text-center">
              <Avatar size="lg">
                <Avatar.Image src={brand.logo} alt={brand.name} />
                <Avatar.Fallback>{brand.name.slice(0, 2)}</Avatar.Fallback>
              </Avatar>
              <span className="text-muted text-xs">{brand.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {data.dailyDeals.length > 0 && (
        <section>
          <SectionHeader
            title="限時秒殺"
            subtitle="今日限定 售完為止"
            action={
              <Link
                to="/search"
                search={{ sort: "sales", page: 1 }}
                className="text-accent text-sm hover:underline">
                看更多 ›
              </Link>
            }
          />
          <div className="flex snap-x [scrollbar-width:none] gap-3 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden">
            {data.dailyDeals.map((deal) => (
              <DealCard key={deal.id} deal={deal} />
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionHeader title="熱銷精選" subtitle="各分類人氣排行" />
        <div className="space-y-6">
          {data.rankings.slice(0, 4).map((group) => (
            <div key={group.categoryId}>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-foreground text-sm font-semibold">
                  {group.title}
                </h3>
                <Link
                  to="/search"
                  search={{
                    categoryId: group.categoryId,
                    sort: "sales",
                    page: 1,
                  }}
                  className="text-muted hover:text-accent text-xs">
                  更多
                </Link>
              </div>
              <RankingList group={group} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="品牌新品" subtitle="New Arrival" />
        <div className="space-y-6">
          {data.newArrivals.slice(0, 3).map((group) => (
            <div key={group.categoryId}>
              <h3 className="text-foreground mb-2 text-sm font-semibold">
                {group.title}
              </h3>
              <RankingList group={group} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
