import { useState } from "react";

import { Link, useNavigate } from "@tanstack/react-router";
import { Compass, Search, ShoppingCart, Radio, User } from "lucide-react";

import { selectCartCount, useCartStore } from "@/stores/cart";

export function SiteHeader() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const cartCount = useCartStore(selectCartCount);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate({
      to: "/search",
      search: { keyword: keyword.trim() || undefined, page: 1 },
    });
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-1">
          <span className="rounded-md bg-[#e3197b] px-2 py-1 text-lg leading-none font-black text-white">
            momo
          </span>
          <span className="hidden text-sm text-[var(--muted)] sm:inline">
            購物網
          </span>
        </Link>

        <form onSubmit={onSubmit} className="flex flex-1 items-center">
          <div className="flex w-full items-center rounded-full border-2 border-[#e3197b] bg-[var(--surface)] pl-4">
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="搜尋商品、品牌"
              className="w-full bg-transparent py-1.5 text-sm text-[var(--foreground)] outline-none placeholder:text-[var(--field-placeholder)]"
            />
            <button
              type="submit"
              aria-label="搜尋"
              className="flex h-9 items-center justify-center rounded-full bg-[#e3197b] px-4 text-white">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        <nav className="flex items-center gap-1 text-[var(--muted)]">
          <Link
            to="/discover"
            className="hidden items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:text-[#e3197b] sm:flex [&.active]:text-[#e3197b]">
            <Compass className="h-4 w-4" /> 逛逛
          </Link>
          <Link
            to="/live"
            className="hidden items-center gap-1 rounded-md px-2 py-1.5 text-sm hover:text-[#e3197b] sm:flex [&.active]:text-[#e3197b]">
            <Radio className="h-4 w-4" /> 直播
          </Link>
          <button
            type="button"
            aria-label="會員中心"
            className="flex h-9 w-9 items-center justify-center rounded-md hover:text-[#e3197b]">
            <User className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="購物車"
            className="relative flex h-9 w-9 items-center justify-center rounded-md hover:text-[#e3197b]">
            <ShoppingCart className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex min-w-[18px] items-center justify-center rounded-full bg-[#e3197b] px-1 text-[11px] leading-[18px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </button>
        </nav>
      </div>
    </header>
  );
}
