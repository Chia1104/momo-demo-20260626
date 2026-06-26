import { oc } from "@orpc/contract";
import * as z from "zod";

import { DiscoverFeedSchema } from "../schemas/discover.schema";

export const FeedContract = oc
  .input(z.object({ cursor: z.string().optional() }).optional())
  .output(DiscoverFeedSchema);
