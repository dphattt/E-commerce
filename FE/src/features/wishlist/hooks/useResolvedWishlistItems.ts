"use client";

import { useMemo } from "react";
import { productSlugFromSourceUrl } from "@/features/products/lib/product-slug";
import type { Product } from "@/features/products/model/product.types";
import { useWishlist } from "@/features/wishlist/model/useWishlist";
import { useAppSelector } from "@/store/hooks";

export interface ResolvedWishlistItem {
  key: string;
  slug: string;
  product: Product | null;
}

export function useResolvedWishlistItems(): ResolvedWishlistItem[] {
  const { slugs } = useWishlist();
  const bySlug = useAppSelector((s) => s.products.bySlug);

  return useMemo(() => {
    return slugs.map((key) => {
      let product = bySlug[key] ?? null;
      let slug = key;

      if (!product) {
        const found = Object.values(bySlug).find((p) => p._id === key);
        if (found) {
          product = found;
          slug = productSlugFromSourceUrl(found.sourceUrl);
        }
      }

      return { key, slug, product };
    });
  }, [slugs, bySlug]);
}
