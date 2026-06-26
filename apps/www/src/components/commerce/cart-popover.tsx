import { useState } from "react";

import { Badge, Button, Popover } from "@heroui/react";
import { useNavigate } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";

import { formatPrice } from "@/lib/format";
import { selectCartCount, selectCartTotal, useCartStore } from "@/stores/cart";

import { CartLineItem } from "./cart-line-item";

/**
 * Cart trigger in the header. Opens a Popover for quick management (qty /
 * remove / clear) and links through to the full /cart page for checkout.
 */
export function CartPopover() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);
  const total = useCartStore(selectCartTotal);
  const clear = useCartStore((s) => s.clear);

  const goToCart = () => {
    setOpen(false);
    navigate({ to: "/cart" });
  };

  return (
    <Popover isOpen={open} onOpenChange={setOpen}>
      <Popover.Trigger
        aria-label="購物車"
        className="text-muted hover:text-accent focus-visible:ring-focus flex h-9 w-9 items-center justify-center rounded-md outline-none focus-visible:ring-2">
        <Badge.Anchor>
          <ShoppingCart className="h-5 w-5" />
          {count > 0 && (
            <Badge color="accent" size="sm">
              {count}
            </Badge>
          )}
        </Badge.Anchor>
      </Popover.Trigger>

      <Popover.Content className="w-[360px]" placement="bottom">
        <Popover.Dialog>
          <Popover.Heading className="text-base font-bold">
            購物車（{count}）
          </Popover.Heading>

          {items.length === 0 ? (
            <div className="text-muted py-10 text-center text-sm">
              購物車是空的，快去逛逛吧！
            </div>
          ) : (
            <>
              <div className="divide-border mt-2 max-h-[320px] divide-y overflow-y-auto">
                {items.map((item) => (
                  <CartLineItem
                    key={item.id}
                    item={item}
                    compact
                    onNavigate={() => setOpen(false)}
                  />
                ))}
              </div>

              <div className="border-border mt-3 flex items-center justify-between border-t pt-3">
                <span className="text-muted text-sm">小計</span>
                <span className="text-accent text-lg font-bold">
                  <span className="text-[0.7em]">$</span>
                  {formatPrice(total)}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <Button variant="outline" className="flex-1" onPress={clear}>
                  清空
                </Button>
                <Button variant="primary" className="flex-1" onPress={goToCart}>
                  查看購物車
                </Button>
              </div>
            </>
          )}
        </Popover.Dialog>
      </Popover.Content>
    </Popover>
  );
}
