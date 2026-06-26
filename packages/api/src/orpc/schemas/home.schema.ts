import * as z from "zod";

import { DealSchema } from "./deal.schema";
import { ProductSchema } from "./product.schema";

export const BannerSchema = z.object({
  id: z.string(),
  title: z.string(),
  image: z.string(),
  link: z.string(),
  type: z.enum(["brand", "edm", "event"]),
});
export type Banner = z.infer<typeof BannerSchema>;

export const BrandSchema = z.object({
  id: z.string(),
  name: z.string(),
  logo: z.string(),
});
export type Brand = z.infer<typeof BrandSchema>;

/**
 * A category-scoped grouping of products, reused by both the homepage ranking
 * (熱銷精選) and new-arrival (品牌新品) sections.
 */
export const ProductGroupSchema = z.object({
  categoryId: z.string(),
  title: z.string(),
  items: z.array(ProductSchema),
});
export type ProductGroup = z.infer<typeof ProductGroupSchema>;

export const HomeSchema = z.object({
  banners: z.array(BannerSchema),
  flagshipBrands: z.array(BrandSchema),
  dailyDeals: z.array(DealSchema),
  rankings: z.array(ProductGroupSchema),
  newArrivals: z.array(ProductGroupSchema),
});
export type Home = z.infer<typeof HomeSchema>;
