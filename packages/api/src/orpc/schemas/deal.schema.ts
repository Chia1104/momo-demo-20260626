import * as z from "zod";

import { ProductSchema } from "./product.schema";

/**
 * A time-limited flash deal (限時秒殺) wrapping a product with its sale price,
 * expiry and live stock progress.
 */
export const DealSchema = z.object({
  id: z.string(),
  product: ProductSchema,
  dealPrice: z.number(),
  /** ISO8601 string of when the deal ends. */
  endsAt: z.string(),
  soldQty: z.number().int(),
  totalQty: z.number().int(),
});
export type Deal = z.infer<typeof DealSchema>;
