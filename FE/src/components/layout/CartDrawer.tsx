"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { iconBlockClassName } from "@/lib/icon-block";
import { cn } from "@/lib/utils";
import { IconBag, IconClose, IconHeart } from "@/components/icons";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useCart } from "@/features/cart";
import type { CartItem } from "@/features/cart";
import { useWishlist } from "@/features/wishlist";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductBySlug } from "@/features/products/api/products.api";
import { cacheProduct, selectCachedProduct } from "@/features/products/model/products.slice";
import type { Product } from "@/features/products/model/product.types";

function EmptyBagIllustration() {
  return (
    <div className="mx-auto flex size-30 items-center justify-center rounded-lg bg-zinc-700">
      <svg
        viewBox="0 0 60 60"
        fill="none"
        stroke="#9ca3af"
        strokeWidth={1.5}
        className="size-16"
        aria-hidden
      >
        <rect x="10" y="20" width="40" height="34" rx="2" />
        <path d="M22 20v-4a8 8 0 0 1 16 0v4" strokeLinecap="round" />
        <path
          d="M22 34c0 4.418 3.582 8 8 8s8-3.582 8-8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function formatMoney(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

// ─── Wishlist panel helpers ───────────────────────────────────────────────────

function WishlistItem({
  slug,
  onRemove,
}: {
  slug: string;
  onRemove: (slug: string) => void;
}) {
  const dispatch = useAppDispatch();
  const cached = useAppSelector((s) => selectCachedProduct(s.products, slug));
  const [product, setProduct] = useState<Product | null>(cached);
  const [loading, setLoading] = useState(!cached);

  useEffect(() => {
    if (cached) {
      setProduct(cached);
      setLoading(false);
      return;
    }
    let cancelled = false;
    fetchProductBySlug(slug)
      .then(({ product: p }) => {
        if (!cancelled) {
          dispatch(cacheProduct(p));
          setProduct(p);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [slug, cached, dispatch]);

  if (loading) {
    return (
      <li className="flex animate-pulse gap-3 border-b border-zinc-800 px-5 py-4">
        <div className="size-16 shrink-0 rounded-lg bg-zinc-700" />
        <div className="flex flex-1 flex-col gap-2 py-1">
          <div className="h-3 w-3/4 rounded bg-zinc-700" />
          <div className="h-3 w-1/2 rounded bg-zinc-700" />
        </div>
      </li>
    );
  }

  if (!product) {
    return (
      <li className="flex items-center gap-3 border-b border-zinc-800 px-5 py-4">
        <div className="size-16 shrink-0 rounded-lg bg-zinc-800" />
        <div className="flex-1">
          <p className="text-xs text-zinc-500">{slug}</p>
          <button
            type="button"
            onClick={() => onRemove(slug)}
            className="text-xs text-zinc-400 underline-offset-2 hover:underline"
          >
            Remove
          </button>
        </div>
      </li>
    );
  }

  const image = product.imageUrls[0] ?? "";
  const price = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.price.currency,
  }).format(product.price.amount);

  return (
    <li className="flex gap-3 border-b border-zinc-800 px-5 py-4">
      <SheetClose asChild>
        <Link
          href={`/products/${slug}`}
          className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800"
        >
          {image && (
            <Image src={image} alt={product.title} fill className="object-cover" />
          )}
        </Link>
      </SheetClose>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <SheetClose asChild>
          <Link
            href={`/products/${slug}`}
            className="truncate text-sm font-semibold text-white underline-offset-2 hover:underline"
          >
            {product.title}
          </Link>
        </SheetClose>
        <p className="text-sm font-bold text-white">{price}</p>
        <button
          type="button"
          onClick={() => onRemove(slug)}
          className="self-start text-xs text-zinc-400 underline-offset-2 hover:underline"
          aria-label={`Remove ${product.title} from wishlist`}
        >
          Remove
        </button>
      </div>
    </li>
  );
}

// ─── Cart helpers ─────────────────────────────────────────────────────────────

function CartLine({
  item,
  onRemove,
  onUpdateQuantity,
}: {
  item: CartItem;
  onRemove: (sku: string) => void;
  onUpdateQuantity: (sku: string, quantity: number) => void;
}) {
  const lineTotal = item.unitPrice.amount * item.quantity;
  return (
    <li className="flex gap-4 border-b border-zinc-800 px-5 py-4">
      <div className="size-20 shrink-0 overflow-hidden rounded bg-zinc-800">
        {item.image ? (
          // Using a plain <img> here on purpose: cart line is a
          // throwaway thumbnail with no perf budget.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.image}
            alt={item.name}
            className="size-full object-cover"
            loading="lazy"
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">
              {item.name}
            </p>
            <p className="text-xs text-zinc-400">{item.sku}</p>
            {item.variantLabel ? (
              <p className="text-xs text-zinc-400">{item.variantLabel}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => onRemove(item.sku)}
            className="text-xs text-zinc-400 underline-offset-2 hover:underline"
            aria-label={`Remove ${item.name}`}
          >
            Remove
          </button>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <div className="inline-flex items-center rounded-full border border-zinc-700">
            <button
              type="button"
              onClick={() =>
                onUpdateQuantity(item.sku, Math.max(1, item.quantity - 1))
              }
              className="inline-flex size-7 items-center justify-center rounded-full text-white hover:bg-zinc-800"
              aria-label={`Decrease quantity of ${item.name}`}
            >
              −
            </button>
            <span
              className="min-w-6 px-1 text-center text-sm tabular-nums text-white"
              aria-live="polite"
            >
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={() => onUpdateQuantity(item.sku, item.quantity + 1)}
              className="inline-flex size-7 items-center justify-center rounded-full text-white hover:bg-zinc-800"
              aria-label={`Increase quantity of ${item.name}`}
            >
              +
            </button>
          </div>
          <p className="text-sm font-semibold tabular-nums text-white">
            {formatMoney(lineTotal, item.unitPrice.currency)}
          </p>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer() {
  const [view, setView] = useState<"bag" | "wishlist">("bag");
  const { items, count, subtotal, isLoading, removeItem, updateQuantity, clear } =
    useCart();
  const { slugs, count: wishlistCount, remove: removeWishlistItem, clear: clearWishlist } =
    useWishlist();

  // Khi RTK Query đang fetch, hiển thị UI empty để tránh flicker
  const visibleItems = isLoading ? [] : items;
  const visibleCount = isLoading ? 0 : count;

  const titleText =
    view === "bag"
      ? `Your Bag${visibleCount > 0 ? ` (${visibleCount})` : ""}`
      : `Your Wishlist${wishlistCount > 0 ? ` (${wishlistCount})` : ""}`;

  return (
    <Sheet onOpenChange={(open) => { if (!open) setView("bag"); }}>
      <SheetTrigger asChild>
        <button
          type="button"
          className={cn(
            iconBlockClassName,
            "relative cursor-pointer rounded-full transition-all duration-150 hover:scale-105 hover:bg-store-ink-strong hover:text-store-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-ink/20 active:scale-95",
          )}
          aria-label={`Shopping cart${visibleCount > 0 ? `, ${visibleCount} items` : ""}`}
        >
          <IconBag className="size-5" />
          {visibleCount > 0 && (
            <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-store-accent text-[10px] font-semibold leading-none text-store-on-accent">
              {visibleCount > 9 ? "9+" : visibleCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-0 bg-zinc-900 p-0 text-white sm:max-w-125"
      >
        <SheetHeader className="flex flex-row items-center justify-between border-b border-zinc-700 px-5 py-4">
          <div>
            <SheetTitle className="text-sm font-bold uppercase tracking-widest text-white">
              {titleText}
            </SheetTitle>
            <SheetDescription className="sr-only">
              {view === "bag"
                ? "View and manage items in your shopping bag."
                : "View and manage your wishlisted products."}
            </SheetDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* Bag tab */}
            <button
              type="button"
              onClick={() => setView("bag")}
              className={cn(
                "relative inline-flex size-9 items-center justify-center rounded-lg text-white",
                view === "bag" ? "bg-black" : "hover:bg-zinc-800",
              )}
              aria-label="View bag"
            >
              <IconBag className="size-5" />
              {visibleCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-store-accent text-[10px] font-semibold leading-none text-store-on-accent">
                  {visibleCount > 9 ? "9+" : visibleCount}
                </span>
              )}
            </button>
            {/* Wishlist tab */}
            <button
              type="button"
              onClick={() => setView("wishlist")}
              className={cn(
                "relative inline-flex size-9 items-center justify-center rounded-full text-white",
                view === "wishlist" ? "bg-black" : "hover:bg-zinc-800",
              )}
              aria-label="View wishlist"
            >
              <IconHeart className="size-5" />
              {wishlistCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-store-accent text-[10px] font-semibold leading-none text-store-on-accent">
                  {wishlistCount > 9 ? "9+" : wishlistCount}
                </span>
              )}
            </button>
            <SheetClose className="inline-flex size-9 items-center justify-center rounded-full text-white hover:bg-zinc-800">
              <IconClose className="size-5" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        </SheetHeader>

        {/* ── BAG PANEL ─────────────────────────────────────────────────────── */}
        {view === "bag" && (
          visibleItems.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-12 text-center">
              <EmptyBagIllustration />
              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-widest text-white">
                  Your bag is empty
                </p>
                <p className="text-sm text-zinc-400">
                  There are no products in your bag
                </p>
              </div>
              <div className="mt-4 flex w-full flex-col gap-3">
                <SheetClose asChild>
                  <Link
                    href="/products"
                    className="flex h-12 w-full items-center justify-center rounded-full bg-black text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-zinc-900"
                  >
                    Shop Now
                  </Link>
                </SheetClose>
              </div>
            </div>
          ) : (
            <>
              <ul className="flex-1 overflow-y-auto">
                {visibleItems.map((item) => (
                  <CartLine
                    key={item.sku}
                    item={item}
                    onRemove={removeItem}
                    onUpdateQuantity={updateQuantity}
                  />
                ))}
              </ul>
              <div className="space-y-3 border-t border-zinc-700 px-5 py-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-zinc-400">Subtotal</span>
                  <span className="font-semibold text-white tabular-nums">
                    {formatMoney(subtotal.amount, subtotal.currency)}
                  </span>
                </div>
                <SheetClose asChild>
                  <Link
                    href="/cart"
                    className="flex h-12 w-full items-center justify-center rounded-full bg-black text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-zinc-900"
                  >
                    Checkout
                  </Link>
                </SheetClose>
                <button
                  type="button"
                  onClick={clear}
                  className="block w-full text-center text-xs text-zinc-400 underline-offset-2 hover:underline"
                >
                  Clear bag
                </button>
              </div>
            </>
          )
        )}

        {/* ── WISHLIST PANEL ────────────────────────────────────────────────── */}
        {view === "wishlist" && (
          slugs.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-12 text-center">
              <div className="mx-auto flex size-30 items-center justify-center rounded-lg bg-zinc-700">
                <svg viewBox="0 0 60 60" fill="none" stroke="#9ca3af" strokeWidth={1.5} className="size-16" aria-hidden>
                  <path d="M30 52s-18-10.875-18-25a11.25 11.25 0 0 1 18-7.5 11.25 11.25 0 0 1 18 7.5C48 41.125 30 52 30 52Z" />
                </svg>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-bold uppercase tracking-widest text-white">
                  Your wishlist is empty
                </p>
                <p className="text-sm text-zinc-400">
                  Tap the heart on any product to save it here
                </p>
              </div>
              <div className="mt-4 flex w-full flex-col gap-3">
                <SheetClose asChild>
                  <Link
                    href="/products"
                    className="flex h-12 w-full items-center justify-center rounded-full bg-black text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-zinc-900"
                  >
                    Shop Now
                  </Link>
                </SheetClose>
              </div>
            </div>
          ) : (
            <>
              <ul className="flex-1 overflow-y-auto">
                {slugs.map((slug) => (
                  <WishlistItem key={slug} slug={slug} onRemove={removeWishlistItem} />
                ))}
              </ul>
              <div className="space-y-3 border-t border-zinc-700 px-5 py-4">
                <SheetClose asChild>
                  <Link
                    href="/wishlist"
                    className="flex h-12 w-full items-center justify-center rounded-full bg-black text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-zinc-900"
                  >
                    View Full Wishlist
                  </Link>
                </SheetClose>
                <button
                  type="button"
                  onClick={clearWishlist}
                  className="block w-full text-center text-xs text-zinc-400 underline-offset-2 hover:underline"
                >
                  Clear wishlist
                </button>
              </div>
            </>
          )
        )}
      </SheetContent>
    </Sheet>
  );
}
