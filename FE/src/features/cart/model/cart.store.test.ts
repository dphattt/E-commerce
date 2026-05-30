import { beforeEach, describe, expect, it } from "vitest";

import {
  addItem,
  cartReducer,
  clear,
  removeItem,
  updateQuantity,
} from "@/features/cart/model/cart.slice";
import type { CartItem } from "@/features/cart/model/cart.types";
import { createTestStore } from "@/test-utils/store";

function makeItem(overrides: Partial<CartItem> = {}): CartItem {
  return {
    sku: "A1",
    name: "Test product",
    image: "/image.jpg",
    quantity: 1,
    unitPrice: { amount: 22, currency: "USD" },
    ...overrides,
  };
}

function cartItems(store: ReturnType<typeof createTestStore>) {
  return store.getState().cart.items;
}

beforeEach(() => {
  // fresh store per test via inline createTestStore calls
});

describe("cart slice addItem", () => {
  it("appends a new SKU", () => {
    const store = createTestStore();
    store.dispatch(addItem(makeItem({ sku: "A1" })));
    expect(cartItems(store)).toHaveLength(1);
    expect(cartItems(store)[0].sku).toBe("A1");
  });

  it("merges quantity when the SKU already exists", () => {
    const store = createTestStore();
    store.dispatch(addItem(makeItem({ sku: "A1", quantity: 1 })));
    store.dispatch(addItem(makeItem({ sku: "A1", quantity: 3 })));
    const items = cartItems(store);
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(4);
  });
});

describe("cart slice removeItem", () => {
  it("drops the matching SKU", () => {
    const store = createTestStore();
    store.dispatch(addItem(makeItem({ sku: "A1" })));
    store.dispatch(addItem(makeItem({ sku: "B1" })));
    store.dispatch(removeItem("A1"));
    expect(cartItems(store).map((i) => i.sku)).toEqual(["B1"]);
  });

  it("is a no-op for unknown SKUs", () => {
    const store = createTestStore();
    store.dispatch(addItem(makeItem({ sku: "A1" })));
    store.dispatch(removeItem("nope"));
    expect(cartItems(store)).toHaveLength(1);
  });
});

describe("cart slice updateQuantity", () => {
  it("replaces the quantity for the SKU", () => {
    const store = createTestStore();
    store.dispatch(addItem(makeItem({ sku: "A1", quantity: 1 })));
    store.dispatch(updateQuantity({ sku: "A1", quantity: 9 }));
    expect(cartItems(store)[0].quantity).toBe(9);
  });
});

describe("cart slice clear", () => {
  it("empties the cart", () => {
    const store = createTestStore();
    store.dispatch(addItem(makeItem({ sku: "A1" })));
    store.dispatch(addItem(makeItem({ sku: "B1" })));
    store.dispatch(clear());
    expect(cartItems(store)).toEqual([]);
  });
});

describe("cartReducer", () => {
  it("exports a reducer for the root store", () => {
    expect(typeof cartReducer).toBe("function");
  });
});
