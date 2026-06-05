"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { clearSession } from "@/features/auth/model/auth.slice";

export interface WishlistState {
  slugs: string[];
}

const initialState: WishlistState = {
  slugs: [],
};

/**
 * Persisted wishlist of product slugs. Persisted per-user via
 * listenerMiddleware (see store/index.ts) using key
 * `ecommerce-wishlist-{userId}`.
 */
const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setSlugs(state, action: PayloadAction<string[]>) {
      state.slugs = action.payload;
    },
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
  extraReducers: (builder) => {
    // Clear wishlist đồng bộ khi logout
    builder.addCase(clearSession, () => initialState);
  },
});

export const { setSlugs, toggle, add, remove, clear } = wishlistSlice.actions;
export const wishlistReducer = wishlistSlice.reducer;

export function selectWishlistHas(slugs: string[], slug: string): boolean {
  return slugs.includes(slug);
}
