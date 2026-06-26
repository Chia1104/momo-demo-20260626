import type { client } from "./orpc";

/**
 * Single source of truth for API shapes on the frontend: everything is inferred
 * from the oRPC client (which is itself typed by the `@repo/api` contract), so
 * the UI never drifts from the backend schemas.
 */
export type Home = Awaited<ReturnType<typeof client.catalog.home>>;
export type ProductGroup = Home["rankings"][number];
export type Product = Home["rankings"][number]["items"][number];
export type ProductDetail = Awaited<
  ReturnType<typeof client.catalog.getProduct>
>;
export type SearchResult = Awaited<ReturnType<typeof client.catalog.search>>;
export type Category = Awaited<ReturnType<typeof client.category.list>>[number];
export type Deal = Awaited<ReturnType<typeof client.deal.list>>[number];
export type DiscoverFeed = Awaited<ReturnType<typeof client.discover.feed>>;
export type LiveStream = Awaited<ReturnType<typeof client.live.list>>[number];
export type PromoTag = Product["tags"][number];

export type SortOption = NonNullable<
  Parameters<typeof client.catalog.search>[0]["sort"]
>;
