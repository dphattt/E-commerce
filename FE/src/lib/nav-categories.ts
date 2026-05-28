import type { NavItem } from "@/types/nav";

export interface Category {
  name: string;
  slug: string;
  level: number;
  parentSlug: string | null;
  path: string;
  pathSegments: string[];
  productCount: number;
}

/** Map top-level category slugs to the nav label + href */
const TOP_LEVEL_MAP: Record<string, { label: string; href: string }> = {
  womens: { label: "Women", href: "/women" },
  mens: { label: "Men", href: "/men" },
  unisex: { label: "Accessories", href: "/accessories" },
};

/** Static Explore nav item — not driven by categories */
const EXPLORE_ITEM: NavItem = {
  label: "Explore",
  href: "/explore",
  subItems: [
    { label: "Women's Guides", href: "/explore/womens-guides" },
    { label: "Men's Guides", href: "/explore/mens-guides" },
    { label: "Blog", href: "/explore/blog" },
    { label: "Training", href: "/explore/training" },
  ],
};

/**
 * Build SiteHeader nav items from a flat categories list.
 * Top-level nav = level-0 slugs in TOP_LEVEL_MAP.
 * Sub-items     = level-2 categories whose pathSegments[0] matches the top-level name.
 */
export function buildNavFromCategories(categories: Category[]): NavItem[] {
  const navItems: NavItem[] = [];

  for (const [topSlug, mapping] of Object.entries(TOP_LEVEL_MAP)) {
    const topCat = categories.find((c) => c.slug === topSlug);
    if (!topCat) continue;

    const subItems = categories
      .filter(
        (c) =>
          c.level === 2 &&
          c.pathSegments[0] === topCat.name &&
          c.productCount > 0,
      )
      .map((sub) => {
        const children = categories
          .filter(
            (c) =>
              c.level === 3 &&
              c.parentSlug === sub.slug &&
              c.productCount > 0,
          )
          .map((child) => ({
            label: child.name,
            href: `/categories/${child.slug}`,
          }));

        return {
          label: sub.name,
          href: `/categories/${sub.slug}`,
          ...(children.length > 0 && { children }),
        };
      });

    navItems.push({ label: mapping.label, href: mapping.href, subItems });
  }

  navItems.push(EXPLORE_ITEM);
  return navItems;
}

/** Server-side fetch — safe to call in Next.js Server Components / layouts */
export async function fetchNavItems(): Promise<NavItem[]> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_API ?? "http://localhost:3001";

  try {
    const res = await fetch(`${baseUrl}/api/categories`, {
      next: { revalidate: 3600 }, // re-validate every hour
    });

    if (!res.ok) throw new Error(`categories API ${res.status}`);

    const { categories }: { categories: Category[] } = await res.json();
    return buildNavFromCategories(categories);
  } catch (err) {
    console.warn("[nav] Could not fetch categories, using component defaults:", err);
    return [];
  }
}
