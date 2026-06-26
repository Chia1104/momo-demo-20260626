import { Button } from "@heroui/react";
import { Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { CartItem } from "@/stores/cart";
import { useCartStore } from "@/stores/cart";

interface CartLineItemProps {
  item: CartItem;
  /** Compact layout for the header popover; full layout for the cart page. */
  compact?: boolean;
  /** Invoked after navigating away (e.g. to close the popover). */
  onNavigate?: () => void;
}

export function CartLineItem({ item, compact, onNavigate }: CartLineItemProps) {
  const setQty = useCartStore((s) => s.setQty);
  const remove = useCartStore((s) => s.remove);

  return (
    <div className="flex gap-3 py-3">
      <Link
        to="/goods/$productId"
        params={{ productId: item.id }}
        onClick={onNavigate}
        className={cn(
          "bg-surface-secondary shrink-0 overflow-hidden rounded",
          compact ? "h-14 w-14" : "h-20 w-20"
        )}>
        <img
          src={item.image}
          alt={item.name}
          className="h-full w-full object-cover"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          to="/goods/$productId"
          params={{ productId: item.id }}
          onClick={onNavigate}
          className="text-foreground hover:text-accent line-clamp-2 text-sm leading-tight">
          {item.brand && <span className="text-muted">{item.brand} </span>}
          {item.name}
        </Link>

        <div className="mt-auto flex items-center justify-between gap-2">
          <div className="flex items-center rounded-md">
            <Button
              isIconOnly
              size="sm"
              variant="tertiary"
              aria-label="減少數量"
              onPress={() => setQty(item.id, item.qty - 1)}>
              <Minus className="h-3.5 w-3.5" />
            </Button>
            <span className="w-8 text-center text-sm">{item.qty}</span>
            <Button
              isIconOnly
              size="sm"
              variant="tertiary"
              aria-label="增加數量"
              onPress={() => setQty(item.id, item.qty + 1)}>
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-accent font-bold">
              <span className="text-[0.7em]">$</span>
              {formatPrice(item.price * item.qty)}
            </span>
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              aria-label="移除商品"
              onPress={() => remove(item.id)}>
              <Trash2 className="text-muted h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
