"use client";

import Link from "next/link";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export type CartDrawerProps = {
  cartCount?: number;
};

function IconBag(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
      {...props}
    >
      <path d="M9 11V8a3 3 0 0 1 6 0v3" strokeLinecap="round" />
      <path d="M5 11h14l-1 10H6L5 11Z" strokeLinejoin="round" />
    </svg>
  );
}

function IconHeart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
      {...props}
    >
      <path
        d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 7-3 4.5 4.5 0 0 1 7 3c0 5.65-7 10-7 10Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClose(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
      {...props}
    >
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function EmptyBagIllustration() {
  return (
    <div className="mx-auto flex size-[120px] items-center justify-center rounded-lg bg-zinc-700">
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

export function CartDrawer({ cartCount = 0 }: CartDrawerProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className="relative inline-flex size-10 items-center justify-center rounded-full hover:bg-store-surface"
          aria-label={`Shopping cart${cartCount > 0 ? `, ${cartCount} items` : ""}`}
        >
          <IconBag className="size-6" />
          {cartCount > 0 && (
            <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-store-accent text-[10px] font-semibold leading-none text-store-on-accent">
              {cartCount > 9 ? "9+" : cartCount}
            </span>
          )}
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        showCloseButton={false}
        className="flex w-full flex-col gap-0 border-0 bg-zinc-900 p-0 text-white sm:max-w-[500px]"
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between border-b border-zinc-700 px-5 py-4">
          <SheetTitle className="text-sm font-bold uppercase tracking-widest text-white">
            Your Bag
          </SheetTitle>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg bg-black text-white"
              aria-label="Bag"
            >
              <IconBag className="size-5" />
            </button>
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-full text-white hover:bg-zinc-800"
              aria-label="Wishlist"
            >
              <IconHeart className="size-5" />
            </button>
            <SheetClose className="inline-flex size-9 items-center justify-center rounded-full text-white hover:bg-zinc-800">
              <IconClose className="size-5" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        </SheetHeader>

        {/* Body — empty state */}
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
                href="/men"
                className="flex h-12 w-full items-center justify-center rounded-full bg-black text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-zinc-900"
              >
                Shop Mens
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link
                href="/women"
                className="flex h-12 w-full items-center justify-center rounded-full bg-black text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-zinc-900"
              >
                Shop Womens
              </Link>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
