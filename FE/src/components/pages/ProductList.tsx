"use client";

import { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { SlidersHorizontal, X, ChevronDown, ChevronUp } from "lucide-react";
import { IconHeart } from "@/components/icons";
import { useWishlist } from "@/features/wishlist";
import { useHasHydrated } from "@/shared/hooks";
import {
  productSlugFromSourceUrl,
  useProductCache,
  type Product,
} from "@/features/products";

type SortOption = "popular" | "low-to-high" | "high-to-low" | "newest";

const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "popular", label: "Most Popular" },
  { id: "low-to-high", label: "Price: Low to High" },
  { id: "high-to-low", label: "Price: High to Low" },
  { id: "newest", label: "Newest First" },
];

interface SortPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  sortOption: SortOption;
  onSortChange: (opt: SortOption) => void;
}

function SortPanel({ isOpen, onToggle, sortOption, onSortChange }: SortPanelProps) {
  return (
    <div className="border-b border-store-border pb-4">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-2 text-left font-black text-xs uppercase tracking-widest text-store-ink-strong hover:text-store-fg-muted transition-colors"
      >
        <span>Sort By</span>
        {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
      </button>
      <div
        className={`mt-2 flex flex-col gap-2 transition-all duration-300 origin-top overflow-hidden ${
          isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        {SORT_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-store-fg-muted hover:text-store-ink-strong transition-colors py-1"
          >
            <input
              type="radio"
              name="sortOption"
              value={opt.id}
              checked={sortOption === opt.id}
              onChange={() => onSortChange(opt.id)}
              className="size-4 accent-store-ink cursor-pointer"
            />
            <span className={sortOption === opt.id ? "text-store-ink-strong font-black" : ""}>
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}

interface ProductListProps {
  products: Product[];
  total: number;
  categorySlug?: string;
}

function deriveCategoryLabel(categories: string[]): string {
  return categories.slice(1).filter(Boolean).join(" › ");
}

function derivePageTitle(categorySlug?: string, categories?: string[][]): string {
  if (!categorySlug) return "All Products";
  if (categories?.length) {
    const first = categories[0];
    return first.slice(1).filter(Boolean).join(" / ") || "Products";
  }
  return categorySlug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ProductList({ products, total, categorySlug }: ProductListProps) {
  const wishlist = useWishlist();
  const hasHydrated = useHasHydrated();
  const { cacheProduct, cacheProducts } = useProductCache();

  useEffect(() => {
    cacheProducts(products);
  }, [products, cacheProducts]);

  const [sortOption, setSortOption] = useState<SortOption>("popular");
  const [isSortOpen, setIsSortOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const pageTitle = useMemo(
    () => derivePageTitle(categorySlug, products.map((p) => p.categories)),
    [categorySlug, products],
  );

  const sorted = useMemo(() => {
    const arr = [...products];
    switch (sortOption) {
      case "low-to-high":
        return arr.sort((a, b) => a.price.amount - b.price.amount);
      case "high-to-low":
        return arr.sort((a, b) => b.price.amount - a.price.amount);
      case "newest":
        return arr.sort(
          (a, b) =>
            new Date(b.scrapedAt).getTime() - new Date(a.scrapedAt).getTime(),
        );
      default:
        return arr;
    }
  }, [products, sortOption]);

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Header */}
      <div className="flex flex-col gap-2 pt-2 border-b border-store-border pb-6 sm:pb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl font-black uppercase italic leading-[0.9] tracking-tighter text-store-ink-strong"
            style={{ fontStretch: "condensed" }}
          >
            {pageTitle}
          </h1>
          <span className="text-xs sm:text-sm font-medium text-store-fg-muted shrink-0 bg-store-surface px-3 py-1.5 rounded-full border border-store-border/50">
            {total} Products
          </span>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Mobile filter button */}
        <div className="w-full lg:hidden flex gap-2 sticky top-20 z-20 bg-store-paper/95 backdrop-blur-md py-2 border-b border-store-border">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 h-11 border border-store-border bg-store-paper rounded-lg text-sm font-bold uppercase tracking-wider hover:border-store-ink-strong transition-colors"
          >
            <SlidersHorizontal className="size-4" />
            Sort
          </button>
        </div>

        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:flex flex-col gap-6 w-64 shrink-0 sticky top-24 max-h-[80vh] overflow-y-auto pr-2">
          <div className="flex items-center justify-between border-b border-store-border pb-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-store-ink-strong flex items-center gap-2">
              <SlidersHorizontal className="size-3.5" />
              Sort
            </h2>
          </div>
          <SortPanel
            isOpen={isSortOpen}
            onToggle={() => setIsSortOpen((o) => !o)}
            sortOption={sortOption}
            onSortChange={setSortOption}
          />
        </aside>

        {/* Product Grid */}
        <div className="flex-1 w-full">
          {sorted.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-store-surface-2 rounded-2xl border border-dashed border-store-border/80 w-full">
              <span className="text-3xl">🏜️</span>
              <p className="text-base font-bold text-store-ink-strong uppercase tracking-wider">
                No Products Found
              </p>
              <p className="text-xs text-store-fg-muted max-w-sm">
                No products matched this category. Try browsing a different
                section.
              </p>
              <Link
                href="/products"
                className="mt-2 bg-store-ink-strong text-store-paper px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-store-ink transition-all shadow-sm"
              >
                View All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-10 gap-x-6 w-full">
              {sorted.map((product) => {
                const primaryImg = product.imageUrls[0] ?? "";
                const hoverImg = product.imageUrls[1] ?? primaryImg;
                const isHovered = hoveredId === product._id;
                const isWishlisted =
                  hasHydrated && wishlist.isWishlisted(product._id);
                const categoryLabel = deriveCategoryLabel(product.categories);
                const slug = productSlugFromSourceUrl(product.sourceUrl);

                return (
                  <article
                    key={product._id}
                    className="flex flex-col gap-3 group relative cursor-pointer"
                    onMouseEnter={() => setHoveredId(product._id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    {/* Image Box */}
                    <div className="relative aspect-2/3 w-full overflow-hidden bg-store-surface rounded-2xl border border-store-border/40 shadow-sm">
                      {/* Wishlist */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          wishlist.toggle(product._id);
                        }}
                        className="absolute top-3 right-3 z-10 flex items-center justify-center size-9 rounded-full bg-store-paper hover:scale-105 active:scale-95 transition-all shadow-md cursor-pointer"
                        aria-label={
                          isWishlisted
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                        aria-pressed={isWishlisted}
                      >
                        <IconHeart
                          className={`size-5 transition-colors ${
                            isWishlisted
                              ? "fill-red-500 stroke-red-500 text-red-500 scale-110"
                              : "text-store-ink hover:text-red-500"
                          }`}
                        />
                      </button>

                      <Link
                        href={`/products/${slug}`}
                        onClick={() => cacheProduct(product)}
                        className="absolute inset-0 block overflow-hidden rounded-2xl"
                      >
                        {/* Primary image — fades out + zooms in gently */}
                        <div className="absolute inset-0">
                          {primaryImg && (
                            <Image
                              src={primaryImg}
                              alt={product.title}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className={`object-cover transition-[opacity,transform] duration-500 ease-out ${
                                isHovered
                                  ? "opacity-0 scale-105"
                                  : "opacity-100 scale-100"
                              }`}
                            />
                          )}
                        </div>
                        {/* Hover image — fades in after primary fades out */}
                        <div className="absolute inset-0">
                          {hoverImg && (
                            <Image
                              src={hoverImg}
                              alt={`${product.title} alternate`}
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                              className={`object-cover transition-[opacity,transform] duration-500 ease-out delay-100 ${
                                isHovered
                                  ? "opacity-100 scale-100"
                                  : "opacity-0 scale-100"
                              }`}
                            />
                          )}
                        </div>
                      </Link>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col gap-1.5 px-1">
                      {categoryLabel && (
                        <span className="text-[10px] font-bold text-store-fg-muted uppercase tracking-wider">
                          {categoryLabel}
                        </span>
                      )}
                      <div className="flex items-start justify-between gap-4">
                        <Link
                          href={`/products/${slug}`}
                          onClick={() => cacheProduct(product)}
                          className="hover:underline"
                        >
                          <h3 className="font-black text-sm uppercase text-store-ink-strong tracking-tight line-clamp-2 leading-snug">
                            {product.title}
                          </h3>
                        </Link>
                        <span className="font-black text-sm text-store-ink-strong shrink-0">
                          ${product.price.amount}
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Sort Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-store-ink/40 backdrop-blur-xs"
            aria-label="Close"
          />
          <div className="relative w-full max-w-[340px] h-full bg-store-paper shadow-2xl flex flex-col p-5 z-10">
            <div className="flex items-center justify-between border-b border-store-border pb-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-store-ink-strong flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                Sort
              </h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-md hover:bg-store-surface"
                aria-label="Close"
              >
                <X className="size-5 text-store-ink" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto py-4">
              <SortPanel
                isOpen={isSortOpen}
                onToggle={() => setIsSortOpen((o) => !o)}
                sortOption={sortOption}
                onSortChange={setSortOption}
              />
            </div>
            <div className="border-t border-store-border pt-4">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full h-11 bg-store-ink-strong text-store-paper text-[11px] font-black uppercase tracking-wider rounded-lg hover:bg-store-ink transition-all"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
