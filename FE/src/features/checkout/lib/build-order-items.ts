import { productIdFromSku } from "@/features/cart/lib/checkout-slug";
import type { CartItem } from "@/features/cart/model/cart.types";
import { productSlugFromSourceUrl } from "@/features/products/lib/product-slug";
import type { Product } from "@/features/products/model/product.types";
import type { CheckoutLineState } from "@/components/pages/CheckoutProductCard";
import type { OrderItem } from "@/features/orders/api/orders.api";

function resolveSku(
  product: Product,
  color: string,
  size: string,
): string {
  const variant = product.variants?.find((v) => v.color === color);
  const sizeObj = variant?.sizes.find((s) => s.label === size);
  if (sizeObj?.sku) return sizeObj.sku;
  return `${product._id}-${size.toLowerCase()}`;
}

function resolveImage(product: Product, color: string): string {
  const variant = product.variants?.find((v) => v.color === color);
  return variant?.image ?? product.imageUrls[0] ?? "";
}

function matchCartItemForProduct(
  product: Product,
  cartItems: CartItem[],
): CartItem | undefined {
  const slug = productSlugFromSourceUrl(product.sourceUrl);

  return cartItems.find((item) => {
    if (item.productSlug && item.productSlug === slug) return true;
    if (productIdFromSku(item.sku) === product._id) return true;
    return product.variants?.some((variant) =>
      variant.sizes.some((size) => size.sku === item.sku),
    );
  });
}

export function buildOrderItemsFromCheckout(
  products: Product[],
  lineStates: CheckoutLineState[],
  cartItems: CartItem[] = [],
): OrderItem[] {
  return products.map((product, index) => {
    const line = lineStates[index];
    const colors = product.variants?.length
      ? product.variants.map((v) => v.color)
      : ["Black"];
    const color =
      line.selectedColor && colors.includes(line.selectedColor)
        ? line.selectedColor
        : (colors[0] ?? "Black");

    const variant = product.variants?.find((v) => v.color === color);
    const sizes = variant?.sizes.length
      ? variant.sizes.filter((s) => s.inStock).map((s) => s.label)
      : ["M"];
    const size =
      line.selectedSize && sizes.includes(line.selectedSize)
        ? line.selectedSize
        : (sizes[0] ?? "M");

    const resolvedSku = resolveSku(product, color, size);
    const matchedCartItem = matchCartItemForProduct(product, cartItems);
    const sku = matchedCartItem?.sku ?? resolvedSku;

    return {
      productId: product._id,
      productSlug: productSlugFromSourceUrl(product.sourceUrl),
      sku,
      name: product.title,
      image: resolveImage(product, color),
      variantLabel: size,
      color,
      size,
      quantity: line.quantity,
      unitPrice: product.price,
    };
  });
}
