"use client";

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { CartItem } from "@/features/cart/model/cart.types";

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

/**
 * Client-side cart state. Mirrors the future BE cart contract so we
 * can swap localStorage for server fetches once the cart API is
 * fully integrated.
 */
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem(state, action: PayloadAction<CartItem>) {
      const item = action.payload;
      const existing = state.items.find((i) => i.sku === item.sku);
      if (existing) {
        existing.quantity += item.quantity;
      } else {
        state.items.push(item);
      }
    },
    removeItem(state, action: PayloadAction<string>) {
      state.items = state.items.filter((i) => i.sku !== action.payload);
    },
    updateQuantity(
      state,
      action: PayloadAction<{ sku: string; quantity: number }>,
    ) {
      const item = state.items.find((i) => i.sku === action.payload.sku);
      if (item) {
        item.quantity = action.payload.quantity;
      }
    },
    clear(state) {
      state.items = [];
    },
  },
});

export const { addItem, removeItem, updateQuantity, clear } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;
