import { beforeEach, describe, expect, it } from "vitest";
import { act, renderHook } from "@testing-library/react";

import { useCart } from "@/features/cart/model/useCart";
import { TestStoreProvider } from "@/test-utils/store";

function wrapper({ children }: { children: React.ReactNode }) {
  return (
    <TestStoreProvider
      preloadedState={{
        cart: { items: [] },
        wishlist: { slugs: [] },
        auth: { user: null },
      }}
    >
      {children}
    </TestStoreProvider>
  );
}

beforeEach(() => {
  // Provider creates a fresh store per renderHook call when using inline wrapper
});

describe("useCart", () => {
  it("derives count and subtotal from the store", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addItem({
        sku: "A1",
        name: "Tee",
        image: "/i.jpg",
        quantity: 2,
        unitPrice: { amount: 22, currency: "USD" },
      });
      result.current.addItem({
        sku: "B1",
        name: "Pants",
        image: "/p.jpg",
        quantity: 1,
        unitPrice: { amount: 65, currency: "USD" },
      });
    });

    expect(result.current.count).toBe(3);
    expect(result.current.subtotal.amount).toBe(2 * 22 + 1 * 65);
    expect(result.current.subtotal.currency).toBe("USD");
    expect(result.current.items).toHaveLength(2);
  });

  it("falls back to USD with zero amount for an empty cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    expect(result.current.count).toBe(0);
    expect(result.current.subtotal).toEqual({ amount: 0, currency: "USD" });
  });

  it("updateQuantity recomputes the snapshot", () => {
    const { result } = renderHook(() => useCart(), { wrapper });
    act(() => {
      result.current.addItem({
        sku: "A1",
        name: "Tee",
        image: "/i.jpg",
        quantity: 1,
        unitPrice: { amount: 22, currency: "USD" },
      });
    });
    expect(result.current.count).toBe(1);

    act(() => {
      result.current.updateQuantity("A1", 5);
    });
    expect(result.current.count).toBe(5);
    expect(result.current.subtotal.amount).toBe(110);
  });
});
