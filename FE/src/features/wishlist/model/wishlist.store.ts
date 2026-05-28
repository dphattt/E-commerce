"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  slugs: string[];
  toggle: (slug: string) => void;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  clear: () => void;
  has: (slug: string) => boolean;
}

/**
 * Persisted wishlist of product slugs. Single source of truth for
 * heart toggles on product cards and the dedicated wishlist page.
 */
export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      slugs: [],
      toggle: (slug) =>
        set((state) => ({
          slugs: state.slugs.includes(slug)
            ? state.slugs.filter((s) => s !== slug)
            : [...state.slugs, slug],
        })),
      add: (slug) =>
        set((state) =>
          state.slugs.includes(slug)
            ? state
            : { slugs: [...state.slugs, slug] },
        ),
      remove: (slug) =>
        set((state) => ({ slugs: state.slugs.filter((s) => s !== slug) })),
      clear: () => set({ slugs: [] }),
      has: (slug) => get().slugs.includes(slug),
    }),
    {
      name: "ecommerce-wishlist",
      version: 1,
    },
  ),
);
