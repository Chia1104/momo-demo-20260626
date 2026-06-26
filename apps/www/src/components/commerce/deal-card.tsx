import { Card, ProgressBar } from "@heroui/react";
import { Link } from "@tanstack/react-router";

import { useCountdown } from "@/hooks/use-countdown";
import type { Deal } from "@/lib/api-types";

import { Price } from "./price";

function CountdownPill({ endsAt }: { endsAt: string }) {
  const { hours, minutes, seconds, isExpired } = useCountdown(endsAt);
  if (isExpired) {
    return (
      <span className="bg-surface-tertiary text-muted rounded px-1.5 py-0.5 text-xs">
        已結束
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 font-mono text-xs font-bold">
      {[hours, minutes, seconds].map((unit, i) => (
        <span key={i} className="flex items-center gap-0.5">
          {i > 0 && <span className="text-muted">:</span>}
          <span className="bg-accent text-accent-foreground rounded px-1 py-0.5">
            {unit}
          </span>
        </span>
      ))}
    </span>
  );
}

export function DealCard({ deal }: { deal: Deal }) {
  const soldPercent = Math.min(
    100,
    Math.round((deal.soldQty / deal.totalQty) * 100)
  );

  return (
    <Card className="relative w-[150px] shrink-0 snap-start gap-2 p-2.5 transition-shadow hover:shadow-md md:w-[170px]">
      <Link
        to="/goods/$productId"
        params={{ productId: deal.product.id }}
        aria-label={deal.product.name}
        className="absolute inset-0 z-0"
      />
      <div className="bg-surface-secondary pointer-events-none aspect-square overflow-hidden rounded">
        <img
          src={deal.product.image}
          alt={deal.product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <h3 className="line-clamp-2 min-h-[2.5rem] text-sm leading-tight">
        {deal.product.name}
      </h3>
      <Price
        value={deal.dealPrice}
        original={deal.product.originalPrice}
        size="md"
      />

      <ProgressBar
        aria-label="搶購進度"
        value={soldPercent}
        size="sm"
        color="accent"
        className="pointer-events-none w-full">
        <ProgressBar.Track>
          <ProgressBar.Fill />
        </ProgressBar.Track>
      </ProgressBar>
      <div className="text-muted flex items-center justify-between text-xs">
        <span>已搶 {soldPercent}%</span>
        <CountdownPill endsAt={deal.endsAt} />
      </div>
    </Card>
  );
}
