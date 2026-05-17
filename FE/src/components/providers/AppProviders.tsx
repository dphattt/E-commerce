"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/theme";

export function AppProviders({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
