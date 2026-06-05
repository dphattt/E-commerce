"use client";

import Link from "next/link";

export function WishlistView() {
  return (
    <div className="-mx-4 -mt-9 flex min-h-screen flex-col items-center justify-center bg-zinc-950 sm:-mx-6 lg:-mx-8">
      <div className="flex flex-col items-center gap-4 px-8 text-center">
        <svg
          viewBox="0 0 60 60"
          fill="none"
          stroke="#9ca3af"
          strokeWidth={1.5}
          className="size-16"
          aria-hidden
        >
          <path d="M30 52s-18-10.875-18-25a11.25 11.25 0 0 1 18-7.5 11.25 11.25 0 0 1 18 7.5C48 41.125 30 52 30 52Z" />
        </svg>
        <div className="space-y-1">
          <h1 className="text-sm font-bold uppercase tracking-widest text-white">
            Your Wishlist
          </h1>
          <p className="max-w-xs text-sm leading-relaxed text-zinc-400">
            Tap the heart icon at the top of the page to view your saved items.
          </p>
        </div>
        <Link
          href="/products"
          className="mt-4 flex h-12 w-48 items-center justify-center rounded-full bg-black text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-zinc-900"
        >
          Shop Now
        </Link>
      </div>
    </div>
  );
}
