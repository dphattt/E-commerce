"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { MegaMenuPanel } from "./MegaMenuPanel";
import {
  IconClose,
  IconHeart,
  IconMenu,
  IconPause,
  IconPlay,
  IconSearch,
  IconUser,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { iconBlockClassName, iconGlyphClassName } from "@/lib/icon-block";
import { CartDrawer } from "./CartDrawer";
import type { NavItem, NavSubItem } from "@/types/nav";

// Re-export for backward compat if used elsewhere
export type SiteHeaderNavSubItem = NavSubItem;
export type SiteHeaderNavItem = NavItem;

export type SiteHeaderProps = {
  brandName?: string;
  logoHref?: string;
  logo?: React.ReactNode;
  navItems?: SiteHeaderNavItem[];
  activeHref?: string;
  announcement?: string;
  announcements?: string[];
  searchPlaceholder?: string;
  cartCount?: number;
  className?: string;
  onSearchSubmit?: (query: string) => void;
};

const defaultNav: SiteHeaderNavItem[] = [
  {
    label: "Women",
    href: "/women",
    subItems: [
      {
        label: "Trending",
        href: "/women/trending",
        children: [
          { label: "New Product Drops", href: "/women/trending/new-drops" },
          { label: "Best Sellers", href: "/women/trending/best-sellers" },
          { label: "Form | Now Live", href: "/women/trending/form-now-live" },
          { label: "Everyday Seamless", href: "/women/trending/everyday-seamless" },
          { label: "Spring Looks", href: "/women/trending/spring-looks" },
          { label: "Pilates", href: "/women/trending/pilates" },
        ],
      },
      {
        label: "Leggings",
        href: "/women/leggings",
        children: [
          { label: "All Leggings", href: "/women/leggings/all" },
          { label: "Full Length", href: "/women/leggings/full-length" },
          { label: "High Waisted", href: "/women/leggings/high-waisted" },
          { label: "Seamless Leggings", href: "/women/leggings/seamless" },
        ],
      },
      {
        label: "Products",
        href: "/women/products",
        children: [
          { label: "All Products", href: "/women/products/all" },
          { label: "Sports Bras", href: "/women/products/sports-bras" },
          { label: "Shorts", href: "/women/products/shorts" },
          { label: "Pullovers", href: "/women/products/pullovers" },
          { label: "SS Tops", href: "/women/products/ss-tops" },
        ],
      },
      {
        label: "Accessories",
        href: "/women/accessories",
        children: [
          { label: "All Accessories", href: "/women/accessories/all" },
          { label: "Socks", href: "/women/accessories/socks" },
          { label: "Headwear", href: "/women/accessories/headwear" },
          { label: "Bags", href: "/women/accessories/bags" },
        ],
      },
      { label: "Last Chance", href: "/women/last-chance" },
      { label: "Explore", href: "/women/explore" },
    ],
  },
  {
    label: "Men",
    href: "/men",
    subItems: [
      {
        label: "Trending",
        href: "/men/trending",
        children: [
          { label: "New Product Drops", href: "/men/trending/new-drops" },
          { label: "Best Sellers", href: "/men/trending/best-sellers" },
          { label: "Shorts", href: "/men/trending/shorts" },
          { label: "Running", href: "/men/trending/running" },
        ],
      },
      {
        label: "T-Shirts & Tops",
        href: "/men/tops",
        children: [
          { label: "T-Shirts & Tops", href: "/men/tops/all" },
          { label: "Tank Tops", href: "/men/tops/tanks" },
          { label: "Oversized T-Shirts", href: "/men/tops/oversized" },
          { label: "Long Sleeve Tops", href: "/men/tops/long-sleeve" },
        ],
      },
      {
        label: "Products",
        href: "/men/products",
        children: [
          { label: "All Products", href: "/men/products/all" },
          { label: "Shorts", href: "/men/products/shorts" },
          { label: "Joggers", href: "/men/products/joggers" },
          { label: "Pullovers", href: "/men/products/pullovers" },
        ],
      },
      {
        label: "Accessories",
        href: "/men/accessories",
        children: [
          { label: "All Accessories", href: "/men/accessories/all" },
          { label: "Bags", href: "/men/accessories/bags" },
          { label: "Socks", href: "/men/accessories/socks" },
        ],
      },
      { label: "Last Chance", href: "/men/last-chance" },
      { label: "Explore", href: "/men/explore" },
    ],
  },
  {
    label: "Accessories",
    href: "/accessories",
    subItems: [
      {
        label: "Trending",
        href: "/accessories/trending",
        children: [
          { label: "New Product Drops", href: "/accessories/trending/new-drops" },
          { label: "Best Sellers", href: "/accessories/trending/best-sellers" },
          { label: "Seasonal Accessories", href: "/accessories/trending/seasonal" },
        ],
      },
      {
        label: "Bags",
        href: "/accessories/bags",
        children: [
          { label: "All Bags", href: "/accessories/bags/all" },
          { label: "Backpacks", href: "/accessories/bags/backpacks" },
          { label: "Holdalls", href: "/accessories/bags/holdalls" },
        ],
      },
      { label: "Equipment", href: "/accessories/equipment" },
      {
        label: "Socks",
        href: "/accessories/socks",
        children: [
          { label: "All Socks", href: "/accessories/socks/all" },
          { label: "Crew Socks", href: "/accessories/socks/crew" },
          { label: "Ankle Socks", href: "/accessories/socks/ankle" },
        ],
      },
      {
        label: "Headwear",
        href: "/accessories/headwear",
        children: [
          { label: "All Headwear", href: "/accessories/headwear/all" },
          { label: "Caps", href: "/accessories/headwear/caps" },
          { label: "Headbands", href: "/accessories/headwear/headbands" },
        ],
      },
      { label: "Last Chance", href: "/accessories/last-chance" },
    ],
  },
  {
    label: "Explore",
    href: "/explore",
    subItems: [
      {
        label: "Women's Guides",
        href: "/explore/womens-guides",
        children: [
          { label: "Leggings Guide", href: "/explore/womens-guides/leggings" },
          { label: "Sports Bra Guide", href: "/explore/womens-guides/sports-bras" },
          { label: "Running Guide", href: "/explore/womens-guides/running" },
        ],
      },
      {
        label: "Men's Guides",
        href: "/explore/mens-guides",
        children: [
          { label: "Shorts Guide", href: "/explore/mens-guides/shorts" },
          { label: "Running Guide", href: "/explore/mens-guides/running" },
        ],
      },
      { label: "Women's Clothing", href: "/explore/womens-clothing" },
      { label: "Men's Clothing", href: "/explore/mens-clothing" },
      { label: "Find Out More", href: "/explore/about" },
    ],
  },
];

export function SiteHeader({
  brandName = "GYMSHARK",
  logoHref = "/",
  logo,
  navItems = defaultNav,
  activeHref,
  announcement = "Get $10 off when you refer a friend",
  announcements,
  searchPlaceholder = "What are you looking for tod…",
  cartCount = 1,
  className = "",
  onSearchSubmit,
}: SiteHeaderProps) {
  const menuId = useId();
  const headerRef = useRef<HTMLElement>(null);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeNav, setActiveNav] = useState<SiteHeaderNavItem | null>(null);
  const lines = announcements?.length ? announcements : [announcement];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  /* ── update --header-h so the fixed panel can sit right below the header ── */
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new ResizeObserver(() => {
      document.documentElement.style.setProperty(
        "--header-h",
        `${el.offsetHeight}px`,
      );
    });
    obs.observe(el);
    document.documentElement.style.setProperty(
      "--header-h",
      `${el.offsetHeight}px`,
    );
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (lines.length <= 1 || paused) return;
    const t = window.setInterval(() => {
      setIndex((i) => (i + 1) % lines.length);
    }, 5000);
    return () => window.clearInterval(t);
  }, [lines.length, paused]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!activeNav) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setActiveNav(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [activeNav]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const openDropdown = (item: SiteHeaderNavItem) => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
    setActiveNav(item);
  };

  const scheduleClose = () => {
    closeTimeoutRef.current = setTimeout(() => setActiveNav(null), 150);
  };

  const cancelClose = () => {
    if (closeTimeoutRef.current) clearTimeout(closeTimeoutRef.current);
  };

  const submitSearch = useCallback(() => {
    const q = query.trim();
    if (q) onSearchSubmit?.(q);
    setSearchOpen(false);
  }, [onSearchSubmit, query]);

  const line = lines[index] ?? announcement;

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "sticky top-0 z-40 w-full bg-store-paper text-store-ink-strong",
          className,
        )}
      >
        {/* Announcement */}
        <div className="border-b border-store-border/80 bg-store-surface">
          <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
            <div className="min-w-0 flex-1 overflow-x-auto text-center">
              <p className="inline-block min-w-0 whitespace-nowrap text-xs sm:text-sm">
                <Link
                  href="/refer"
                  className="underline underline-offset-2 hover:no-underline"
                >
                  {line}
                </Link>
              </p>
            </div>
            {lines.length > 1 && (
              <button
                type="button"
                className="shrink-0 p-1 text-store-fg-muted hover:text-store-ink-strong"
                onClick={() => setPaused((p) => !p)}
                aria-label={
                  paused ? "Play announcements" : "Pause announcements"
                }
              >
                {paused ? (
                  <IconPlay className="size-4" />
                ) : (
                  <IconPause className="size-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Main bar */}
        <div className="border-b border-store-border/80">
          <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6 lg:px-8">
            {/* Left: hamburger (mobile) + desktop nav */}
            <div className="flex min-w-0 items-center gap-2 lg:min-w-[200px]">
              <button
                type="button"
                className={cn(
                  iconBlockClassName,
                  "rounded-md hover:bg-store-surface lg:hidden",
                )}
                aria-expanded={menuOpen}
                aria-controls={menuId}
                onClick={() => setMenuOpen(true)}
                aria-label="Open menu"
              >
                <IconMenu className={iconGlyphClassName} />
              </button>

              {/* Desktop nav */}
              <nav
                className="hidden min-w-0 lg:flex lg:items-center lg:gap-6"
                aria-label="Main"
              >
                {navItems.map((item) =>
                  item.subItems?.length ? (
                    <div
                      key={item.href}
                      onMouseEnter={() => openDropdown(item)}
                      onMouseLeave={scheduleClose}
                    >
                      <button
                        type="button"
                        aria-haspopup="true"
                        aria-expanded={activeNav?.href === item.href}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            if (activeNav?.href === item.href) {
                              setActiveNav(null);
                            } else {
                              setActiveNav(item);
                            }
                          }
                        }}
                        className={cn(
                          "relative shrink-0 text-sm font-medium tracking-wide text-store-ink-strong",
                          "cursor-pointer bg-transparent",
                          "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full",
                          "after:bg-store-ink-strong after:transition-opacity",
                          activeNav?.href === item.href
                            ? "after:opacity-100"
                            : "after:opacity-0 hover:after:opacity-100",
                        )}
                      >
                        {item.label}
                      </button>
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "relative shrink-0 text-sm font-medium tracking-wide text-store-ink-strong",
                        "after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-full",
                        "after:bg-store-ink-strong after:opacity-0 after:transition-opacity",
                        "hover:after:opacity-100",
                      )}
                    >
                      {item.label}
                    </Link>
                  ),
                )}
              </nav>
            </div>

            {/* Logo */}
            <div className="flex min-w-0 flex-1 justify-center lg:flex-none">
              <Link
                href={logoHref}
                className="font-sans text-xl font-black uppercase leading-none tracking-[-0.04em] sm:text-2xl"
                style={{ fontStretch: "condensed" }}
              >
                {logo ?? brandName}
              </Link>
            </div>

            {/* Right: search + icons */}
            <div className="flex shrink-0 items-center justify-end gap-1 sm:gap-2 lg:min-w-0 lg:justify-end lg:gap-3">
              <div className="hidden min-w-0 max-w-md flex-1 lg:block lg:max-w-[320px] lg:flex-none xl:max-w-[380px]">
                <form
                  className="relative"
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitSearch();
                  }}
                >
                  <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-store-fg-muted" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-10 w-full rounded-full border border-transparent bg-store-surface py-2 pl-10 pr-4 text-sm text-store-ink outline-none ring-store-ink/5 placeholder:text-store-fg-muted focus:border-store-border-strong focus:bg-store-paper focus:ring-2"
                    aria-label="Search"
                  />
                </form>
              </div>

              <button
                type="button"
                className={cn(
                  iconBlockClassName,
                  "rounded-full hover:bg-store-surface lg:hidden",
                )}
                aria-label="Open search"
                onClick={() => setSearchOpen(true)}
              >
                <IconSearch
                  className={cn(iconGlyphClassName, "text-store-ink")}
                />
              </button>

              <Link
                href="/wishlist"
                className={cn(
                  iconBlockClassName,
                  "rounded-full hover:bg-store-surface",
                )}
                aria-label="Wishlist"
              >
                <IconHeart className={iconGlyphClassName} />
              </Link>
              <Link
                href="/account"
                className={cn(
                  iconBlockClassName,
                  "rounded-full hover:bg-store-surface",
                )}
                aria-label="Account"
              >
                <IconUser className={iconGlyphClassName} />
              </Link>
              <CartDrawer cartCount={cartCount} />
            </div>
          </div>
        </div>

        {/* Mobile search overlay */}
        {searchOpen && (
          <div
            className="fixed inset-0 z-50 bg-store-ink/40 lg:hidden"
            role="presentation"
            onClick={() => setSearchOpen(false)}
          >
            <div
              className="border-b border-store-border bg-store-paper p-4 shadow-md"
              role="dialog"
              aria-modal="true"
              aria-label="Search"
              onClick={(e) => e.stopPropagation()}
            >
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  submitSearch();
                }}
              >
                <div className="relative min-w-0 flex-1">
                  <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-store-fg-muted" />
                  <input
                    ref={searchInputRef}
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={searchPlaceholder}
                    className="h-11 w-full rounded-full border border-store-border bg-store-surface-2 py-2 pl-10 pr-4 text-sm text-store-ink outline-none focus:border-store-border-strong focus:ring-2 focus:ring-store-ink/10"
                  />
                </div>
                <button
                  type="submit"
                  className="shrink-0 rounded-full bg-store-ink-strong px-4 text-sm font-medium text-store-paper hover:bg-store-ink"
                >
                  Go
                </button>
                <button
                  type="button"
                  className="shrink-0 rounded-full border border-store-border px-3 text-sm hover:bg-store-surface"
                  onClick={() => setSearchOpen(false)}
                >
                  Close
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Mobile drawer */}
        {menuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-store-ink/40"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
            />
            <div
              id={menuId}
              className="absolute left-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-store-paper shadow-xl"
              role="dialog"
              aria-modal="true"
              aria-label="Site menu"
            >
              <div className="flex items-center justify-between border-b border-store-border px-4 py-3">
                <span className="text-sm font-semibold uppercase tracking-wide">
                  Menu
                </span>
                <button
                  type="button"
                  className={cn(
                    iconBlockClassName,
                    "rounded-md hover:bg-store-surface",
                  )}
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                >
                  <IconClose className={iconGlyphClassName} />
                </button>
              </div>
              <nav className="flex flex-col p-2" aria-label="Mobile">
                {navItems.map((item) => {
                  const active = activeHref === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={cn(
                        "rounded-lg px-4 py-3 text-base font-medium",
                        active
                          ? "bg-store-surface"
                          : "hover:bg-store-surface-2",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Mega menu panel — fixed at left viewport edge, just below the header */}
      {activeNav?.subItems && (
        <MegaMenuPanel
          item={activeNav}
          onKeepOpen={cancelClose}
          onRequestClose={scheduleClose}
          onNavigate={() => setActiveNav(null)}
        />
      )}

      {/* Backdrop */}
      {activeNav && (
        <div
          className="fixed inset-0 z-35 hidden bg-black/25 lg:block"
          aria-hidden
        />
      )}
    </>
  );
}
