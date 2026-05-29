import { isValidObjectId } from "mongoose";
import Product from "@/models/products/Product.model";
import ProductVariant, {
  type IProductVariant,
} from "@/models/products/ProductVariant.model";

/**
 * Lean read for the cart pricing flow. Returns null when no active
 * variant matches the SKU.
 */
export async function findActiveVariantBySku(
  sku: string,
): Promise<Pick<IProductVariant, "sku" | "price"> | null> {
  return ProductVariant.findOne({ sku, isActive: true })
    .select("sku price")
    .lean();
}

/**
 * Recent products for the catalog landing.
 */
export async function findRecentProducts(limit: number) {
  return Product.find().sort({ createdAt: -1 }).limit(limit).lean();
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildCategoryQuery(categoryFilters: string[]) {
  if (!categoryFilters.length) return {};
  return {
    $and: categoryFilters.map((f) => ({
      categories: new RegExp(`^${escapeRegex(f)}$`, "i"),
    })),
  };
}

export async function findProductsByCategories(
  categoryFilters: string[],
  limit: number,
  skip: number,
) {
  const query = buildCategoryQuery(categoryFilters);
  return Product.find(query)
    .sort({ scrapedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
}

export async function countProductsByCategories(categoryFilters: string[]) {
  const query = buildCategoryQuery(categoryFilters);
  return Product.countDocuments(query);
}

/**
 * Look a single product up by Mongo _id. Returns null when the id is
 * malformed or no doc matches, so callers can produce a 404 without
 * a try/catch around CastErrors.
 */
export async function findProductById(id: string) {
  if (!isValidObjectId(id)) return null;
  return Product.findById(id).lean();
}

/**
 * Look a single product up by its scraped sourceUrl. Useful when the
 * FE only has the unique URL of the source page (e.g. linked from
 * external content).
 */
export async function findProductBySourceUrl(sourceUrl: string) {
  return Product.findOne({ sourceUrl }).lean();
}
