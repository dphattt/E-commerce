"use client";

import { useCallback } from "react";
import {
  add as addAction,
  clear as clearAction,
  remove as removeAction,
  toggle as toggleAction,
} from "@/features/wishlist/model/wishlist.slice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useAuth } from "@/features/auth/model/useAuth";

export function useWishlist() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAuth();
  const rawSlugs = useAppSelector((s) => s.wishlist.slugs);

  // Khi không authenticated, luôn trả về empty — không show wishlist của user cũ
  const slugs = isAuthenticated ? rawSlugs : [];

  const toggle = useCallback(
    (slug: string) => dispatch(toggleAction(slug)),
    [dispatch],
  );
  const add = useCallback(
    (slug: string) => dispatch(addAction(slug)),
    [dispatch],
  );
  const remove = useCallback(
    (slug: string) => dispatch(removeAction(slug)),
    [dispatch],
  );
  const clear = useCallback(() => dispatch(clearAction()), [dispatch]);

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
