import dayjs from "dayjs";

import type { Category } from "../schemas/category.schema";
import type { Paginated, Sort } from "../schemas/common.schema";
import type { Deal } from "../schemas/deal.schema";
import type { DiscoverFeed } from "../schemas/discover.schema";
import type { Home, ProductGroup } from "../schemas/home.schema";
import type { LiveStream } from "../schemas/live.schema";
import type { Product, ProductDetail } from "../schemas/product.schema";

import { banners } from "./data/banners";
import { brands } from "./data/brands";
import { categories, topCategories } from "./data/categories";
import { products } from "./data/products";

export { banners, brands, categories, products };

/* ----------------------------- core helpers ----------------------------- */

const sortProducts = (items: Product[], sort?: Sort): Product[] => {
  const copy = [...items];
  switch (sort) {
    case "price_asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price_desc":
      return copy.sort((a, b) => b.price - a.price);
    case "sales":
      return copy.sort((a, b) => b.sales - a.sales);
    case "newest":
      return copy.reverse();
    default:
      return copy;
  }
};

export const paginate = <T>(
  items: T[],
  page = 1,
  pageSize = 20
): Paginated<T> => {
  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(Math.max(1, page), totalPages);
  const start = (safePage - 1) * pageSize;
  return {
    items: items.slice(start, start + pageSize),
    page: safePage,
    pageSize,
    total,
    totalPages,
    hasNextPage: safePage < totalPages,
  };
};

/* ------------------------------- products -------------------------------- */

export const getProductById = (id: string): Product | undefined =>
  products.find((p) => p.id === id);

export const getProductsByCategory = (categoryId?: string): Product[] =>
  categoryId ? products.filter((p) => p.categoryId === categoryId) : products;

export interface SearchParams {
  keyword?: string;
  categoryId?: string;
  sort?: Sort;
  page?: number;
  pageSize?: number;
}

export const searchProducts = ({
  keyword,
  categoryId,
  sort,
  page = 1,
  pageSize = 20,
}: SearchParams): Paginated<Product> => {
  let result = products;
  if (categoryId) result = result.filter((p) => p.categoryId === categoryId);
  if (keyword?.trim()) {
    const kw = keyword.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.name.toLowerCase().includes(kw) ||
        (p.brand?.toLowerCase().includes(kw) ?? false)
    );
  }
  return paginate(sortProducts(result, sort), page, pageSize);
};

export const getProductDetailById = (id: string): ProductDetail | undefined => {
  const product = getProductById(id);
  if (!product) return undefined;
  const related = products
    .filter((p) => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 6)
    .map((p) => p.id);
  return {
    ...product,
    images: [product.image, `${product.image}?v=2`, `${product.image}?v=3`],
    description: `${product.brand ?? ""} ${product.name}。原廠公司貨，momo 獨家販售，提供完整保固與快速到貨服務。`,
    specs: [
      { label: "品牌", value: product.brand ?? "-" },
      { label: "商品分類", value: product.categoryId },
      { label: "出貨方式", value: "momo 倉直送 / 24H 到貨" },
      { label: "保固", value: "原廠保固一年" },
    ],
    relatedIds: related,
  };
};

/* ------------------------------- groupings ------------------------------- */

const groupBy = (
  pick: (items: Product[]) => Product[],
  limit: number
): ProductGroup[] =>
  topCategories.map((c) => ({
    categoryId: c.id,
    title: c.name,
    items: pick(getProductsByCategory(c.id)).slice(0, limit),
  }));

export const getRankingsByCategory = (limit = 5): ProductGroup[] =>
  groupBy((items) => sortProducts(items, "sales"), limit);

export const getNewArrivalsByCategory = (limit = 5): ProductGroup[] =>
  groupBy((items) => sortProducts(items, "newest"), limit);

/* --------------------------------- deals --------------------------------- */

export const getActiveDeals = (limit = 8): Deal[] =>
  sortProducts(
    products.filter((p) => p.tags.some((t) => t.type === "FLASH_SALE")),
    "sales"
  )
    .slice(0, limit)
    .map((product, i) => {
      const totalQty = 100 + i * 20;
      return {
        id: `deal-${product.id}`,
        product,
        dealPrice: Math.round(product.price * 0.9),
        // staggered expiry within the next 12 hours
        endsAt: dayjs()
          .add(2 + i, "hour")
          .toISOString(),
        soldQty: Math.min(totalQty, 30 + i * 11),
        totalQty,
      };
    });

/* ------------------------------ aggregates ------------------------------- */

export const getHome = (): Home => ({
  banners,
  flagshipBrands: brands,
  dailyDeals: getActiveDeals(8),
  rankings: getRankingsByCategory(5),
  newArrivals: getNewArrivalsByCategory(5),
});

export const getCategoryTree = (): Category[] => categories;

/* ------------------------------- discover -------------------------------- */

export const getDiscoverFeed = (
  cursor?: string,
  pageSize = 12
): DiscoverFeed => {
  // cursor is the index offset, serialized as a string.
  const start = cursor ? Number(cursor) : 0;
  const ordered = sortProducts(products, "sales");
  const slice = ordered.slice(start, start + pageSize);
  const nextStart = start + pageSize;
  return {
    items: slice,
    nextCursor: nextStart < ordered.length ? String(nextStart) : null,
  };
};

/* --------------------------------- live ---------------------------------- */

const liveCover = (seed: string) =>
  `https://picsum.photos/seed/${encodeURIComponent(seed)}/640/360`;

export const getLiveStreams = (): LiveStream[] => [
  {
    id: "live-1",
    title: "美妝保養 限時下殺 直播專場",
    host: "momo 美妝台",
    cover: liveCover("live-beauty"),
    viewers: 12830,
    isLive: true,
    products: getProductsByCategory("beauty").slice(0, 4),
  },
  {
    id: "live-2",
    title: "家電換新 破盤價開搶",
    host: "momo 家電台",
    cover: liveCover("live-appliance"),
    viewers: 8420,
    isLive: true,
    products: getProductsByCategory("appliance").slice(0, 4),
  },
  {
    id: "live-3",
    title: "親子好物 育兒必備清單",
    host: "momo 親子台",
    cover: liveCover("live-baby"),
    viewers: 3120,
    isLive: false,
    products: getProductsByCategory("baby").slice(0, 4),
  },
];
