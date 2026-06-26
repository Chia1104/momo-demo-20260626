import { delay } from "@repo/utils/delay";

import * as mocks from "../mocks";
import { contractOS } from "../utils";

export const list = contractOS.category.list.handler(async () => {
  await delay(80);
  return mocks.getCategoryTree();
});
