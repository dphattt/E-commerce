import { afterEach } from "vitest";

// Per-test localStorage and zustand store cleanup. Tests that import
// a persisted store reset it explicitly via store.setState in their
// own setup; this guarantees no leak across files.
afterEach(() => {
  if (typeof window !== "undefined") {
    window.localStorage.clear();
    window.sessionStorage.clear();
  }
});
