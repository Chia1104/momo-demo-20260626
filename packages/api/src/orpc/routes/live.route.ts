import { delay } from "@repo/utils/delay";

import * as mocks from "../mocks";
import { contractOS } from "../utils";

export const list = contractOS.live.list.handler(async () => {
  await delay(120);
  return mocks.getLiveStreams();
});
