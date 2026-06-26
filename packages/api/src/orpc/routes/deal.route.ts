import { delay } from "@repo/utils/delay";

import * as mocks from "../mocks";
import { contractOS } from "../utils";

export const list = contractOS.deal.list.handler(async ({ input }) => {
  await delay(120);
  return mocks.getActiveDeals(input?.limit ?? 8);
});
