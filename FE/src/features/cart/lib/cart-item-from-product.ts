import type { CartItem } from "@/features/cart/model/cart.types";
import type { Product } from "@/features/products/model/product.types";

const FALLBACK_SIZE = { id: "m", label: "M" };

export function buildCartItemFromProduct(
  product: Product,
  slug: string,
  preferredSku?: string,
): CartItem {
  if (product.variants?.length) {
    if (preferredSku) {
      for (const variant of product.variants) {
        const size = variant.sizes.find((s) => s.sku === preferredSku);
        if (size) {
          return {
            sku: size.sku,
            name: product.title,
            image: variant.image,
            variantLabel: size.label,
            productSlug: slug,
            quantity: 1,
            unitPrice: product.price,
          };
        }
      }
    }

    const variant = product.variants[0];
    const size =
      variant.sizes.find((s) => s.inStock) ?? variant.sizes[0] ?? null;
    if (size) {
      return {
        sku: size.sku,
        name: product.title,
        image: variant.image,
        variantLabel: size.label,
        productSlug: slug,
        quantity: 1,
        unitPrice: product.price,
      };
    }
  }

  return {
    sku: `${product._id}-${FALLBACK_SIZE.id}`,
    name: product.title,
    image: product.imageUrls[0] ?? "",
    variantLabel: FALLBACK_SIZE.label,
    productSlug: slug,
    quantity: 1,
    unitPrice: product.price,
  };
}
