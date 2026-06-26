import * as z from "zod";

import { ProductSchema } from "./product.schema";

/**
 * Cursor-paginated discovery feed (逛逛 / 策展) returning a flat product stream.
 */
export const DiscoverFeedSchema = z.object({
  items: z.array(ProductSchema),
  nextCursor: z.string().nullable(),
});
export type DiscoverFeed = z.infer<typeof DiscoverFeedSchema>;
