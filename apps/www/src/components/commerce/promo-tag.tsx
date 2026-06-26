import { Chip } from "@heroui/react";

import type { PromoTag as PromoTagType } from "@/lib/api-types";

type ChipColor = "accent" | "default" | "success" | "warning" | "danger";
type ChipVariant = "primary" | "secondary" | "tertiary" | "soft";

/**
 * Maps each promo type to a HeroUI Chip color/variant so tags inherit the
 * theme (and stay consistent in light/dark) instead of hardcoded colors.
 */
const STYLES: Record<string, { color: ChipColor; variant: ChipVariant }> = {
  FLASH_SALE: { color: "accent", variant: "primary" },
  LOWEST: { color: "warning", variant: "primary" },
  COUPON: { color: "accent", variant: "soft" },
  MO_COIN: { color: "warning", variant: "soft" },
  BUY_ONE_GET_ONE: { color: "success", variant: "soft" },
  FREE_SHIPPING: { color: "default", variant: "soft" },
  NEW: { color: "accent", variant: "secondary" },
};

export function PromoTagBadge({
  tag,
  className,
}: {
  tag: PromoTagType;
  className?: string;
}) {
  const style = STYLES[tag.type] ?? { color: "default", variant: "soft" };
  return (
    <Chip
      color={style.color}
      variant={style.variant}
      size="sm"
      className={className}>
      {tag.label}
    </Chip>
  );
}
