import { oc } from "@orpc/contract";
import * as z from "zod";

import {
  PaginationInput,
  SortEnum,
  paginatedOutput,
} from "../schemas/common.schema";
import { HomeSchema } from "../schemas/home.schema";
import { ProductDetailSchema, ProductSchema } from "../schemas/product.schema";

export const HomeContract = oc.output(HomeSchema);

export const SearchContract = oc
  .input(
    PaginationInput.extend({
      keyword: z.string().optional(),
      categoryId: z.string().optional(),
      sort: SortEnum.optional(),
    })
  )
  .output(paginatedOutput(ProductSchema));

export const GetProductContract = oc
  .input(z.object({ id: z.string() }))
  .output(ProductDetailSchema);
