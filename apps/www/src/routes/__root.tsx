import { Typography } from "@heroui/react";
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Link,
} from "@tanstack/react-router";

import { SiteFooter } from "@/components/commerce/site-footer";
import { SiteHeader } from "@/components/commerce/site-header";
import { RootProvider } from "@/components/root-provider";

function Layout() {
  return (
    <RootProvider>
      <HeadContent />
      <div className="bg-background text-foreground flex min-h-screen flex-col">
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
      <Typography type="h2" className="text-2xl font-bold">
        找不到頁面
      </Typography>
      <Link to="/" className="text-accent hover:underline">
        回到首頁
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <Typography type="h2" className="text-2xl font-bold">
        發生錯誤
      </Typography>
      <p className="text-muted text-sm">{error.message}</p>
    </div>
  ),
});
