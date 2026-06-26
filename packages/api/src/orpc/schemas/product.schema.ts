import * as z from "zod";

import { PromoTagSchema } from "./common.schema";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  brand: z.string().optional(),
  image: z.string(),
  /** Selling price in TWD. */
  price: z.number(),
  /** Original list price; absent when there is no markdown. */
  originalPrice: z.number().optional(),
  /** Percentage off (integer 1-100), derived from price/originalPrice. */
  discountRate: z.number().optional(),
  tags: z.array(PromoTagSchema).default([]),
  /** momo's "熱銷一空" state. */
  soldOut: z.boolean().default(false),
  rating: z.number().min(0).max(5).optional(),
  sales: z.number().int().default(0),
  categoryId: z.string(),
});
export type Product = z.infer<typeof ProductSchema>;

export const ProductSpecSchema = z.object({
  label: z.string(),
  value: z.string(),
});

export const ProductDetailSchema = ProductSchema.extend({
  images: z.array(z.string()),
  description: z.string(),
  specs: z.array(ProductSpecSchema),
  relatedIds: z.array(z.string()),
});
export type ProductDetail = z.infer<typeof ProductDetailSchema>;
