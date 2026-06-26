import { oc } from "@orpc/contract";
import * as z from "zod";

import { LiveStreamSchema } from "../schemas/live.schema";

export const ListContract = oc.output(z.array(LiveStreamSchema));
