import { Link } from "@tanstack/react-router";

import { useCountdown } from "@/hooks/use-countdown";
import type { Deal } from "@/lib/api-types";

import { Price } from "./price";

function CountdownPill({ endsAt }: { endsAt: string }) {
  const { hours, minutes, seconds, isExpired } = useCountdown(endsAt);
  if (isExpired) {
    return (
      <span className="rounded bg-[var(--surface-tertiary)] px-1.5 py-0.5 text-xs text-[var(--muted)]">
        已結束
      </span>
    );
  }
  return (
    <span className="flex items-center gap-0.5 font-mono text-xs font-bold text-[#e3197b]">
      {[hours, minutes, seconds].map((unit, i) => (
        <span key={i} className="flex items-center gap-0.5">
          {i > 0 && <span className="text-[var(--muted)]">:</span>}
          <span className="rounded bg-[#e3197b] px-1 py-0.5 text-white">
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
    <Link
      to="/goods/$productId"
      params={{ productId: deal.product.id }}
      className="flex w-[150px] shrink-0 snap-start flex-col gap-2 rounded-md border border-[var(--border)] bg-[var(--surface)] p-2.5 transition-shadow hover:shadow-md md:w-[170px]">
      <div className="aspect-square overflow-hidden rounded bg-[var(--surface-secondary)]">
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

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-tertiary)]">
        <div
          className="h-full rounded-full bg-[#ff5500]"
          style={{ width: `${soldPercent}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--muted)]">
        <span>已搶 {soldPercent}%</span>
        <CountdownPill endsAt={deal.endsAt} />
      </div>
    </Link>
  );
}
