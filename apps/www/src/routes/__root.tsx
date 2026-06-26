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
      <div className="flex min-h-screen flex-col bg-[var(--background)] text-[var(--foreground)]">
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
      <p className="text-2xl font-bold">找不到頁面</p>
      <Link to="/" className="text-[#e3197b] hover:underline">
        回到首頁
      </Link>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <p className="text-2xl font-bold">發生錯誤</p>
      <p className="text-sm text-[var(--muted)]">{error.message}</p>
    </div>
  ),
});
