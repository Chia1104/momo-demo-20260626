import { oc } from "@orpc/contract";
import * as z from "zod";

import { DealSchema } from "../schemas/deal.schema";

export const ListContract = oc
  .input(
    z.object({ limit: z.number().int().min(1).max(20).default(8) }).optional()
  )
  .output(z.array(DealSchema));
