"use client";

import { useCallback, useMemo } from "react";
import {
  addItem as addItemAction,
  clear as clearAction,
  removeItem as removeItemAction,
  updateQuantity as updateQuantityAction,
} from "@/features/cart/model/cart.slice";
import type { CartItem, CartSnapshot } from "@/features/cart/model/cart.types";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

/**
 * High-level cart hook used by widgets and pages. Computes the
 * derived snapshot (count, subtotal) on top of the raw store state.
 */
export function useCart(): CartSnapshot & {
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clear: () => void;
} {
  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);

  const addItem = useCallback(
    (item: CartItem) => dispatch(addItemAction(item)),
    [dispatch],
  );
  const removeItem = useCallback(
    (sku: string) => dispatch(removeItemAction(sku)),
    [dispatch],
  );
  const updateQuantity = useCallback(
    (sku: string, quantity: number) =>
      dispatch(updateQuantityAction({ sku, quantity })),
    [dispatch],
  );
  const clear = useCallback(() => dispatch(clearAction()), [dispatch]);

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
