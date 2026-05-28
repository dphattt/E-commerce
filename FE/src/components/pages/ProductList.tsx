"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ChevronLeft, 
  ChevronRight, 
  SlidersHorizontal, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Check
} from "lucide-react";
import { IconHeart } from "@/components/icons";

// Sizes definition from XS to 3XL
const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];

// Subcategories with thumbnail images
const SUBCATEGORIES = [
  {
    id: "all",
    name: "View All",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "shorts",
    name: "Men's Shorts",
    image: "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "workout-sets",
    name: "Workout Sets",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "joggers",
    name: "Men's Joggers",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=300&auto=format&fit=crop",
  },
  {
    id: "t-shirts",
    name: "T-Shirts",
    image: "https://cdn.shopify.com/s/files/1/1367/5207/files/images-GSxCBUMWashedGraphicT_ShirtGSSoftWhiteA4C4X_WCMY_1166_V1_3840x.jpg?v=1774351794",
  },
];

// Product Interface
interface ColorVariant {
  name: string;
  hex: string;
  images: [string, string]; // [primary, hover]
  sizesInStock: string[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  category: string; // matches subcategory ids: "shorts", "workout-sets", "joggers", "t-shirts"
  categoryLabel: string; // user-friendly label e.g., "Men's Shorts"
  rating: number;
  reviewsCount: number;
  isBestSeller?: boolean;
  isNew?: boolean;
  variants: ColorVariant[];
}

// 8 Robust gymwear products with rich variant options, sizes and images
const PRODUCTS_MOCK: Product[] = [
  {
    id: "prod-1",
    name: "Gymshark Power T-Shirt",
    price: 34,
    category: "t-shirts",
    categoryLabel: "T-Shirts",
    rating: 4.8,
    reviewsCount: 154,
    isBestSeller: true,
    variants: [
      {
        name: "Washed Black",
        hex: "#1c1c1e",
        images: [
          "https://cdn.shopify.com/s/files/1/1367/5207/files/images-GSxCBUMWashedGraphicT_ShirtGSSoftWhiteA4C4X_WCMY_1166_V1_3840x.jpg?v=1774351794",
          "https://cdn.shopify.com/s/files/1/1367/5207/files/images-GSxCBUMWashedGraphicT_ShirtGSSoftWhiteA4C4X_WCMY_1163_V1_3840x.jpg?v=1774351794"
        ],
        sizesInStock: ["XS", "S", "M", "L", "XXL"]
      },
      {
        name: "Soft White",
        hex: "#f4f4f5",
        images: [
          "https://cdn.shopify.com/s/files/1/1367/5207/files/images-GSxCBUMWashedGraphicT_ShirtGSSoftWhiteA4C4X_WCMY_1148_V1_3840x.jpg?v=1774351794",
          "https://cdn.shopify.com/s/files/1/1367/5207/files/images-GSxCBUMWashedGraphicT_ShirtGSSoftWhiteA4C4X_WCMY_1223_V1_3840x.jpg?v=1774351794"
        ],
        sizesInStock: ["S", "M", "L", "XL", "XXL", "3XL"]
      }
    ]
  },
  {
    id: "prod-2",
    name: "Apex Hybrid Shorts",
    price: 38,
    category: "shorts",
    categoryLabel: "Men's Shorts",
    rating: 4.9,
    reviewsCount: 89,
    isBestSeller: true,
    variants: [
      {
        name: "Charcoal Black",
        hex: "#27272a",
        images: [
          "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["S", "M", "L", "XL", "3XL"]
      },
      {
        name: "Sage Green",
        hex: "#8fa89b",
        images: [
          "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["XS", "M", "L", "XL", "XXL"]
      }
    ]
  },
  {
    id: "prod-3",
    name: "Arrival Drop-Arm Tank",
    price: 26,
    category: "t-shirts",
    categoryLabel: "T-Shirts",
    rating: 4.6,
    reviewsCount: 201,
    isNew: true,
    variants: [
      {
        name: "Slate Blue",
        hex: "#4b5563",
        images: [
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["XS", "S", "M", "L", "XL"]
      },
      {
        name: "Core Black",
        hex: "#09090b",
        images: [
          "https://images.unsplash.com/photo-1507398941214-572c25f4b1dc?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["M", "L", "XL", "XXL", "3XL"]
      }
    ]
  },
  {
    id: "prod-4",
    name: "Crest Slim Fit Joggers",
    price: 45,
    category: "joggers",
    categoryLabel: "Men's Joggers",
    rating: 4.7,
    reviewsCount: 312,
    isBestSeller: true,
    variants: [
      {
        name: "Grey Marl",
        hex: "#d1d5db",
        images: [
          "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["S", "M", "L", "XL", "XXL"]
      },
      {
        name: "Stealth Black",
        hex: "#18181b",
        images: [
          "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1556817411-31ae72fa3ea0?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["XS", "S", "M", "L", "3XL"]
      }
    ]
  },
  {
    id: "prod-5",
    name: "Legacy Graphic Hoodie",
    price: 52,
    category: "workout-sets",
    categoryLabel: "Workout Sets",
    rating: 4.8,
    reviewsCount: 76,
    isNew: true,
    variants: [
      {
        name: "Sage Green",
        hex: "#708076",
        images: [
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1605296867304-46d5465a25f1?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["S", "M", "L", "XL", "XXL"]
      },
      {
        name: "Cherry Red",
        hex: "#7f1d1d",
        images: [
          "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["XS", "S", "M", "L", "3XL"]
      }
    ]
  },
  {
    id: "prod-6",
    name: "Sport Sweat Jacket",
    price: 58,
    category: "workout-sets",
    categoryLabel: "Workout Sets",
    rating: 4.5,
    reviewsCount: 62,
    variants: [
      {
        name: "Deep Blue",
        hex: "#1e3a8a",
        images: [
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["M", "L", "XL", "XXL", "3XL"]
      },
      {
        name: "Gym Charcoal",
        hex: "#3f3f46",
        images: [
          "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["XS", "S", "M", "L", "XL"]
      }
    ]
  },
  {
    id: "prod-7",
    name: "Speed Athletic Shorts",
    price: 32,
    category: "shorts",
    categoryLabel: "Men's Shorts",
    rating: 4.7,
    reviewsCount: 114,
    variants: [
      {
        name: "Volt Yellow",
        hex: "#bef264",
        images: [
          "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1483721310020-03333e577076?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["S", "M", "L", "XL"]
      },
      {
        name: "Off Black",
        hex: "#242424",
        images: [
          "https://images.unsplash.com/photo-1483721310020-03333e577076?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["XS", "S", "M", "L", "XXL", "3XL"]
      }
    ]
  },
  {
    id: "prod-8",
    name: "Heavyweight Cargo Joggers",
    price: 48,
    category: "joggers",
    categoryLabel: "Men's Joggers",
    rating: 4.9,
    reviewsCount: 95,
    isNew: true,
    variants: [
      {
        name: "Olive Drab",
        hex: "#3f4238",
        images: [
          "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["M", "L", "XL", "XXL", "3XL"]
      },
      {
        name: "Stealth Black",
        hex: "#18181b",
        images: [
          "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=600&auto=format&fit=crop"
        ],
        sizesInStock: ["XS", "S", "M", "L", "XL"]
      }
    ]
  }
];

export function ProductList() {
  // --- States ---
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all");
  const [wishlist, setWishlist] = useState<Record<string, boolean>>({});
  
  // Filtering & Sorting
  const [sortOption, setSortOption] = useState<string>("popular");
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [isSortOpen, setIsSortOpen] = useState(true);
  const [isSizeFilterOpen, setIsSizeFilterOpen] = useState(true);
  const [isColorFilterOpen, setIsColorFilterOpen] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Active Variant tracking per product card
  const [activeVariants, setActiveVariants] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    PRODUCTS_MOCK.forEach(p => {
      initial[p.id] = 0; // default to first variant
    });
    return initial;
  });

  // Carousel ref and scroll
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      const currentScroll = carouselRef.current.scrollLeft;
      carouselRef.current.scrollTo({
        left: direction === "left" ? currentScroll - scrollAmount : currentScroll + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Toggle wishlist
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Switch product variant
  const handleVariantChange = (productId: string, variantIndex: number) => {
    setActiveVariants(prev => ({
      ...prev,
      [productId]: variantIndex
    }));
  };

  // Handle filters toggle
  const toggleSizeFilter = (size: string) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColorFilter = (colorName: string) => {
    setSelectedColors(prev => 
      prev.includes(colorName) ? prev.filter(c => c !== colorName) : [...prev, colorName]
    );
  };

  const clearAllFilters = () => {
    setSelectedSizes([]);
    setSelectedColors([]);
    setSelectedSubcategory("all");
    setSortOption("popular");
  };

  // Get active variant for a product
  const getProductActiveVariant = (product: Product) => {
    const activeIndex = activeVariants[product.id] ?? 0;
    return product.variants[activeIndex] || product.variants[0];
  };

  // --- Filtering & Sorting Logic ---
  const filteredProducts = PRODUCTS_MOCK.filter(product => {
    // 1. Subcategory filter
    if (selectedSubcategory !== "all" && product.category !== selectedSubcategory) {
      return false;
    }

    // 2. Size filter (check if ANY selected size is in stock for the ACTIVE variant)
    if (selectedSizes.length > 0) {
      const activeVariant = getProductActiveVariant(product);
      const hasSizeInStock = selectedSizes.some(size => 
        activeVariant.sizesInStock.includes(size)
      );
      if (!hasSizeInStock) return false;
    }

    // 3. Color filter (check if product has variant that matches the selected color)
    if (selectedColors.length > 0) {
      const hasColor = product.variants.some(v => 
        selectedColors.some(selectedColor => 
          v.name.toLowerCase().includes(selectedColor.toLowerCase())
        )
      );
      if (!hasColor) return false;
    }

    return true;
  }).sort((a, b) => {
    // Sorting logic
    if (sortOption === "low-to-high") {
      return a.price - b.price;
    }
    if (sortOption === "high-to-low") {
      return b.price - a.price;
    }
    if (sortOption === "rating") {
      return b.rating - a.rating;
    }
    // Default / "popular" (reviews count & rating)
    return b.reviewsCount * b.rating - a.reviewsCount * a.rating;
  });

  return (
    <div className="flex flex-col gap-6 w-full animate-fade-in">
      {/* Top Banner Info */}
      <div className="flex flex-col gap-2 pt-2 border-b border-store-border pb-6 sm:pb-8">
        <span className="text-[10px] font-black uppercase tracking-widest text-store-ink-strong">
          MENS
        </span>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-black uppercase italic leading-[0.9] tracking-tighter text-store-ink-strong"
            style={{ fontStretch: "condensed" }}
          >
            BEST SELLERS
          </h1>
          <span className="text-xs sm:text-sm font-medium text-store-fg-muted shrink-0 bg-store-surface px-3 py-1.5 rounded-full border border-store-border/50">
            {filteredProducts.length} Products
          </span>
        </div>
        <p className="max-w-2xl text-sm sm:text-base leading-relaxed text-store-fg-muted mt-2 font-medium">
          Our community loves them, so will you. The perfect 2026 styles you&#39;ll be throwing on for every workout.
        </p>
      </div>

      {/* Subcategories Horizontal Scroller */}
      <div className="relative group/scroller border-b border-store-border pb-6">
        {/* Navigation buttons */}
        <div className="absolute right-0 -top-12 flex gap-1.5 z-10">
          <button
            onClick={() => scrollCarousel("left")}
            className="flex items-center justify-center size-8 rounded-full border border-store-border bg-store-paper text-store-ink hover:border-store-ink-strong active:scale-95 transition-all shadow-sm"
            aria-label="Scroll category list left"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            onClick={() => scrollCarousel("right")}
            className="flex items-center justify-center size-8 rounded-full border border-store-border bg-store-paper text-store-ink hover:border-store-ink-strong active:scale-95 transition-all shadow-sm"
            aria-label="Scroll category list right"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        {/* Carousel Content */}
        <div
          ref={carouselRef}
          className="a flex gap-4 overflow-x-auto py-1 scroll-smooth scrollbar-hidden select-none pr-12"
        >
          {SUBCATEGORIES.map((sub) => {
            const isActive = selectedSubcategory === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubcategory(sub.id)}
                className={`flex items-center border p-2 gap-4 rounded-xl min-w-[210px] text-left shrink-0 transition-all duration-300 ${
                  isActive
                    ? "border-store-ink-strong bg-store-ink-strong text-store-paper shadow-md ring-1 ring-store-ink-strong"
                    : "border-store-border bg-store-paper text-store-ink hover:border-store-border-strong hover:bg-store-surface-2"
                }`}
              >
                <div className="relative size-14 rounded-lg overflow-hidden shrink-0 bg-store-surface shadow-inner">
                  <Image
                    src={sub.image}
                    alt={sub.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="font-black text-xs uppercase tracking-wider">
                    {sub.name}
                  </span>
                  <span className={`text-[10px] ${isActive ? "text-store-fg-subtle" : "text-store-fg-muted"}`}>
                    Gymshark Mens
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid & Filter Layout */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Mobile Filter Sticky Button */}
        <div className="w-full lg:hidden flex gap-2 sticky top-20 z-20 bg-store-paper/95 backdrop-blur-md py-2 border-b border-store-border">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 flex items-center justify-center gap-2 h-11 border border-store-border bg-store-paper rounded-lg text-sm font-bold uppercase tracking-wider hover:border-store-ink-strong transition-colors"
          >
            <SlidersHorizontal className="size-4" />
            Filters & Sort
            {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedSubcategory !== "all") && (
              <span className="flex items-center justify-center size-5 rounded-full bg-store-ink-strong text-store-paper text-[10px] font-black">
                {selectedSizes.length + selectedColors.length + (selectedSubcategory !== "all" ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Sidebar Filter Panel (Desktop) */}
        <aside className="hidden lg:flex flex-col gap-6 w-64 shrink-0 sticky top-24 max-h-[80vh] overflow-y-auto pr-2 scrollbar-hidden">
          <div className="flex items-center justify-between border-b border-store-border pb-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-store-ink-strong flex items-center gap-2">
              <SlidersHorizontal className="size-3.5" />
              Filter & Sort
            </h2>
            {(selectedSizes.length > 0 || selectedColors.length > 0 || selectedSubcategory !== "all" || sortOption !== "popular") && (
              <button
                onClick={clearAllFilters}
                className="text-[10px] font-bold uppercase tracking-wider underline underline-offset-2 text-store-fg-muted hover:text-store-ink-strong transition-colors"
              >
                Clear All
              </button>
            )}
          </div>

          {/* Sort By Collapsible */}
          <div className="border-b border-store-border pb-4">
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="flex w-full items-center justify-between py-2 text-left font-black text-xs uppercase tracking-widest text-store-ink-strong hover:text-store-fg-muted transition-colors"
            >
              <span>Sort By</span>
              {isSortOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>
            
            <div className={`mt-2 flex flex-col gap-2 transition-all duration-300 origin-top overflow-hidden ${isSortOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
              {[
                { id: "popular", label: "Most Popular" },
                { id: "low-to-high", label: "Price: Low to High" },
                { id: "high-to-low", label: "Price: High to Low" },
                { id: "rating", label: "Highest Rated" }
              ].map((opt) => (
                <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer text-xs font-bold text-store-fg-muted hover:text-store-ink-strong transition-colors py-1 group">
                  <input
                    type="radio"
                    name="sortOption"
                    value={opt.id}
                    checked={sortOption === opt.id}
                    onChange={() => setSortOption(opt.id)}
                    className="size-4 rounded-full border border-store-border checked:border-store-ink-strong checked:bg-store-ink-strong focus:outline-none transition-all accent-store-ink cursor-pointer"
                  />
                  <span className={`${sortOption === opt.id ? "text-store-ink-strong font-black" : ""}`}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Filter by Size (XS to 3XL) */}
          <div className="border-b border-store-border pb-5">
            <button
              onClick={() => setIsSizeFilterOpen(!isSizeFilterOpen)}
              className="flex w-full items-center justify-between py-2 text-left font-black text-xs uppercase tracking-widest text-store-ink-strong hover:text-store-fg-muted transition-colors"
            >
              <span>Size</span>
              {isSizeFilterOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>

            <div className={`mt-3 transition-all duration-300 origin-top overflow-hidden ${isSizeFilterOpen ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="grid grid-cols-4 gap-1.5">
                {ALL_SIZES.map((size) => {
                  const isChecked = selectedSizes.includes(size);
                  return (
                    <button
                      key={size}
                      onClick={() => toggleSizeFilter(size)}
                      className={`h-9 text-[11px] font-black rounded-md border flex items-center justify-center transition-all ${
                        isChecked
                          ? "border-store-ink-strong bg-store-ink-strong text-store-paper shadow-sm"
                          : "border-store-border bg-store-paper text-store-fg-muted hover:border-store-border-strong hover:text-store-ink-strong"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Filter by Color Swatches */}
          <div className="border-b border-store-border pb-5">
            <button
              onClick={() => setIsColorFilterOpen(!isColorFilterOpen)}
              className="flex w-full items-center justify-between py-2 text-left font-black text-xs uppercase tracking-widest text-store-ink-strong hover:text-store-fg-muted transition-colors"
            >
              <span>Color</span>
              {isColorFilterOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
            </button>

            <div className={`mt-3 transition-all duration-300 origin-top overflow-hidden ${isColorFilterOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"}`}>
              <div className="flex flex-wrap gap-2">
                {[
                  { name: "Black", hex: "#18181b" },
                  { name: "White", hex: "#f4f4f5" },
                  { name: "Grey", hex: "#9ca3af" },
                  { name: "Green", hex: "#6b8e23" },
                  { name: "Blue", hex: "#2563eb" },
                  { name: "Red", hex: "#dc2626" }
                ].map((color) => {
                  const isChecked = selectedColors.includes(color.name);
                  const isWhite = color.name === "White";
                  return (
                    <button
                      key={color.name}
                      onClick={() => toggleColorFilter(color.name)}
                      className={`size-8 rounded-full border relative flex items-center justify-center transition-all ${
                        isChecked 
                          ? "ring-2 ring-store-ink-strong ring-offset-2 scale-110" 
                          : "hover:scale-105 border-store-border"
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    >
                      {isChecked && (
                        <Check className={`size-3.5 ${isWhite ? "text-black" : "text-white"}`} strokeWidth={3} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid (Right) */}
        <div className="flex-1 w-full">
          {filteredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center gap-4 bg-store-surface-2 rounded-2xl border border-dashed border-store-border/80 w-full">
              <span className="text-3xl">🏜️</span>
              <p className="text-base font-bold text-store-ink-strong uppercase tracking-wider">No Products Found</p>
              <p className="text-xs text-store-fg-muted max-w-sm">We couldn&#39;t find any products matching your filters. Try checking different options or clearing all filters.</p>
              <button
                onClick={clearAllFilters}
                className="mt-2 bg-store-ink-strong text-store-paper px-6 py-2.5 text-xs font-black uppercase tracking-wider rounded-lg hover:bg-store-ink active:scale-95 transition-all shadow-sm"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-y-10 gap-x-6 w-full">
              {filteredProducts.map((product) => {
                const activeIndex = activeVariants[product.id] ?? 0;
                const activeVariant = product.variants[activeIndex] || product.variants[0];
                const isWishlisted = wishlist[product.id] ?? false;

                return (
                  <article key={product.id} className="flex flex-col gap-3 group relative cursor-pointer">
                    {/* Image Box */}
                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-store-surface rounded-2xl border border-store-border/40 shadow-sm">
                      {/* BestSeller / New Tag */}
                      {product.isBestSeller && (
                        <span className="absolute top-3 left-3 z-10 bg-store-ink-strong text-store-paper text-[9px] font-black uppercase px-2 py-1 tracking-widest rounded-md shadow-sm">
                          Best Seller
                        </span>
                      )}
                      {product.isNew && !product.isBestSeller && (
                        <span className="absolute top-3 left-3 z-10 bg-store-accent text-store-on-accent text-[9px] font-black uppercase px-2 py-1 tracking-widest rounded-md shadow-sm">
                          New
                        </span>
                      )}

                      {/* Wishlist Button Overlay */}
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          toggleWishlist(product.id);
                        }}
                        className="absolute top-3 right-3 z-10 flex items-center justify-center size-9 rounded-full bg-store-paper hover:scale-105 active:scale-95 transition-all shadow-md group/wish cursor-pointer"
                        aria-label="Add to Wishlist"
                      >
                        <IconHeart 
                          className={`size-5 transition-colors ${
                            isWishlisted 
                              ? "fill-red-500 stroke-red-500 text-red-500 scale-110" 
                              : "text-store-ink hover:text-red-500"
                          }`} 
                        />
                      </button>

                      {/* Dynamic Primary/Hover Image Swap */}
                      <Link href={`/products/${product.id}`} className="absolute inset-0 block group">
                        {/* Primary Image (Fades out & zooms on hover) */}
                        <div className="relative w-full h-full transition-opacity duration-500 ease-out group-hover:opacity-0">
                          <Image
                            src={activeVariant.images[0]}
                            alt={product.name}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                            priority={product.isBestSeller}
                          />
                        </div>
                        
                        {/* Secondary Image (Fades in & zooms down on hover) */}
                        <div className="absolute inset-0 w-full h-full opacity-0 transition-opacity duration-500 ease-out group-hover:opacity-100">
                          <Image
                            src={activeVariant.images[1]}
                            alt={`${product.name} Hover`}
                            fill
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            className="object-cover scale-95 transition-transform duration-700 ease-out group-hover:scale-100"
                          />
                        </div>
                      </Link>
                    </div>

                    {/* Product Details Section */}
                    <div className="flex flex-col gap-1.5 px-1">
                      {/* Category Label */}
                      <span className="text-[10px] font-bold text-store-fg-muted uppercase tracking-wider">
                        {product.categoryLabel}
                      </span>

                      {/* Name & Price Row */}
                      <div className="flex items-start justify-between gap-4">
                        <Link href={`/products/${product.id}`} className="hover:underline">
                          <h3 className="font-black text-sm uppercase text-store-ink-strong tracking-tight line-clamp-1 leading-snug">
                            {product.name}
                          </h3>
                        </Link>
                        <span className="font-black text-sm text-store-ink-strong shrink-0">
                          ${product.price}
                        </span>
                      </div>

                      {/* Color Option Dot Selectors */}
                      <div className="flex gap-1.5 py-0.5 items-center">
                        {product.variants.map((v, idx) => {
                          const isActive = idx === activeIndex;
                          return (
                            <button
                              key={v.name}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleVariantChange(product.id, idx);
                              }}
                              className={`size-4.5 rounded-full border transition-all ${
                                isActive 
                                  ? "ring-1.5 ring-store-ink-strong ring-offset-1.5 scale-110" 
                                  : "hover:scale-105 border-store-border/80"
                              }`}
                              style={{ backgroundColor: v.hex }}
                              title={v.name}
                            />
                          );
                        })}
                        <span className="text-[9px] font-semibold text-store-fg-muted ml-1.5">
                          {activeVariant.name}
                        </span>
                      </div>

                      {/* Sizes Displays: XS to 3XL (Hiển thị dải size) */}
                      <div className="flex flex-col gap-1 mt-1 border-t border-store-border/40 pt-2.5">
                        <span className="text-[9px] font-black uppercase tracking-wider text-store-fg-muted">
                          Available Sizes
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {ALL_SIZES.map((size) => {
                            const isInStock = activeVariant.sizesInStock.includes(size);
                            return (
                              <span
                                key={size}
                                className={`text-[9px] font-black px-1.5 py-0.5 rounded border transition-all ${
                                  isInStock
                                    ? "bg-store-surface text-store-ink-strong border-store-border font-bold shadow-2xs"
                                    : "bg-store-paper/30 text-store-fg-subtle border-store-border/20 line-through opacity-30 select-none"
                                }`}
                                title={isInStock ? `Size ${size} in stock` : `Size ${size} out of stock`}
                              >
                                {size}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer Overlay */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden">
          {/* Backdrop */}
          <button
            onClick={() => setMobileFilterOpen(false)}
            className="absolute inset-0 bg-store-ink/40 backdrop-blur-xs w-full h-full text-left"
            aria-label="Close filters"
          />
          {/* Drawer container */}
          <div className="relative w-full max-w-[340px] h-full bg-store-paper shadow-2xl flex flex-col p-5 z-10 animate-slide-in">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-store-border pb-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-store-ink-strong flex items-center gap-2">
                <SlidersHorizontal className="size-4" />
                Filters
              </h2>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1 rounded-md hover:bg-store-surface"
                aria-label="Close menu"
              >
                <X className="size-5 text-store-ink" />
              </button>
            </div>

            {/* Filter Content */}
            <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-6 scrollbar-hidden">
              {/* Sort Options */}
              <div className="border-b border-store-border pb-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-store-ink-strong mb-3">Sort By</h3>
                <div className="flex flex-col gap-2.5">
                  {[
                    { id: "popular", label: "Most Popular" },
                    { id: "low-to-high", label: "Price: Low to High" },
                    { id: "high-to-low", label: "Price: High to Low" },
                    { id: "rating", label: "Highest Rated" }
                  ].map((opt) => (
                    <label key={opt.id} className="flex items-center gap-3.5 py-1 group cursor-pointer text-xs font-bold text-store-fg-muted hover:text-store-ink-strong">
                      <input
                        type="radio"
                        name="sortOptionMobile"
                        value={opt.id}
                        checked={sortOption === opt.id}
                        onChange={() => setSortOption(opt.id)}
                        className="size-4.5 rounded-full border border-store-border checked:border-store-ink-strong checked:bg-store-ink-strong focus:outline-none transition-all accent-store-ink cursor-pointer"
                      />
                      <span className={sortOption === opt.id ? "text-store-ink-strong font-black" : ""}>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="border-b border-store-border pb-4">
                <h3 className="font-black text-xs uppercase tracking-widest text-store-ink-strong mb-3">Sizes</h3>
                <div className="grid grid-cols-4 gap-1.5">
                  {ALL_SIZES.map((size) => {
                    const isChecked = selectedSizes.includes(size);
                    return (
                      <button
                        key={size}
                        onClick={() => toggleSizeFilter(size)}
                        className={`h-9 text-[11px] font-black rounded-md border flex items-center justify-center transition-all ${
                          isChecked
                            ? "border-store-ink-strong bg-store-ink-strong text-store-paper shadow-sm"
                            : "border-store-border bg-store-paper text-store-fg-muted hover:border-store-border-strong hover:text-store-ink-strong"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Colors */}
              <div>
                <h3 className="font-black text-xs uppercase tracking-widest text-store-ink-strong mb-3">Colors</h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    { name: "Black", hex: "#18181b" },
                    { name: "White", hex: "#f4f4f5" },
                    { name: "Grey", hex: "#9ca3af" },
                    { name: "Green", hex: "#6b8e23" },
                    { name: "Blue", hex: "#2563eb" },
                    { name: "Red", hex: "#dc2626" }
                  ].map((color) => {
                    const isChecked = selectedColors.includes(color.name);
                    const isWhite = color.name === "White";
                    return (
                      <button
                        key={color.name}
                        onClick={() => toggleColorFilter(color.name)}
                        className={`size-9 rounded-full border relative flex items-center justify-center transition-all ${
                          isChecked 
                            ? "ring-2 ring-store-ink-strong ring-offset-2 scale-110" 
                            : "hover:scale-105 border-store-border"
                        }`}
                        style={{ backgroundColor: color.hex }}
                        title={color.name}
                      >
                        {isChecked && (
                          <Check className={`size-4.5 ${isWhite ? "text-black" : "text-white"}`} strokeWidth={3} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer buttons */}
            <div className="border-t border-store-border pt-4 flex gap-3">
              <button
                onClick={clearAllFilters}
                className="flex-1 h-11 border border-store-border bg-store-paper text-[11px] font-black uppercase tracking-wider rounded-lg hover:border-store-ink-strong active:scale-95 transition-all text-center"
              >
                Clear All
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 h-11 bg-store-ink-strong text-store-paper text-[11px] font-black uppercase tracking-wider rounded-lg hover:bg-store-ink active:scale-95 transition-all shadow-md text-center"
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
