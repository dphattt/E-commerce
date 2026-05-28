import { beforeEach, describe, expect, it } from "vitest";

import { useWishlistStore } from "@/features/wishlist/model/wishlist.store";

beforeEach(() => {
  useWishlistStore.setState({ slugs: [] });
});

describe("useWishlistStore.toggle", () => {
  it("adds a slug that is not in the list", () => {
    useWishlistStore.getState().toggle("hoodie");
    expect(useWishlistStore.getState().slugs).toEqual(["hoodie"]);
  });

  it("removes a slug that is already in the list", () => {
    useWishlistStore.setState({ slugs: ["hoodie"] });
    useWishlistStore.getState().toggle("hoodie");
    expect(useWishlistStore.getState().slugs).toEqual([]);
  });
});

describe("useWishlistStore.add and .remove", () => {
  it("add is idempotent", () => {
    useWishlistStore.getState().add("hoodie");
    useWishlistStore.getState().add("hoodie");
    expect(useWishlistStore.getState().slugs).toEqual(["hoodie"]);
  });

  it("remove only drops the matching slug", () => {
    useWishlistStore.setState({ slugs: ["a", "b", "c"] });
    useWishlistStore.getState().remove("b");
    expect(useWishlistStore.getState().slugs).toEqual(["a", "c"]);
  });
});

describe("useWishlistStore.has and .clear", () => {
  it("has() reads the current state", () => {
    useWishlistStore.setState({ slugs: ["a"] });
    expect(useWishlistStore.getState().has("a")).toBe(true);
    expect(useWishlistStore.getState().has("b")).toBe(false);
  });

  it("clear() empties the list", () => {
    useWishlistStore.setState({ slugs: ["a", "b"] });
    useWishlistStore.getState().clear();
    expect(useWishlistStore.getState().slugs).toEqual([]);
  });
});
