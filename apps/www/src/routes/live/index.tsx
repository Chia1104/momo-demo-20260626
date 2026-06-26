import { Card, Chip, Skeleton } from "@heroui/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { Radio, Users } from "lucide-react";

import { ProductCard } from "@/components/commerce/product-card";
import { SectionHeader } from "@/components/commerce/section-header";
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
        <Skeleton className="aspect-video w-full rounded-lg" />
        <Skeleton className="aspect-video w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader title="直播" subtitle="momo 購物台 邊看邊買" />

      {data.map((stream) => (
        <Card key={stream.id} className="overflow-hidden p-0">
          <div className="bg-surface-secondary relative aspect-video w-full overflow-hidden">
            <img
              src={stream.cover}
              alt={stream.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute top-3 left-3 flex items-center gap-2">
              {stream.isLive ? (
                <Chip color="accent" variant="primary" size="sm">
                  <Radio className="h-3 w-3" /> LIVE
                </Chip>
              ) : (
                <Chip color="default" variant="primary" size="sm">
                  重播
                </Chip>
              )}
              <Chip color="default" variant="primary" size="sm">
                <Users className="h-3 w-3" /> {formatCount(stream.viewers)}
              </Chip>
            </div>
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
              <h2 className="text-lg font-bold text-white">{stream.title}</h2>
              <p className="text-sm text-white/80">{stream.host}</p>
            </div>
          </div>

          <div className="p-4">
            <h3 className="text-muted mb-3 text-sm font-semibold">
              直播主打商品
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {stream.products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
