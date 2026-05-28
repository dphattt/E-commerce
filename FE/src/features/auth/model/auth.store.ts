"use client";

import { create } from "zustand";
import { writeAccessToken } from "@/utils/http";
import type { AuthUser } from "@/features/auth/model/auth.types";

interface AuthState {
  user: AuthUser | null;
  setSession: (user: AuthUser, accessToken: string) => void;
  setUser: (user: AuthUser | null) => void;
  clearSession: () => void;
}

/**
 * Auth store keeps the current user in memory while the access token
 * lives in localStorage (set/read through the shared http client).
 * The refresh token is an httpOnly cookie managed by the BE.
 *
 * Intentionally NOT persisted to localStorage: rehydration of the
 * user happens by calling a /users/me request after the http client
 * resolves the access token, so an expired session does not leave a
 * stale "logged in" UI.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setSession: (user, accessToken) => {
    writeAccessToken(accessToken);
    set({ user });
  },
  setUser: (user) => set({ user }),
  clearSession: () => {
    writeAccessToken(null);
    set({ user: null });
  },
}));
