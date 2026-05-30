import { describe, expect, it } from "vitest";

import {
  add,
  clear,
  remove,
  selectWishlistHas,
  toggle,
} from "@/features/wishlist/model/wishlist.slice";
import { createTestStore } from "@/test-utils/store";

function wishlistSlugs(store: ReturnType<typeof createTestStore>) {
  return store.getState().wishlist.slugs;
}

describe("wishlist slice toggle", () => {
  it("adds a slug when absent", () => {
    const store = createTestStore();
    store.dispatch(toggle("hoodie"));
    expect(wishlistSlugs(store)).toEqual(["hoodie"]);
  });

  it("removes a slug when present", () => {
    const store = createTestStore({
      wishlist: { slugs: ["hoodie"] },
      cart: { items: [] },
      auth: { user: null },
    });
    store.dispatch(toggle("hoodie"));
    expect(wishlistSlugs(store)).toEqual([]);
  });
});

describe("wishlist slice add and remove", () => {
  it("add is idempotent", () => {
    const store = createTestStore();
    store.dispatch(add("hoodie"));
    store.dispatch(add("hoodie"));
    expect(wishlistSlugs(store)).toEqual(["hoodie"]);
  });

  it("remove drops one slug", () => {
    const store = createTestStore({
      wishlist: { slugs: ["a", "b", "c"] },
      cart: { items: [] },
      auth: { user: null },
    });
    store.dispatch(remove("b"));
    expect(wishlistSlugs(store)).toEqual(["a", "c"]);
  });
});

describe("wishlist slice has and clear", () => {
  it("selectWishlistHas reflects membership", () => {
    const store = createTestStore({
      wishlist: { slugs: ["a"] },
      cart: { items: [] },
      auth: { user: null },
    });
    const slugs = wishlistSlugs(store);
    expect(selectWishlistHas(slugs, "a")).toBe(true);
    expect(selectWishlistHas(slugs, "b")).toBe(false);
  });

  it("clear empties the list", () => {
    const store = createTestStore({
      wishlist: { slugs: ["a", "b"] },
      cart: { items: [] },
      auth: { user: null },
    });
    store.dispatch(clear());
    expect(wishlistSlugs(store)).toEqual([]);
  });
});
