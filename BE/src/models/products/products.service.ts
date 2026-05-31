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

import ProductVariant from "@/models/products/ProductVariant.model";
import mongoose from "mongoose";

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function getProductById(id: string) {
  const product = await productsRepo.findProductById(id);
  if (!product) throw httpError("Product not found", 404);

  // 1. Get all active variants for this product using its sourceUrl
  const variants = await ProductVariant.find({
    productSourceUrl: product.sourceUrl,
    isActive: true,
  }).lean();

  // 2. Fetch inventory for these variants' SKUs
  const skus = variants.map((v) => v.sku);
  const db = mongoose.connection.db;
  const inventoryItems = db
    ? await db.collection("inventory").find({ sku: { $in: skus } }).toArray()
    : [];
  const inventoryMap = new Map(inventoryItems.map((item) => [item.sku, item]));

  // 3. Fetch color metadata (hex values) from 'colors' collection
  const colorSlugs = [...new Set(variants.map((v) => v.color).filter(Boolean))];
  const colors = db
    ? await db.collection("colors").find({ slug: { $in: colorSlugs } }).toArray()
    : [];
  const colorMap = new Map(colors.map((c) => [c.slug, c]));

  // 4. Fetch size metadata (order) from 'sizes' collection
  const sizeSlugs = [...new Set(variants.map((v) => v.size).filter(Boolean))];
  const sizes = db
    ? await db.collection("sizes").find({ slug: { $in: sizeSlugs } }).toArray()
    : [];
  const sizeMap = new Map(sizes.map((s) => [s.slug, s]));

  // 5. Structure variants by color
  const colorVariantsMap = new Map<string, {
    id: string;
    color: string;
    image: string;
    hex: string;
    sizes: Array<{
      id: string;
      label: string;
      inStock: boolean;
      sku: string;
    }>;
  }>();

  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  for (const v of variants) {
    const colorSlug = v.color || "default";
    const sizeSlug = v.size || "one-size";

    const colorDoc = colorMap.get(colorSlug);
    const sizeDoc = sizeMap.get(sizeSlug);

    const inventoryDoc = inventoryMap.get(v.sku);
    const inStock = inventoryDoc
      ? (inventoryDoc.status !== "out_of_stock" && (inventoryDoc.quantity - inventoryDoc.reserved) > 0)
      : false;

    if (!colorVariantsMap.has(colorSlug)) {
      let colorImage = product.imageUrls[0] || "";

      if (db) {
        const familyName = product.title.split("–")[0].split("-")[0].trim();
        const matchingProduct = await db.collection("products").findOne({
          title: { $regex: new RegExp(escapeRegex(familyName), "i") },
          $or: [
            { title: { $regex: new RegExp(`\\b${escapeRegex(colorSlug)}\\b`, "i") } },
            { sourceUrl: { $regex: new RegExp(escapeRegex(colorSlug), "i") } }
          ]
        });
        if (matchingProduct && matchingProduct.imageUrls?.[0]) {
          colorImage = matchingProduct.imageUrls[0];
        }
      }

      colorVariantsMap.set(colorSlug, {
        id: colorSlug,
        color: colorDoc?.name || capitalize(colorSlug),
        image: colorImage,
        hex: colorDoc?.hex || "#CCCCCC",
        sizes: [],
      });
    }

    const colorVariant = colorVariantsMap.get(colorSlug)!;
    colorVariant.sizes.push({
      id: sizeSlug,
      label: sizeDoc?.name || sizeSlug.toUpperCase(),
      inStock,
      sku: v.sku,
    });
  }

  for (const cv of colorVariantsMap.values()) {
    cv.sizes.sort((a, b) => {
      const orderA = sizeMap.get(a.id)?.order || 99;
      const orderB = sizeMap.get(b.id)?.order || 99;
      return orderA - orderB;
    });
  }

  const genderTag = product.categories[0] || "Men's";
  const catTag = product.categories[2] || "Training";
  const descTag = `${genderTag} ${catTag}`;

  return {
    ...product,
    description: `Built to perform, designed to last. The ${product.title} features a durable fabric blend and a fit that moves with you. Perfect for high intensity training.`,
    descTag,
    variants: Array.from(colorVariantsMap.values()),
  };
}
