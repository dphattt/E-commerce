"use client";

import Link from "next/link";
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
import { iconBlockClassName } from "@/lib/icon-block";
import { useHasHydrated } from "@/shared/hooks";
import { formatUsd } from "@/shared/lib/format-money";
import { cn } from "@/lib/utils";

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
            {formatUsd(lineTotal)}
          </p>
        </div>
      </div>
    </li>
  );
}

export function CartDrawer() {
  const hasHydrated = useHasHydrated();
  const { items, count, subtotal, removeItem, updateQuantity, clear } =
    useCart();

  // While the persisted store is still hydrating on the client, we
  // render the same "empty" UI the server emitted to avoid a flicker
  // and avoid a hydration mismatch warning.
  const visibleItems = hasHydrated ? items : [];
  const visibleCount = hasHydrated ? count : 0;

  return (
    <Sheet>
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
              Your Bag {visibleCount > 0 ? `(${visibleCount})` : null}
            </SheetTitle>
            <SheetDescription className="sr-only">
              View and manage items in your shopping bag.
            </SheetDescription>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg bg-black text-white"
              aria-label="Bag"
            >
              <IconBag className="size-5" />
            </button>
            <Link
              href="/wishlist"
              className="inline-flex size-9 items-center justify-center rounded-full text-white hover:bg-zinc-800"
              aria-label="Wishlist"
            >
              <IconHeart className="size-5" />
            </Link>
            <SheetClose className="inline-flex size-9 items-center justify-center rounded-full text-white hover:bg-zinc-800">
              <IconClose className="size-5" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        </SheetHeader>

        {visibleItems.length === 0 ? (
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
                  {formatUsd(subtotal.amount)}
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
        )}
      </SheetContent>
    </Sheet>
  );
}
