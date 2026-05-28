"use client";

import Link from "next/link";
import { useWishlist } from "@/features/wishlist";
import { useHasHydrated } from "@/shared/hooks";

function WishlistIllustration() {
  return (
    <div className="relative mx-auto flex size-[220px] items-center justify-center">
      <div className="absolute size-[180px] rounded-full bg-zinc-800" />
      <svg
        className="absolute inset-0 size-full"
        viewBox="0 0 220 220"
        fill="none"
        aria-hidden
      >
        <text x="30" y="55" fontSize="14" fill="#6b7280">✦</text>
        <text x="165" y="48" fontSize="10" fill="#6b7280">✦</text>
        <text x="185" y="120" fontSize="8" fill="#6b7280">○</text>
        <text x="22" y="140" fontSize="8" fill="#6b7280">○</text>
        <text x="55" y="185" fontSize="14" fill="#6b7280">✦</text>
        <text x="140" y="190" fontSize="10" fill="#6b7280">✦</text>
      </svg>
      <div className="absolute left-[38px] top-[55px] flex size-[80px] -rotate-6 flex-col overflow-hidden rounded-lg bg-zinc-700 shadow-lg">
        <div className="flex flex-1 items-center justify-center bg-zinc-600">
          <svg viewBox="0 0 40 40" className="size-8 text-zinc-500" fill="currentColor" aria-hidden>
            <rect x="5" y="5" width="30" height="30" rx="2" />
          </svg>
        </div>
        <div className="flex items-center justify-end bg-zinc-700 p-1">
          <div className="flex size-5 items-center justify-center rounded-full bg-white">
            <svg viewBox="0 0 24 24" className="size-3 fill-red-500" aria-hidden>
              <path d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 7-3 4.5 4.5 0 0 1 7 3c0 5.65-7 10-7 10Z" />
            </svg>
          </div>
        </div>
      </div>
      <div className="absolute left-[100px] top-[50px] flex size-[80px] rotate-6 flex-col overflow-hidden rounded-lg bg-zinc-600 shadow-lg">
        <div className="flex flex-1 items-center justify-center bg-zinc-500">
          <svg viewBox="0 0 40 40" className="size-8 text-zinc-400" fill="currentColor" aria-hidden>
            <rect x="5" y="5" width="30" height="30" rx="2" />
          </svg>
        </div>
        <div className="flex items-center justify-end bg-zinc-600 p-1">
          <div className="flex size-5 items-center justify-center rounded-full bg-white">
            <svg viewBox="0 0 24 24" className="size-3 fill-red-500" aria-hidden>
              <path d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 7-3 4.5 4.5 0 0 1 7 3c0 5.65-7 10-7 10Z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WishlistView() {
  const hasHydrated = useHasHydrated();
  const { slugs, count, remove, clear } = useWishlist();
  const items = hasHydrated ? slugs : [];
  const productCount = hasHydrated ? count : 0;

  return (
    <div className="-mx-4 -mt-9 min-h-screen bg-zinc-950 sm:-mx-6 lg:-mx-8">
      <div className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex items-baseline justify-between gap-3">
          <div className="flex items-baseline gap-3">
            <h1 className="text-sm font-bold uppercase tracking-widest text-white">
              Your Wishlist
            </h1>
            <span className="text-sm text-zinc-400">
              {productCount} {productCount === 1 ? "Product" : "Products"}
            </span>
          </div>
          {items.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="text-xs text-zinc-400 underline-offset-2 hover:underline"
            >
              Clear wishlist
            </button>
          ) : null}
        </div>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <WishlistIllustration />

            <h2 className="mt-6 text-sm font-bold uppercase tracking-widest text-white">
              Your Wishlist Is Empty
            </h2>

            <p className="mt-3 max-w-xs text-sm leading-relaxed text-zinc-400">
              Tap the heart next to anything you like the look of and we&apos;ll
              save it here. Then when you&apos;re ready, add it to your bag, check
              out, put it on, and then let&apos;s go gym.
            </p>

            <div className="mt-8 flex w-full max-w-xs flex-col gap-3">
              <Link
                href="/products"
                className="flex h-12 w-full items-center justify-center rounded-full bg-black text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-zinc-900"
              >
                Shop Now
              </Link>
            </div>
          </div>
        ) : (
          <ul className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {items.map((slug) => (
              <li
                key={slug}
                className="flex flex-col gap-3 rounded-lg bg-zinc-900 p-4"
              >
                <Link
                  href={`/products/${slug}`}
                  className="block text-sm font-semibold text-white underline-offset-2 hover:underline"
                >
                  {slug}
                </Link>
                <button
                  type="button"
                  onClick={() => remove(slug)}
                  className="self-start text-xs text-zinc-400 underline-offset-2 hover:underline"
                  aria-label={`Remove ${slug} from wishlist`}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
