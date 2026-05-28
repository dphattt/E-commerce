"use client";

import { useAuthStore } from "@/features/auth/model/auth.store";

export function useAuth() {
  const user = useAuthStore((s) => s.user);
  const setSession = useAuthStore((s) => s.setSession);
  const setUser = useAuthStore((s) => s.setUser);
  const clearSession = useAuthStore((s) => s.clearSession);

  return {
    user,
    isAuthenticated: user !== null,
    setSession,
    setUser,
    clearSession,
  };
}
