import * as z from "zod";

import { ProductSchema } from "./product.schema";

/**
 * A live-shopping stream (momo 購物台) with its host, audience and the
 * products currently being featured on air.
 */
export const LiveStreamSchema = z.object({
  id: z.string(),
  title: z.string(),
  host: z.string(),
  cover: z.string(),
  viewers: z.number().int(),
  isLive: z.boolean(),
  products: z.array(ProductSchema),
});
export type LiveStream = z.infer<typeof LiveStreamSchema>;
