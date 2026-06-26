import { Button, Typography } from "@heroui/react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Link,
} from "@tanstack/react-router";
import { MapPinOff, TriangleAlert } from "lucide-react";

import { SiteFooter } from "@/components/commerce/site-footer";
import { SiteHeader } from "@/components/commerce/site-header";
import { RootProvider } from "@/components/root-provider";

function Layout() {
  return (
    <RootProvider>
      <HeadContent />
      <div className="bg-background text-foreground flex min-h-svh flex-col">
        <SiteHeader />
        <main className="mx-auto w-full max-w-[1200px] flex-1 px-4 py-5">
          <Outlet />
        </main>
        <SiteFooter />
      </div>
    </RootProvider>
  );
}

export const Route = createRootRoute({
  component: Layout,
  notFoundComponent: () => (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <MapPinOff className="text-muted h-16 w-16" />
      <Typography type="h1" className="text-2xl font-bold">
        找不到頁面
      </Typography>
      <p className="text-muted text-sm">
        你要找的頁面不存在或已被移除，回首頁繼續逛逛吧！
      </p>
      <Link
        to="/"
        className="bg-accent text-accent-foreground rounded-md px-6 py-2 text-sm font-semibold hover:opacity-90">
        回到首頁
      </Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <TriangleAlert className="text-danger h-16 w-16" />
      <Typography type="h1" className="text-2xl font-bold">
        發生錯誤
      </Typography>
      <p className="bg-surface-secondary text-muted max-w-md rounded-md px-4 py-2 text-sm">
        {error.message}
      </p>
      <div className="flex gap-3">
        <Button variant="primary" onPress={() => reset()}>
          重新嘗試
        </Button>
        <Link
          to="/"
          className="border-border text-foreground hover:border-accent rounded-md border px-6 py-2 text-sm font-semibold">
          回到首頁
        </Link>
      </div>
    </div>
  ),
});
