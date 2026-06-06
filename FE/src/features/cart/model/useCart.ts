"use client";

import { useMemo } from "react";
import {
  useGetCartQuery,
  useAddItemMutation,
  useUpdateItemMutation,
  useRemoveItemMutation,
  useClearCartMutation,
} from "@/features/cart/api/cart.api";
import type { CartItem, CartSnapshot } from "@/features/cart/model/cart.types";
import { useAuth } from "@/features/auth/model/useAuth";

export function useCart(): CartSnapshot & {
  isLoading: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  updateQuantity: (sku: string, quantity: number) => void;
  clear: () => void;
} {
  const { isAuthenticated } = useAuth();

  const { data: cart, isLoading } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [addItemMutation] = useAddItemMutation();
  const [updateItemMutation] = useUpdateItemMutation();
  const [removeItemMutation] = useRemoveItemMutation();
  const [clearCartMutation] = useClearCartMutation();

  // Khi không authenticated, luôn trả về empty — không dùng cached data
  const items = useMemo(
    () => (isAuthenticated ? (cart?.items ?? []) : []),
    [isAuthenticated, cart?.items],
  );

  const snapshot = useMemo<CartSnapshot>(() => {
    const count = items.reduce((sum, i) => sum + i.quantity, 0);
    const currency = items[0]?.unitPrice.currency ?? "USD";
    const amount = items.reduce(
      (sum, i) => sum + i.unitPrice.amount * i.quantity,
      0,
    );
    return { items, count, subtotal: { amount, currency } };
  }, [items]);

  return {
    ...snapshot,
    isLoading,
    addItem: (item: CartItem) =>
      void addItemMutation({
        sku: item.sku,
        quantity: item.quantity,
        name: item.name,
        image: item.image,
        variantLabel: item.variantLabel,
      }),
    removeItem: (sku: string) => void removeItemMutation(sku),
    updateQuantity: (sku: string, quantity: number) =>
      void updateItemMutation({ sku, quantity }),
    clear: () => void clearCartMutation(),
  };
}

