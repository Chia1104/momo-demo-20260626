import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { Product, ProductDetail } from "@/lib/api-types";

export interface CartItem {
  id: string;
  name: string;
  image: string;
  price: number;
  brand?: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  add: (product: Product | ProductDetail, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product, qty = 1) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === product.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === product.id ? { ...i, qty: i.qty + qty } : i
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                id: product.id,
                name: product.name,
                image: product.image,
                price: product.price,
                brand: product.brand,
                qty,
              },
            ],
          };
        }),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      setQty: (id, qty) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === id ? { ...i, qty: Math.max(1, qty) } : i
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "momo-cart" }
  )
);

export const selectCartCount = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.qty, 0);

export const selectCartTotal = (state: CartState) =>
  state.items.reduce((sum, i) => sum + i.qty * i.price, 0);
