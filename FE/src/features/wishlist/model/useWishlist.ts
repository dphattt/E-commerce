"use client";

import { useWishlistStore } from "@/features/wishlist/model/wishlist.store";

export function useWishlist() {
  const slugs = useWishlistStore((s) => s.slugs);
  const toggle = useWishlistStore((s) => s.toggle);
  const add = useWishlistStore((s) => s.add);
  const remove = useWishlistStore((s) => s.remove);
  const clear = useWishlistStore((s) => s.clear);

  return {
    slugs,
    count: slugs.length,
    isWishlisted: (slug: string) => slugs.includes(slug),
    toggle,
    add,
    remove,
    clear,
  };
}
