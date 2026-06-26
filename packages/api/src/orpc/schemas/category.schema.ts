import * as z from "zod";

export interface Category {
  id: string;
  name: string;
  level: number;
  parentId: string | null;
  children: Category[];
}

/**
 * Recursive category tree. `z.lazy` is required for the self-reference and the
 * explicit `Category` annotation keeps the inferred type stable.
 */
export const CategorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    level: z.number().int(),
    parentId: z.string().nullable(),
    children: z.array(CategorySchema),
  })
);
