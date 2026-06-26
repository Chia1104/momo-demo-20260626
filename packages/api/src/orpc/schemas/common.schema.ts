import * as z from "zod";

/**
 * Sorting options shared by listing / search procedures.
 */
export const SortEnum = z.enum(["price_asc", "price_desc", "sales", "newest"]);
export type Sort = z.infer<typeof SortEnum>;

/**
 * Promotion tag types mirror momo's marketing labels (一日秒殺價 / 領券折 ...).
 * We keep a machine-readable `type` plus a localized `label` so the UI can
 * render the original Chinese copy while logic stays type-safe.
 */
export const PromoTagEnum = z.enum([
  "FLASH_SALE",
  "COUPON",
  "MO_COIN",
  "LOWEST",
  "BUY_ONE_GET_ONE",
  "FREE_SHIPPING",
  "NEW",
]);
export type PromoTagType = z.infer<typeof PromoTagEnum>;

export const PromoTagSchema = z.object({
  type: PromoTagEnum,
  label: z.string(),
});
export type PromoTag = z.infer<typeof PromoTagSchema>;

export const PaginationInput = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(60).default(20),
});
export type PaginationInput = z.infer<typeof PaginationInput>;

/**
 * Builds a paginated output schema for a given item schema so every list
 * endpoint exposes a consistent envelope.
 */
export const paginatedOutput = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    items: z.array(item),
    page: z.number().int(),
    pageSize: z.number().int(),
    total: z.number().int(),
    totalPages: z.number().int(),
    hasNextPage: z.boolean(),
  });

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
}
