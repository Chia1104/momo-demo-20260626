import { delay } from "@repo/utils/delay";

import * as mocks from "../mocks";
import { contractOS } from "../utils";

export const feed = contractOS.discover.feed.handler(async ({ input }) => {
  await delay(150);
  return mocks.getDiscoverFeed(input?.cursor);
});
