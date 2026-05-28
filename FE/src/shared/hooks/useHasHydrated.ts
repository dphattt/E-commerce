"use client";

import { useEffect, useState } from "react";

/**
 * Returns true once the component has hydrated on the client. Use
 * this to gate UI that depends on persisted zustand stores
 * (localStorage), so the server-rendered HTML and the first client
 * render agree on the same content and React does not log a
 * hydration mismatch.
 *
 * Typical usage:
 *
 *   const hasHydrated = useHasHydrated();
 *   const count = useCart().count;
 *   return <span>{hasHydrated ? count : 0}</span>;
 */
export function useHasHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}
