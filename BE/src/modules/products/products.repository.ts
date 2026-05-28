import ProductVariant, {
  type IProductVariant,
} from "@/modules/products/ProductVariant.model";

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
