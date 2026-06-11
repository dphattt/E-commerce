"use client";

import { useEffect, useState } from "react";
import { buildCheckoutSlugParam } from "@/features/checkout/lib/parse-checkout-slugs";
import { fetchProductById } from "@/features/products/api/products.api";
import { productSlugFromSourceUrl } from "@/features/products/lib/product-slug";
import { cacheProduct } from "@/features/products/model/products.slice";
import type { CartItem } from "@/features/cart/model/cart.types";
import {
  productIdFromSku,
  resolveCartItemCheckoutSlug,
} from "@/features/cart/lib/checkout-slug";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

async function resolveSlugForCartItem(
  item: CartItem,
  productsBySlug: Record<string, import("@/features/products/model/product.types").Product>,
  dispatch: ReturnType<typeof useAppDispatch>,
): Promise<string | null> {
  if (item.productSlug) return item.productSlug;

  const cachedSlug = resolveCartItemCheckoutSlug(item, productsBySlug);
  if (cachedSlug) return cachedSlug;

  const productId = productIdFromSku(item.sku);
  if (!productId) return null;

  try {
    const { product } = await fetchProductById(productId);
    dispatch(cacheProduct(product));
    return productSlugFromSourceUrl(product.sourceUrl);
  } catch {
    return null;
  }
}

export function useCheckoutSlugFromCart(items: CartItem[]) {
  const dispatch = useAppDispatch();
  const productsBySlug = useAppSelector((state) => state.products.bySlug);
  const [slugsParam, setSlugsParam] = useState<string | null>(null);
  const [isResolving, setIsResolving] = useState(false);

  useEffect(() => {
    if (items.length === 0) return;

    let cancelled = false;

    void Promise.resolve().then(() => {
      if (!cancelled) setIsResolving(true);
    });

    void (async () => {
      const slugs: string[] = [];

      for (const item of items) {
        const slug = await resolveSlugForCartItem(
          item,
          productsBySlug,
          dispatch,
        );
        if (slug) slugs.push(slug);
      }

      if (cancelled) return;
      setSlugsParam(slugs.length > 0 ? buildCheckoutSlugParam(slugs) : null);
      setIsResolving(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [dispatch, items, productsBySlug]);

  return {
    slugsParam: items.length === 0 ? null : slugsParam,
    isResolving: items.length === 0 ? false : isResolving,
  };
}
