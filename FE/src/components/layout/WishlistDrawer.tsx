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
import { useWishlist } from "@/features/wishlist";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchProductBySlug } from "@/features/products/api/products.api";
import { cacheProduct, selectCachedProduct } from "@/features/products/model/products.slice";
import type { Product } from "@/features/products/model/product.types";

function EmptyWishlistIllustration() {
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
        <path d="M30 52s-18-10.875-18-25a11.25 11.25 0 0 1 18-7.5 11.25 11.25 0 0 1 18 7.5C48 41.125 30 52 30 52Z" />
      </svg>
    </div>
  );
}

function WishlistCard({
  slug,
  onRemove,
}: {
  slug: string;
  onRemove: (slug: string) => void;
}) {
  const dispatch = useAppDispatch();
  const cached = useAppSelector((s) => selectCachedProduct(s.products, slug));
  const [fetchedProduct, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(!cached);
  const product = cached ?? fetchedProduct;
  const isLoading = !product && loading;

  useEffect(() => {
    if (cached) return;

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

  if (isLoading) {
    return (
      <li className="flex animate-pulse gap-3 px-5 py-4">
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
      <li className="flex items-center gap-3 px-5 py-4">
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
            <Image
              src={image}
              alt={product.title}
              fill
              className="object-cover"
            />
          )}
        </Link>
      </SheetClose>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <SheetClose asChild>
          <Link
            href={`/products/${slug}`}
            className="truncate text-sm font-semibold text-white hover:underline underline-offset-2"
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

export function WishlistDrawer() {
  const { slugs, count, remove, clear } = useWishlist();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          type="button"
          className={cn(
            iconBlockClassName,
            "relative cursor-pointer rounded-full transition-all duration-150 hover:scale-105 hover:bg-store-ink-strong hover:text-store-paper focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-store-ink/20 active:scale-95",
          )}
          aria-label={`Wishlist${count > 0 ? `, ${count} items` : ""}`}
        >
          <IconHeart className="size-5" />
          {count > 0 && (
            <span className="absolute right-0.5 top-0.5 flex size-4 items-center justify-center rounded-full bg-store-accent text-[10px] font-semibold leading-none text-store-on-accent">
              {count > 9 ? "9+" : count}
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
              Your Wishlist {count > 0 ? `(${count})` : null}
            </SheetTitle>
            <SheetDescription className="sr-only">
              View and manage your wishlisted products.
            </SheetDescription>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex size-9 items-center justify-center rounded-lg bg-black text-white"
              aria-label="Wishlist"
            >
              <IconHeart className="size-5" />
            </button>
            <SheetClose asChild>
              <Link
                href="/cart"
                className="inline-flex size-9 items-center justify-center rounded-full text-white hover:bg-zinc-800"
                aria-label="Shopping bag"
              >
                <IconBag className="size-5" />
              </Link>
            </SheetClose>
            <SheetClose className="inline-flex size-9 items-center justify-center rounded-full text-white hover:bg-zinc-800">
              <IconClose className="size-5" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        </SheetHeader>

        {slugs.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 py-12 text-center">
            <EmptyWishlistIllustration />
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
                <WishlistCard key={slug} slug={slug} onRemove={remove} />
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
                onClick={clear}
                className="block w-full text-center text-xs text-zinc-400 underline-offset-2 hover:underline"
              >
                Clear wishlist
              </button>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
