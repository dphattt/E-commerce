"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { iconBlockClassName, iconGlyphClassName } from "../../lib/icon-block";

export type SiteHeaderNavItem = {
  label: string;
  href: string;
};

export type SiteHeaderProps = {
  /** Text logo when no custom `logo` is provided */
  brandName?: string;
  logoHref?: string;
  /** Optional custom logo node (image or text) */
  logo?: React.ReactNode;
  navItems?: SiteHeaderNavItem[];
  /** Highlights the nav item whose `href` matches */
  activeHref?: string;
  /** Single line; used if `announcements` is empty */
  announcement?: string;
  /** If more than one, rotates until paused */
  announcements?: string[];
  searchPlaceholder?: string;
  cartCount?: number;
  className?: string;
  /** Called when user submits search (Enter) on desktop field */
  onSearchSubmit?: (query: string) => void;
};

const defaultNav: SiteHeaderNavItem[] = [
  { label: "Women", href: "/women" },
  { label: "Men", href: "/men" },
  { label: "Accessories", href: "/accessories" },
  { label: "Explore", href: "/explore" },
];

function IconSearch(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function IconHeart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden {...props}>
      <path
        d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 7-3 4.5 4.5 0 0 1 7 3c0 5.65-7 10-7 10Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconUser(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden {...props}>
      <path d="M20 21a8 8 0 0 0-16 0" strokeLinecap="round" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden {...props}>
      <path d="M9 11V8a3 3 0 0 1 6 0v3" strokeLinecap="round" />
      <path d="M5 11h14l-1 10H6L5 11Z" strokeLinejoin="round" />
    </svg>
  );
}

function IconMenu(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function IconClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} aria-hidden {...props}>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function IconPause(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

function IconPlay(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M8 5v14l11-7-11-7Z" />
    </svg>
  );
}

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
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const lines = announcements?.length ? announcements : [announcement];
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

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
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  const submitSearch = useCallback(() => {
    const q = query.trim();
    if (q) onSearchSubmit?.(q);
    setSearchOpen(false);
  }, [onSearchSubmit, query]);

  const line = lines[index] ?? announcement;

  return (
    <header className={`sticky top-0 z-40 w-full bg-store-paper text-store-ink-strong ${className}`}>
      {/* Announcement */}
      <div className="border-b border-store-border/80 bg-store-surface">
        <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-4 py-2 sm:px-6 lg:px-8">
          <div className="min-w-0 flex-1 overflow-x-auto text-center">
            <p className="inline-block min-w-0 whitespace-nowrap text-xs sm:text-sm">
              <Link href="/refer" className="underline underline-offset-2 hover:no-underline">
                {line}
              </Link>
            </p>
          </div>
          {lines.length > 1 && (
            <button
              type="button"
              className="shrink-0 p-1 text-store-fg-muted hover:text-store-ink-strong"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? "Play announcements" : "Pause announcements"}
            >
              {paused ? <IconPlay className="size-4" /> : <IconPause className="size-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-store-border/80">
        <div className="mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-6 lg:px-8">
          {/* Left: hamburger (mobile/tablet) + desktop nav */}
          <div className="flex min-w-0 items-center gap-2 lg:min-w-[200px]">
            <button
              type="button"
              className={`${iconBlockClassName} rounded-md hover:bg-store-surface lg:hidden`}
              aria-expanded={menuOpen}
              aria-controls={menuId}
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
            >
              <IconMenu className={iconGlyphClassName} />
            </button>
            <nav className="hidden min-w-0 lg:flex lg:items-center lg:gap-6" aria-label="Main">
              {navItems.map((item) => {
                const active = activeHref === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative shrink-0 text-sm font-medium tracking-wide text-store-ink-strong after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-store-ink-strong after:transition-opacity ${
                      active ? "after:w-full after:opacity-100" : "after:w-full after:opacity-0 hover:after:opacity-60"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
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
              className={`${iconBlockClassName} rounded-full hover:bg-store-surface lg:hidden`}
              aria-label="Open search"
              onClick={() => setSearchOpen(true)}
            >
              <IconSearch className={`${iconGlyphClassName} text-store-ink`} />
            </button>

            <Link
              href="/wishlist"
              className={`${iconBlockClassName} rounded-full hover:bg-store-surface`}
              aria-label="Wishlist"
            >
              <IconHeart className={iconGlyphClassName} />
            </Link>
            <Link
              href="/account"
              className={`${iconBlockClassName} rounded-full hover:bg-store-surface`}
              aria-label="Account"
            >
              <IconUser className={iconGlyphClassName} />
            </Link>
            <Link
              href="/cart"
              className={`relative ${iconBlockClassName} rounded-full hover:bg-store-surface`}
              aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
            >
              <IconBag className={iconGlyphClassName} />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-store-accent text-[10px] font-semibold leading-none text-store-on-accent">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile / tablet search overlay */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-store-ink/40 lg:hidden" role="presentation" onClick={() => setSearchOpen(false)}>
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

      {/* Mobile / tablet drawer */}
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
              <span className="text-sm font-semibold uppercase tracking-wide">Menu</span>
              <button
                type="button"
                className={`${iconBlockClassName} rounded-md hover:bg-store-surface`}
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
                    className={`rounded-lg px-4 py-3 text-base font-medium ${
                      active ? "bg-store-surface" : "hover:bg-store-surface-2"
                    }`}
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
  );
}
