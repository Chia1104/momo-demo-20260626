import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Radio, Users } from "lucide-react";

import { ProductCard } from "@/components/commerce/product-card";
import { SectionHeader } from "@/components/commerce/section-header";
import { Shimmer } from "@/components/commerce/skeletons";
import { formatCount } from "@/lib/format";
import { orpc } from "@/lib/orpc";
import { getQueryClient } from "@/lib/query-client";

export const Route = createFileRoute("/live/")({
  loader: () => getQueryClient().ensureQueryData(orpc.live.list.queryOptions()),
  component: LivePage,
});

function LivePage() {
  const { data, isLoading } = useQuery(orpc.live.list.queryOptions());

  if (isLoading || !data) {
    return (
      <div className="space-y-4">
        <Shimmer className="aspect-video w-full" />
        <Shimmer className="aspect-video w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader title="直播" subtitle="momo 購物台 邊看邊買" />

      {data.map((stream) => (
        <section
          key={stream.id}
          className="overflow-hidden rounded-lg border border-[var(--border)] bg-[var(--surface)]">
          <div className="relative aspect-video w-full overflow-hidden bg-[var(--surface-secondary)]">
            <img
              src={stream.cover}
              alt={stream.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {stream.isLive ? (
                <span className="flex items-center gap-1 rounded-full bg-[#e3197b] px-2 py-1 text-xs font-bold text-white">
                  <Radio className="h-3 w-3" /> LIVE
                </span>
              ) : (
                <span className="rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                  重播
                </span>
              )}
              <span className="flex items-center gap-1 rounded-full bg-black/60 px-2 py-1 text-xs text-white">
                <Users className="h-3 w-3" /> {formatCount(stream.viewers)}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h2 className="text-lg font-bold text-white">{stream.title}</h2>
              <p className="text-sm text-white/80">{stream.host}</p>
            </div>
          </div>

          <div className="p-4">
            <h3 className="mb-3 text-sm font-semibold text-[var(--muted)]">
              直播主打商品
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stream.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
