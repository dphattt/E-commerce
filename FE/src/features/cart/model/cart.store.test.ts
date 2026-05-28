import { beforeEach, describe, expect, it } from "vitest";

import { useCartStore } from "@/features/cart/model/cart.store";
import type { CartItem } from "@/features/cart/model/cart.types";

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

beforeEach(() => {
  useCartStore.setState({ items: [] });
});

describe("useCartStore.addItem", () => {
  it("appends a new SKU", () => {
    useCartStore.getState().addItem(makeItem({ sku: "A1" }));
    expect(useCartStore.getState().items).toHaveLength(1);
    expect(useCartStore.getState().items[0].sku).toBe("A1");
  });

  it("merges quantity when the SKU already exists", () => {
    useCartStore.getState().addItem(makeItem({ sku: "A1", quantity: 1 }));
    useCartStore.getState().addItem(makeItem({ sku: "A1", quantity: 3 }));
    const { items } = useCartStore.getState();
    expect(items).toHaveLength(1);
    expect(items[0].quantity).toBe(4);
  });
});

describe("useCartStore.removeItem", () => {
  it("drops the matching SKU", () => {
    useCartStore.getState().addItem(makeItem({ sku: "A1" }));
    useCartStore.getState().addItem(makeItem({ sku: "B1" }));
    useCartStore.getState().removeItem("A1");
    expect(useCartStore.getState().items.map((i) => i.sku)).toEqual(["B1"]);
  });

  it("is a no-op for unknown SKUs", () => {
    useCartStore.getState().addItem(makeItem({ sku: "A1" }));
    useCartStore.getState().removeItem("nope");
    expect(useCartStore.getState().items).toHaveLength(1);
  });
});

describe("useCartStore.updateQuantity", () => {
  it("replaces the quantity for the SKU", () => {
    useCartStore.getState().addItem(makeItem({ sku: "A1", quantity: 1 }));
    useCartStore.getState().updateQuantity("A1", 9);
    expect(useCartStore.getState().items[0].quantity).toBe(9);
  });
});

describe("useCartStore.clear", () => {
  it("empties the cart", () => {
    useCartStore.getState().addItem(makeItem({ sku: "A1" }));
    useCartStore.getState().addItem(makeItem({ sku: "B1" }));
    useCartStore.getState().clear();
    expect(useCartStore.getState().items).toEqual([]);
  });
});
