"use client";

import { useEffect, useMemo, useState } from "react";
import { fetchProductBySlug } from "@/features/products/api/products.api";
import { useProductCache } from "@/features/products";
import type { Product } from "@/features/products/model/product.types";
import { parseCheckoutSlugs } from "@/features/checkout/lib/parse-checkout-slugs";
import { store } from "@/store";

export function useCheckoutProducts(slugParam?: string) {
  const slugs = useMemo(() => parseCheckoutSlugs(slugParam), [slugParam]);
  const { cacheProduct } = useProductCache();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(Boolean(slugParam));
  const [failedSlugs, setFailedSlugs] = useState<string[]>([]);

  // Dependency array cố định 2 phần tử — tránh React báo lỗi đổi size giữa các lần render.
  useEffect(() => {
    const parsedSlugs = parseCheckoutSlugs(slugParam);

    if (parsedSlugs.length === 0) {
      setProducts([]);
      setFailedSlugs([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setFailedSlugs([]);

    void (async () => {
      const loaded: Product[] = [];
      const missing: string[] = [];
      const cachedBySlug = store.getState().products.bySlug;

      for (const slug of parsedSlugs) {
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
  }, [slugParam, cacheProduct]);

  return {
    slugs,
    products,
    loading,
    failedSlugs,
    isReady:
      !loading && slugs.length > 0 && products.length === slugs.length,
  };
}
