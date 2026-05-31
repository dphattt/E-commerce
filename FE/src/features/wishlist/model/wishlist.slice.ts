"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface WishlistState {
  slugs: string[];
}

const initialState: WishlistState = {
  slugs: [],
};

/**
 * Persisted wishlist of product slugs. Single source of truth for
 * heart toggles on product cards and the dedicated wishlist page.
 */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    toggle(state, action: PayloadAction<string>) {
      const slug = action.payload;
      if (state.slugs.includes(slug)) {
        state.slugs = state.slugs.filter((s) => s !== slug);
      } else {
        state.slugs.push(slug);
      }
    },
    add(state, action: PayloadAction<string>) {
      const slug = action.payload;
      if (!state.slugs.includes(slug)) {
        state.slugs.push(slug);
      }
    },
    remove(state, action: PayloadAction<string>) {
      state.slugs = state.slugs.filter((s) => s !== action.payload);
    },
    clear(state) {
      state.slugs = [];
    },
  },
});

export const { toggle, add, remove, clear } = wishlistSlice.actions;
export const wishlistReducer = wishlistSlice.reducer;

export function selectWishlistHas(slugs: string[], slug: string): boolean {
  return slugs.includes(slug);
}
