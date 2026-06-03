"use client";

import type { ReactNode } from "react";
import { ScrollToTopOnNavigate } from "@/components/layout";
import { ThemeProvider } from "@/components/theme";
import { StoreProvider } from "@/store/StoreProvider";

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <StoreProvider>
      <ThemeProvider>
        <ScrollToTopOnNavigate />
        {children}
      </ThemeProvider>
    </StoreProvider>
  );
}
