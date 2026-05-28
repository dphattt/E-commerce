"use client";

import { useMemo } from "react";
import { useCartStore } from "@/features/cart/model/cart.store";
import type { CartSnapshot } from "@/features/cart/model/cart.types";

/**
 * High-level cart hook used by widgets and pages. Computes the
 * derived snapshot (count, subtotal) on top of the raw store state.
 */
export function useCart(): CartSnapshot & {
  addItem: ReturnType<typeof useCartStore.getState>["addItem"];
  removeItem: ReturnType<typeof useCartStore.getState>["removeItem"];
  updateQuantity: ReturnType<typeof useCartStore.getState>["updateQuantity"];
  clear: ReturnType<typeof useCartStore.getState>["clear"];
} {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clear = useCartStore((s) => s.clear);

  const snapshot = useMemo<CartSnapshot>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const currency = items[0]?.unitPrice.currency ?? "USD";
    const amount = items.reduce(
      (sum, i) => sum + i.unitPrice.amount * i.quantity,
      0,
    );
    return {
      items,
      count,
      subtotal: { amount, currency },
    };
  }, [items]);

  return { ...snapshot, addItem, removeItem, updateQuantity, clear };
}
