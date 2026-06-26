import { useState } from "react";

import { Button, SearchField } from "@heroui/react";
import { Link, useNavigate } from "@tanstack/react-router";
import { Compass, Radio, User } from "lucide-react";

import { CartPopover } from "./cart-popover";

export function SiteHeader() {
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");

  const submit = (value: string) => {
    navigate({
      to: "/search",
      search: { keyword: value.trim() || undefined, page: 1 },
    });
  };

  return (
    <header className="border-border bg-surface/95 sticky top-0 z-50 border-b backdrop-blur">
      <div className="mx-auto flex max-w-[1200px] items-center gap-4 px-4 py-3">
        <Link to="/" className="flex shrink-0 items-center gap-1">
          <span className="bg-accent text-accent-foreground rounded-md px-2 py-1 text-lg leading-none font-black">
            momo
          </span>
          <span className="text-muted hidden text-sm sm:inline">購物網</span>
        </Link>

        <div className="flex flex-1 items-center gap-2">
          <SearchField
            aria-label="搜尋商品"
            value={keyword}
            onChange={setKeyword}
            onSubmit={submit}
            className="flex-1">
            <SearchField.Group>
              <SearchField.SearchIcon />
              <SearchField.Input placeholder="搜尋商品、品牌" />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <Button variant="primary" onPress={() => submit(keyword)}>
            搜尋
          </Button>
        </div>

        <nav className="text-muted flex items-center gap-1">
          <Link
            to="/discover"
            className="hover:text-accent [&.active]:text-accent hidden items-center gap-1 rounded-md px-2 py-1.5 text-sm sm:flex">
            <Compass className="h-4 w-4" /> 逛逛
          </Link>
          <Link
            to="/live"
            className="hover:text-accent [&.active]:text-accent hidden items-center gap-1 rounded-md px-2 py-1.5 text-sm sm:flex">
            <Radio className="h-4 w-4" /> 直播
          </Link>
          <Button isIconOnly variant="ghost" aria-label="會員中心">
            <User className="h-5 w-5" />
          </Button>
          <CartPopover />
        </nav>
      </div>
    </header>
  );
}
