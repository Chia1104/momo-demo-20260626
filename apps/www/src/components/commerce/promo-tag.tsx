import type { PromoTag as PromoTagType } from "@/lib/api-types";
import { cn } from "@/lib/utils";

/** Colour treatment per promo type, mirroring momo's loud tag styling. */
const STYLES: Record<string, string> = {
  FLASH_SALE: "bg-[#e3197b] text-white",
  LOWEST: "bg-[#ff5500] text-white",
  COUPON: "bg-[#fff0f6] text-[#e3197b] border border-[#e3197b]",
  MO_COIN: "bg-[#fff7e6] text-[#d48806] border border-[#ffd591]",
  BUY_ONE_GET_ONE: "bg-[#f6ffed] text-[#389e0d] border border-[#b7eb8f]",
  FREE_SHIPPING: "bg-[var(--surface-secondary)] text-[var(--muted)]",
  NEW: "bg-[#e6f7ff] text-[#0958d9] border border-[#91caff]",
};

export function PromoTagBadge({
  tag,
  className,
}: {
  tag: PromoTagType;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[11px] leading-none font-medium",
        STYLES[tag.type] ?? "bg-[var(--surface-secondary)] text-[var(--muted)]",
        className
      )}>
      {tag.label}
    </span>
  );
}
