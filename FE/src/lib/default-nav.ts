import type { NavItem } from "@/types/nav";

/** Fallback navigation when categories API is unavailable or incomplete. */
export const DEFAULT_NAV: NavItem[] = [
  {
    label: "Women",
    href: "/women",
    subItems: [
      {
        label: "Trending",
        href: "/women/trending",
        children: [
          { label: "New Product Drops", href: "/women/trending/new-drops" },
          { label: "Best Sellers", href: "/women/trending/best-sellers" },
          { label: "Form | Now Live", href: "/women/trending/form-now-live" },
          { label: "Everyday Seamless", href: "/women/trending/everyday-seamless" },
          { label: "Spring Looks", href: "/women/trending/spring-looks" },
          { label: "Pilates", href: "/women/trending/pilates" },
        ],
      },
      {
        label: "Leggings",
        href: "/women/leggings",
        children: [
          { label: "All Leggings", href: "/women/leggings/all" },
          { label: "Full Length", href: "/women/leggings/full-length" },
          { label: "High Waisted", href: "/women/leggings/high-waisted" },
          { label: "Seamless Leggings", href: "/women/leggings/seamless" },
        ],
      },
      {
        label: "Products",
        href: "/women/products",
        children: [
          { label: "All Products", href: "/women/products/all" },
          { label: "Sports Bras", href: "/women/products/sports-bras" },
          { label: "Shorts", href: "/women/products/shorts" },
          { label: "Pullovers", href: "/women/products/pullovers" },
          { label: "SS Tops", href: "/women/products/ss-tops" },
        ],
      },
      {
        label: "Accessories",
        href: "/women/accessories",
        children: [
          { label: "All Accessories", href: "/women/accessories/all" },
          { label: "Socks", href: "/women/accessories/socks" },
          { label: "Headwear", href: "/women/accessories/headwear" },
          { label: "Bags", href: "/women/accessories/bags" },
        ],
      },
      { label: "Last Chance", href: "/women/last-chance" },
      { label: "Explore", href: "/women/explore" },
    ],
  },
  {
    label: "Men",
    href: "/men",
    subItems: [
      {
        label: "Trending",
        href: "/men/trending",
        children: [
          { label: "New Product Drops", href: "/men/trending/new-drops" },
          { label: "Best Sellers", href: "/men/trending/best-sellers" },
          { label: "Shorts", href: "/men/trending/shorts" },
          { label: "Running", href: "/men/trending/running" },
        ],
      },
      {
        label: "T-Shirts & Tops",
        href: "/men/tops",
        children: [
          { label: "T-Shirts & Tops", href: "/men/tops/all" },
          { label: "Tank Tops", href: "/men/tops/tanks" },
          { label: "Oversized T-Shirts", href: "/men/tops/oversized" },
          { label: "Long Sleeve Tops", href: "/men/tops/long-sleeve" },
        ],
      },
      {
        label: "Products",
        href: "/men/products",
        children: [
          { label: "All Products", href: "/men/products/all" },
          { label: "Shorts", href: "/men/products/shorts" },
          { label: "Joggers", href: "/men/products/joggers" },
          { label: "Pullovers", href: "/men/products/pullovers" },
        ],
      },
      {
        label: "Accessories",
        href: "/men/accessories",
        children: [
          { label: "All Accessories", href: "/men/accessories/all" },
          { label: "Bags", href: "/men/accessories/bags" },
          { label: "Socks", href: "/men/accessories/socks" },
        ],
      },
      { label: "Last Chance", href: "/men/last-chance" },
      { label: "Explore", href: "/men/explore" },
    ],
  },
  {
    label: "Accessories",
    href: "/accessories",
    subItems: [
      {
        label: "Trending",
        href: "/accessories/trending",
        children: [
          { label: "New Product Drops", href: "/accessories/trending/new-drops" },
          { label: "Best Sellers", href: "/accessories/trending/best-sellers" },
          { label: "Seasonal Accessories", href: "/accessories/trending/seasonal" },
        ],
      },
      {
        label: "Bags",
        href: "/accessories/bags",
        children: [
          { label: "All Bags", href: "/accessories/bags/all" },
          { label: "Backpacks", href: "/accessories/bags/backpacks" },
          { label: "Holdalls", href: "/accessories/bags/holdalls" },
        ],
      },
      { label: "Equipment", href: "/accessories/equipment" },
      {
        label: "Socks",
        href: "/accessories/socks",
        children: [
          { label: "All Socks", href: "/accessories/socks/all" },
          { label: "Crew Socks", href: "/accessories/socks/crew" },
          { label: "Ankle Socks", href: "/accessories/socks/ankle" },
        ],
      },
      {
        label: "Headwear",
        href: "/accessories/headwear",
        children: [
          { label: "All Headwear", href: "/accessories/headwear/all" },
          { label: "Caps", href: "/accessories/headwear/caps" },
          { label: "Headbands", href: "/accessories/headwear/headbands" },
        ],
      },
      { label: "Last Chance", href: "/accessories/last-chance" },
    ],
  },
  {
    label: "Explore",
    href: "/explore",
    subItems: [
      {
        label: "Women's Guides",
        href: "/explore/womens-guides",
        children: [
          { label: "Leggings Guide", href: "/explore/womens-guides/leggings" },
          { label: "Sports Bra Guide", href: "/explore/womens-guides/sports-bras" },
          { label: "Running Guide", href: "/explore/womens-guides/running" },
        ],
      },
      {
        label: "Men's Guides",
        href: "/explore/mens-guides",
        children: [
          { label: "Shorts Guide", href: "/explore/mens-guides/shorts" },
          { label: "Running Guide", href: "/explore/mens-guides/running" },
        ],
      },
      { label: "Women's Clothing", href: "/explore/womens-clothing" },
      { label: "Men's Clothing", href: "/explore/mens-clothing" },
      { label: "Find Out More", href: "/explore/about" },
    ],
  },
];
