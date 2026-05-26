"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronRightIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NavItem, NavSubItem } from "@/types/nav";

export interface MegaMenuPanelProps {
  item: NavItem;
  style?: React.CSSProperties;
  /** Called on mouseEnter — parent should cancel any scheduled close */
  onKeepOpen: () => void;
  /** Called on mouseLeave — parent should schedule close */
  onRequestClose: () => void;
  /** Called when user clicks a nav link */
  onNavigate: () => void;
}

export function MegaMenuPanel({
  item,
  style,
  onKeepOpen,
  onRequestClose,
  onNavigate,
}: MegaMenuPanelProps) {
  const [activeSub, setActiveSub] = useState<NavSubItem | null>(null);
  const subTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const openSub = (sub: NavSubItem) => {
    if (subTimeoutRef.current) clearTimeout(subTimeoutRef.current);
    setActiveSub(sub);
  };

  const scheduleSub = () => {
    subTimeoutRef.current = setTimeout(() => setActiveSub(null), 120);
  };

  const cancelSub = () => {
    if (subTimeoutRef.current) clearTimeout(subTimeoutRef.current);
  };

  const hasRightPanel = !!activeSub?.children?.length;

  return (
    <div
      className="fixed left-0 z-50 hidden lg:flex"
      style={{
        top: "var(--header-h, 64px)",
        height: "calc(100vh - var(--header-h, 64px))",
        ...style,
      }}
      onMouseEnter={onKeepOpen}
      onMouseLeave={onRequestClose}
    >
      {/* Left column — level-2 categories */}
      <div className="h-full w-[260px] overflow-y-auto bg-nav-mega-bg py-3 shadow-2xl">
        {item.subItems?.map((sub) => (
          <div
            key={sub.href}
            onMouseEnter={() => openSub(sub)}
            onMouseLeave={scheduleSub}
          >
            <Link
              href={sub.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center justify-between gap-3 px-6 py-4",
                "text-xs font-bold uppercase tracking-widest text-nav-mega-text",
                "transition-colors",
                activeSub?.href === sub.href
                  ? "text-white"
                  : "hover:text-white/60",
              )}
            >
              {sub.label}
              <ChevronRightIcon className="size-4 shrink-0 opacity-40" />
            </Link>
          </div>
        ))}
      </div>

      {/* Right column — level-3 sub-categories of the hovered level-2 item */}
      {hasRightPanel && (
        <div
          className="h-full w-[260px] overflow-y-auto border-l border-white/10 bg-nav-mega-bg py-3"
          onMouseEnter={cancelSub}
          onMouseLeave={scheduleSub}
        >
          {activeSub?.children?.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              onClick={onNavigate}
              className="flex items-center justify-between gap-3 px-6 py-4 text-xs font-bold uppercase tracking-widest text-nav-mega-text transition-colors hover:text-white/60"
            >
              {child.label}
              <ChevronRightIcon className="size-4 shrink-0 opacity-30" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
