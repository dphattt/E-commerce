"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

type PageShellProps = {
  children: ReactNode;
};

export function PageShell({ children }: PageShellProps) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  return (
    <div
      suppressHydrationWarning={true}
      className={
        isHomePage
          ? "flex w-full flex-1 flex-col py-9"
          : "mx-auto flex w-full max-w-[1600px] flex-1 flex-col px-4 py-9 sm:px-6 lg:px-8"
      }
    >
      {children}
    </div>
  );
}
