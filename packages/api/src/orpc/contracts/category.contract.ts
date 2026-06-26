import { oc } from "@orpc/contract";
import * as z from "zod";

import { CategorySchema } from "../schemas/category.schema";

export const ListContract = oc.output(z.array(CategorySchema));
