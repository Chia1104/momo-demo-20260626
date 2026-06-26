import { describe, expect, it } from "vitest";

import {
  getActiveDeals,
  getProductDetailById,
  paginate,
  products,
  searchProducts,
} from "./index";

describe("paginate", () => {
  it("slices items and reports metadata", () => {
    const items = Array.from({ length: 25 }, (_, i) => i);
    const page1 = paginate(items, 1, 10);
    expect(page1.items).toHaveLength(10);
    expect(page1.total).toBe(25);
    expect(page1.totalPages).toBe(3);
    expect(page1.hasNextPage).toBe(true);
  });

  it("clamps out-of-range pages to the last page", () => {
    const items = Array.from({ length: 5 }, (_, i) => i);
    const result = paginate(items, 99, 10);
    expect(result.page).toBe(1);
    expect(result.hasNextPage).toBe(false);
  });
});

describe("searchProducts", () => {
  it("filters by keyword across name and brand (case-insensitive)", () => {
    const result = searchProducts({ keyword: "philips" });
    expect(result.items.length).toBeGreaterThan(0);
    expect(
      result.items.every(
        (p) =>
          p.name.toLowerCase().includes("philips") ||
          (p.brand?.toLowerCase().includes("philips") ?? false)
      )
    ).toBe(true);
  });

  it("filters by category", () => {
    const result = searchProducts({ categoryId: "beauty", pageSize: 60 });
    expect(result.items.every((p) => p.categoryId === "beauty")).toBe(true);
  });

  it("sorts by price ascending", () => {
    const result = searchProducts({ sort: "price_asc", pageSize: 60 });
    const prices = result.items.map((p) => p.price);
    expect([...prices].sort((a, b) => a - b)).toEqual(prices);
  });

  it("returns an empty page for non-matching keywords", () => {
    const result = searchProducts({ keyword: "no-such-product-xyz" });
    expect(result.items).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});

describe("getProductDetailById", () => {
  it("returns detail with related ids excluding itself", () => {
    const target = products[0];
    if (!target) throw new Error("expected mock products to be non-empty");
    const detail = getProductDetailById(target.id);
    expect(detail).toBeDefined();
    expect(detail?.relatedIds).not.toContain(target.id);
    expect(detail?.images.length).toBeGreaterThan(0);
  });

  it("returns undefined for unknown ids", () => {
    expect(getProductDetailById("does-not-exist")).toBeUndefined();
  });
});

describe("getActiveDeals", () => {
  it("only includes flash-sale products discounted below list price", () => {
    const deals = getActiveDeals(8);
    expect(deals.length).toBeGreaterThan(0);
    expect(
      deals.every((d) => d.product.tags.some((t) => t.type === "FLASH_SALE"))
    ).toBe(true);
    expect(deals.every((d) => d.dealPrice < d.product.price)).toBe(true);
    expect(deals.every((d) => d.soldQty <= d.totalQty)).toBe(true);
  });
});
