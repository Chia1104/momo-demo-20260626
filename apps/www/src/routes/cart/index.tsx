import { useState } from "react";

import { Button, Card } from "@heroui/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { CheckCircle2, ShoppingCart } from "lucide-react";

import { CartLineItem } from "@/components/commerce/cart-line-item";
import { SectionHeader } from "@/components/commerce/section-header";
import { formatPrice } from "@/lib/format";
import { selectCartCount, selectCartTotal, useCartStore } from "@/stores/cart";

export const Route = createFileRoute("/cart/")({
  component: CartPage,
});

const FREE_SHIPPING_THRESHOLD = 490;
const SHIPPING_FEE = 60;

function CartPage() {
  const items = useCartStore((s) => s.items);
  const count = useCartStore(selectCartCount);
  const subtotal = useCartStore(selectCartTotal);
  const clear = useCartStore((s) => s.clear);
  const [ordered, setOrdered] = useState(false);

  const shipping =
    subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  const checkout = () => {
    setOrdered(true);
    clear();
  };

  if (ordered) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <CheckCircle2 className="text-success h-16 w-16" />
        <h1 className="text-2xl font-bold">訂單已送出！</h1>
        <p className="text-muted text-sm">
          這是 mock 結帳流程，未實際成立任何訂單。
        </p>
        <Link
          to="/"
          className="bg-accent text-accent-foreground rounded-md px-6 py-2 text-sm font-semibold hover:opacity-90">
          繼續購物
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
        <ShoppingCart className="text-muted h-16 w-16" />
        <h1 className="text-2xl font-bold">購物車是空的</h1>
        <p className="text-muted text-sm">快去挑選喜歡的商品吧！</p>
        <Link
          to="/"
          className="bg-accent text-accent-foreground rounded-md px-6 py-2 text-sm font-semibold hover:opacity-90">
          去逛逛
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <SectionHeader title="購物車" subtitle={`共 ${count} 件`} />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <Card className="divide-border divide-y p-4">
          {items.map((item) => (
            <CartLineItem key={item.id} item={item} />
          ))}
        </Card>

        <div className="space-y-3">
          <Card className="space-y-3 p-4">
            <h2 className="text-base font-bold">訂單摘要</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted">商品小計</span>
              <span>${formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted">運費</span>
              <span>
                {shipping === 0 ? "免運" : `$${formatPrice(shipping)}`}
              </span>
            </div>
            {shipping > 0 && (
              <p className="text-muted text-xs">
                再買 ${formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)}{" "}
                元即可免運
              </p>
            )}
            <div className="border-border flex items-baseline justify-between border-t pt-3">
              <span className="text-sm font-semibold">應付總額</span>
              <span className="text-accent text-2xl font-bold">
                <span className="text-[0.6em]">$</span>
                {formatPrice(total)}
              </span>
            </div>
            <Button fullWidth size="lg" variant="primary" onPress={checkout}>
              前往結帳
            </Button>
            <Button fullWidth variant="ghost" onPress={clear}>
              清空購物車
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
}
