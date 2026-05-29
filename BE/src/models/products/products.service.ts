import { httpError } from "@/utils/http-error";
import * as productsRepo from "@/models/products/products.repository";
import Category from "@/models/categories/Category.model";

// Maps level-0 nav names to the product category gender tag
const GENDER_MAP: Record<string, string> = {
  Women: "Womens",
  Men: "Mens",
  Accessories: "Unisex",
};

// Nav-only section labels that don't correspond to product category names
const NAV_ONLY_LABELS = new Set([
  "Products",
  "Trending",
  "Last Chance",
  "Explore",
  "Equipment",
  "T-Shirts & Tops",
  "Underwear",
]);

// Patterns that are editorial/curated — not product category names
const EDITORIAL_PATTERN =
  /^(All\s|New Product Drops|Best Sellers|Spring Looks|Seasonal|Pilates|Running|Lifting|For Less|Accessories For Less|New to Gymshark)/i;

function pathSegmentsToProductFilter(segments: string[]): string[] {
  if (!segments.length) return [];

  const filters: string[] = [];

  // First segment is always the gender/top-level
  const gender = GENDER_MAP[segments[0]];
  if (gender) filters.push(gender);

  for (const seg of segments.slice(1)) {
    if (EDITORIAL_PATTERN.test(seg)) continue;
    if (/\bGuide\b/i.test(seg)) continue;
    if (seg.endsWith("?")) continue;
    if (NAV_ONLY_LABELS.has(seg)) continue;
    filters.push(seg);
  }

  return filters;
}

export async function listRecentProducts(limit = 10) {
  return productsRepo.findRecentProducts(limit);
}

export async function listProductsByCategory(
  categorySlug: string,
  limit: number,
  skip: number,
) {
  const category = await Category.findOne({ slug: categorySlug }).lean();
  const filters = category
    ? pathSegmentsToProductFilter(category.pathSegments)
    : [];

  const [products, total] = await Promise.all([
    productsRepo.findProductsByCategories(filters, limit, skip),
    productsRepo.countProductsByCategories(filters),
  ]);

  return { products, total, filters };
}

export async function getProductById(id: string) {
  const product = await productsRepo.findProductById(id);
  if (!product) throw httpError("Product not found", 404);
  return product;
}
