"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/features/cart";
import type { Product, ProductVariant } from "@/features/products";

function IconHeart(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      {...props}
    >
      <path d="M12 21s-7-4.35-7-10a4.5 4.5 0 0 1 7-3 4.5 4.5 0 0 1 7 3c0 5.65-7 10-7 10Z" />
    </svg>
  );
}

function IconChevronDown(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      {...props}
    >
      <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const mockProduct: Product = {
  _id: "mock-id",
  sourceUrl: "https://www.gymshark.com/products/gymshark-crest-t-shirt-white-aw21",
  title: "Gymshark Power T-Shirt",
  price: { amount: 34, currency: "USD" },
  imageUrls: [
    "https://cdn.shopify.com/s/files/1/1367/5207/files/images-GSxCBUMWashedGraphicT_ShirtGSSoftWhiteA4C4X_WCMY_1163_V1_3840x.jpg?v=1774351794",
    "https://cdn.shopify.com/s/files/1/1367/5207/files/images-GSxCBUMWashedGraphicT_ShirtGSSoftWhiteA4C4X_WCMY_1194_V1_3840x.jpg?v=1774351794",
    "https://cdn.shopify.com/s/files/1/1367/5207/files/images-GSxCBUMWashedGraphicT_ShirtGSSoftWhiteA4C4X_WCMY_1223_V1_3840x.jpg?v=1774351794",
    "https://cdn.shopify.com/s/files/1/1367/5207/files/images-GSxCBUMWashedGraphicT_ShirtGSSoftWhiteA4C4X_WCMY_1148_V1_3840x.jpg?v=1774351794",
  ],
  localImagePaths: [],
  categories: ["Mens", "Apparel", "SS Tops", "t_shirt"],
  scrapedAt: new Date().toISOString(),
  description: "Built to perform, designed to last. The Power T-Shirt features a durable fabric blend and a fit that moves with you.",
  descTag: "Men's Training",
  variants: [
    {
      id: "black",
      color: "Black",
      image: "https://cdn.shopify.com/s/files/1/1367/5207/files/images-GSxCBUMWashedGraphicT_ShirtGSSoftWhiteA4C4X_WCMY_1166_V1_3840x.jpg?v=1774351794",
      hex: "#111111",
      sizes: [
        { id: "xs", label: "XS", inStock: true, sku: "MOCK-BLK-XS" },
        { id: "s", label: "S", inStock: true, sku: "MOCK-BLK-S" },
        { id: "m", label: "M", inStock: true, sku: "MOCK-BLK-M" },
        { id: "l", label: "L", inStock: true, sku: "MOCK-BLK-L" },
        { id: "xl", label: "XL", inStock: false, sku: "MOCK-BLK-XL" },
        { id: "xxl", label: "XXL", inStock: true, sku: "MOCK-BLK-XXL" },
      ],
    },
    {
      id: "grey",
      color: "Grey",
      image: "https://cdn.shopify.com/s/files/1/1367/5207/files/images-GSxCBUMWashedGraphicT_ShirtGSSoftWhiteA4C4X_WCMY_1148_V1_3840x.jpg?v=1774351794",
      hex: "#888888",
      sizes: [
        { id: "xs", label: "XS", inStock: true, sku: "MOCK-GRY-XS" },
        { id: "s", label: "S", inStock: true, sku: "MOCK-GRY-S" },
        { id: "m", label: "M", inStock: true, sku: "MOCK-GRY-M" },
        { id: "l", label: "L", inStock: false, sku: "MOCK-GRY-L" },
        { id: "xl", label: "XL", inStock: true, sku: "MOCK-GRY-XL" },
        { id: "xxl", label: "XXL", inStock: true, sku: "MOCK-GRY-XXL" },
      ],
    },
  ],
};

type ProductDetailProps = {
  slug?: string;
  product?: Product;
};

export function ProductDetail({ slug, product: initialProduct }: ProductDetailProps = {}) {
  const cart = useCart();
  const product = initialProduct || mockProduct;

  const livePrice = initialProduct
    ? new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: product.price.currency,
      }).format(product.price.amount)
    : null;

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: product.price.currency,
  }).format(product.price.amount);

  if (process.env.NODE_ENV !== "production" && slug) {
    console.debug("[ProductDetail] slug:", slug, "live:", !!initialProduct);
  }

  const variants = product.variants || [];

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    return variants[0] || null;
  });

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeAccordion, setActiveAccordion] = useState<string | null>("description");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [addedToBag, setAddedToBag] = useState(false);

  const thumbnailScrollRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const scrollThumbRef = useRef<HTMLDivElement>(null);

  // Sync selected variant when product details change
  useEffect(() => {
    if (variants.length > 0) {
      setSelectedVariant(variants[0]);
      setSelectedSize(null);
    }
  }, [product, variants]);

  const handleScroll = () => {
    if (thumbnailScrollRef.current && scrollThumbRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = thumbnailScrollRef.current;
      const trackHeight = scrollHeight - clientHeight;
      const progress = trackHeight > 0 ? (scrollTop / trackHeight) * 100 : 0;
      setScrollProgress(progress);
    }
  };

  const toggleAccordion = (id: string) => {
    setActiveAccordion(activeAccordion === id ? null : id);
  };

  // Prepend variant representative image to standard gallery for instant responsive visual update
  const gallery = useMemo(() => {
    const base = product.imageUrls || [];
    if (selectedVariant && selectedVariant.image && !base.includes(selectedVariant.image)) {
      return [selectedVariant.image, ...base];
    }
    return base;
  }, [product.imageUrls, selectedVariant]);

  const handleAddToBag = () => {
    if (!selectedSize) {
      alert("Please select a size");
      return;
    }
    const sizeObj = selectedVariant?.sizes.find((s) => s.id === selectedSize);
    if (!sizeObj || !selectedVariant) return;

    cart.addItem({
      sku: sizeObj.sku,
      name: product.title,
      image: selectedVariant.image || product.imageUrls[0] || "",
      variantLabel: `${selectedVariant.color} / ${sizeObj.label}`,
      quantity: 1,
      unitPrice: product.price,
    });

    setAddedToBag(true);
    setTimeout(() => setAddedToBag(false), 2000);
  };

  const activeSizes = selectedVariant ? selectedVariant.sizes : [];
  const selectedSizeObj = activeSizes.find((s) => s.id === selectedSize);

  return (
    <div className="flex flex-col gap-4">
      {/* Live BE data banner — visible only when the RSC parent
          actually fetched a product from /api/products/:id. */}
      {initialProduct ? (
        <div className="rounded-lg border border-store-border/60 bg-store-surface px-4 py-3 text-sm">
          <div className="font-semibold text-store-ink-strong">
            {product.title}
          </div>
          <div className="text-store-fg-subtle">
            {livePrice} · live from /api/products/{product._id}
          </div>
        </div>
      ) : null}

      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-store-fg-subtle">
        <Link href="/" className="hover:text-store-ink">
          Home
        </Link>
        <span>/</span>
        <Link href="/products" className="hover:text-store-ink">
          Products
        </Link>
        <span>/</span>
        <span className="text-store-ink-strong">
          {product.title}
        </span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
        {/* Left: Gallery */}
        <div className="relative flex-1 gallery flex gap-3 max-h-150">
          {/* Vertical Thumbnail Scroller (Desktop) */}
          <div className="hidden md:flex flex-col items-center justify-center w-20 shrink-0 absolute top-2/5 left-2 h-50 rounded-xl z-10">
            {/* Scrollbar Container */}
            <div className="flex-1 flex items-center justify-center p-4 my-3 relative rounded-full bg-store-ink">
              {/* Track */}
              <div
                ref={scrollTrackRef}
                className="w-2 h-35 bg-store-fg-muted rounded-full border relative "
              >
                {/* Thumb */}
                <div
                  ref={scrollThumbRef}
                  style={{
                    top: `${scrollProgress}%`,
                    transform: `translate(-50%, -${scrollProgress}%)`,
                  }}
                  className="thumbScroll absolute left-1/2 h-10 w-2 bg-store-paper rounded-full transition-transform duration-150 shadow-sm"
                />
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div
            ref={thumbnailScrollRef}
            onScroll={handleScroll}
            className="a grid grid-cols-1 md:grid-cols-2 gap-1.5 sm:gap-2 flex-1 overflow-auto scrollbar-hidden"
          >
            {gallery.map((src, i) => (
              <div key={i} className="relative aspect-2/3 bg-store-surface">
                <Image
                  height={800}
                  width={600}
                  src={src}
                  alt={`${product.title} ${i + 1}`}
                  className="min-h-full min-w-full object-cover transition-transform duration-500 hover:scale-101"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Product Info */}
        <div className="lg:w-95 xl:w-110 shrink-0">
          <div className="sticky top-24 space-y-8">
            {/* Promo Banner */}
            <div className="bg-store-surface-2 px-4 py-2 border-l-4 border-store-ink-strong">
              <p className="text-[11px] font-bold uppercase tracking-tight">
                Free standard delivery on orders over $100
              </p>
            </div>

            {/* Header */}
            <div className="space-y-1">
              <div className="flex items-start justify-between gap-4">
                <h1 className="text-3xl font-black uppercase italic leading-[0.9] tracking-tighter text-store-ink-strong xl:text-4xl">
                  {product.title}
                </h1>
                <button className="group rounded-full border border-store-border p-2.5 transition-colors hover:border-store-ink-strong">
                  <IconHeart className="size-6 text-store-ink transition-transform group-hover:scale-110" />
                </button>
              </div>
              <p className="text-sm font-medium text-store-fg-muted">
                {product.descTag || "Men's Training"} • {selectedVariant?.color || ""}
              </p>
              <p className="text-2xl font-black text-store-ink-strong pt-2">
                {formattedPrice}
              </p>
            </div>

            {/* Color Selection */}
            {variants.length > 0 && (
              <div className="space-y-3">
                <p className="text-[11px] font-black uppercase tracking-widest text-store-ink-strong">
                  Select Color:{" "}
                  <span className="font-medium text-store-fg-muted ml-1">
                    {selectedVariant?.color || ""}
                  </span>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {variants.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVariant(v);
                        setSelectedSize(null);
                      }}
                      className={`size-14 overflow-hidden rounded-md border-2 transition-all relative ${
                        selectedVariant?.id === v.id
                          ? "border-store-ink-strong ring-1 ring-store-ink-strong"
                          : "border-transparent opacity-80 hover:opacity-100 hover:border-store-border-strong"
                      }`}
                      title={v.color}
                    >
                      <Image
                        height={400}
                        width={400}
                        src={v.image}
                        alt={v.color}
                        className="h-full w-full object-cover"
                      />
                      {/* Optional Hex Color dot indicator to highlight curated color palette */}
                      <span
                        className="absolute bottom-1 right-1 size-2 rounded-full border border-store-paper"
                        style={{ backgroundColor: v.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selection */}
            {activeSizes.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-[11px] font-black uppercase tracking-widest text-store-ink-strong">
                    Select Size
                  </p>
                  <button className="text-[11px] font-bold uppercase tracking-widest underline underline-offset-4 hover:text-store-fg-muted">
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {activeSizes.map((size) => (
                    <button
                      key={size.id}
                      disabled={!size.inStock}
                      onClick={() => setSelectedSize(size.id)}
                      className={`flex h-12 items-center justify-center border text-sm font-bold uppercase transition-all duration-200 ${
                        selectedSize === size.id
                          ? "border-store-ink-strong bg-store-ink-strong text-store-paper"
                          : "border-store-border bg-store-paper hover:border-store-ink-strong"
                      } ${!size.inStock ? "relative overflow-hidden opacity-30 cursor-not-allowed bg-store-surface after:absolute after:h-px after:w-[120%] after:rotate-35 after:bg-store-fg-muted" : ""}`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4">
              <button
                onClick={handleAddToBag}
                disabled={activeSizes.length > 0 && !selectedSize}
                className={`w-full h-16 text-sm font-black uppercase tracking-[0.2em] transition-all rounded shadow-sm active:scale-[0.98] ${
                  addedToBag
                    ? "bg-green-600 hover:bg-green-700 text-white"
                    : activeSizes.length > 0 && !selectedSize
                    ? "bg-store-border text-store-fg-muted cursor-not-allowed"
                    : "bg-store-accent hover:bg-store-accent-hover text-store-on-accent"
                }`}
              >
                {addedToBag ? "Added!" : "Add to Bag"}
              </button>
              <div className="flex items-center justify-center gap-6 py-2 border-y border-store-border/50">
                <div className="flex items-center gap-2">
                  <div
                    className={`size-2 rounded-full animate-pulse ${
                      activeSizes.length > 0
                        ? selectedSize
                          ? selectedSizeObj?.inStock
                            ? "bg-green-500"
                            : "bg-red-500"
                          : "bg-green-500"
                        : "bg-red-500"
                    }`}
                  />
                  <span className="text-[11px] font-bold uppercase text-store-fg-muted">
                    {activeSizes.length > 0
                      ? selectedSize
                        ? selectedSizeObj?.inStock
                          ? "In stock"
                          : "Out of stock"
                        : "Select size"
                      : "Out of stock"}
                  </span>
                </div>
                <div className="h-4 w-px bg-store-border" />
                <span className="text-[11px] font-bold uppercase text-store-fg-muted">
                  Free Returns
                </span>
              </div>
            </div>

            {/* Accordions */}
            <div className="divide-y divide-store-border border-t border-store-border">
              {[
                {
                  id: "description",
                  title: "Product Features",
                  content: product.description || "",
                },
                {
                  id: "delivery",
                  title: "Delivery & Returns",
                  content:
                    "We offer free standard delivery on all orders over $100. Returns are free and easy within 30 days of purchase.",
                },
                {
                  id: "fabric",
                  title: "Composition & Care",
                  content:
                    "Premium heavyweight fabric. 95% Organic Cotton, 5% Elastane. Machine wash at 30°C. Do not tumble dry.",
                },
              ].map((item) => (
                <div key={item.id}>
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="flex w-full items-center justify-between py-5 text-left transition-colors hover:text-store-fg-muted"
                  >
                    <span className="text-xs font-black uppercase tracking-[0.15em] text-store-ink-strong">
                      {item.title}
                    </span>
                    <IconChevronDown
                      className={`size-5 transition-transform duration-300 ${
                        activeAccordion === item.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      activeAccordion === item.id
                        ? "grid-rows-[1fr] opacity-100 pb-6"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-sm leading-relaxed text-store-fg-muted">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

