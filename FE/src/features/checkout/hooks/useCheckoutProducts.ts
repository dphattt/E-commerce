"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchProductBySlug } from "@/features/products/api/products.api";
import { useProductCache } from "@/features/products";
import type { Product } from "@/features/products/model/product.types";
import { parseCheckoutSlugs } from "@/features/checkout/lib/parse-checkout-slugs";
import { store } from "@/store";

export function useCheckoutProducts(slugParam?: string) {
  const slugs = useMemo(() => parseCheckoutSlugs(slugParam), [slugParam]);
  const hasSlugs = slugs.length > 0;
  const { cacheProduct } = useProductCache();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(hasSlugs);
  const [failedSlugs, setFailedSlugs] = useState<string[]>([]);

  useEffect(() => {
    if (!hasSlugs) return;

    let cancelled = false;

    void Promise.resolve().then(() => {
      if (cancelled) return;
      setLoading(true);
      setFailedSlugs([]);
    });

    void (async () => {
      const loaded: Product[] = [];
      const missing: string[] = [];
      const cachedBySlug = store.getState().products.bySlug;

      for (const slug of slugs) {
        const cached = cachedBySlug[slug];
        if (cached) {
          loaded.push(cached);
          continue;
        }

        try {
          const { product } = await fetchProductBySlug(slug);
          cacheProduct(product);
          loaded.push(product);
        } catch {
          missing.push(slug);
        }
      }

      if (cancelled) return;
      setProducts(loaded);
      setFailedSlugs(missing);
      setLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [hasSlugs, slugs, cacheProduct]);

  return {
    slugs,
    products: hasSlugs ? products : [],
    loading: hasSlugs ? loading : false,
    failedSlugs: hasSlugs ? failedSlugs : [],
    isReady:
      hasSlugs && !loading && products.length === slugs.length,
  };
}
