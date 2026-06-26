import { ORPCError } from "@orpc/server";

import { delay } from "@repo/utils/delay";

import * as mocks from "../mocks";
import { contractOS } from "../utils";

/** Simulated network latency so the UI exercises real loading states. */
const LATENCY_MS = 150;

export const home = contractOS.catalog.home.handler(async () => {
  await delay(LATENCY_MS);
  return mocks.getHome();
});

export const search = contractOS.catalog.search.handler(async ({ input }) => {
  await delay(LATENCY_MS);
  return mocks.searchProducts(input);
});

export const getProduct = contractOS.catalog.getProduct.handler(
  async ({ input }) => {
    await delay(LATENCY_MS);
    const product = mocks.getProductDetailById(input.id);
    if (!product) {
      throw new ORPCError("NOT_FOUND", {
        message: `Product "${input.id}" not found`,
      });
    }
    return product;
  }
);
