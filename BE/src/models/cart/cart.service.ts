import { httpError } from "@/utils/http-error";
import * as cartRepo from "@/models/cart/cart.repository";
import * as productsRepo from "@/models/products/products.repository";

export async function getCart(email: string) {
  return cartRepo.findCartByEmail(email);
}

export async function addCartItem(
  email: string,
  sku: string,
  quantity: number,
) {
  // Server-side price lookup: never trust prices from the client.
  const variant = await productsRepo.findActiveVariantBySku(sku);
  if (!variant) throw httpError("Variant not found or inactive", 404);

  const cart = await cartRepo.findOrInitCart(email);
  const existing = cart.items.find((i) => i.sku === sku);
  if (existing) {
    existing.quantity += quantity;
    existing.unitPrice = variant.price;
  } else {
    cart.items.push({ sku, quantity, unitPrice: variant.price });
  }
  return cart.save();
}

export async function updateCartItemQuantity(
  email: string,
  sku: string,
  quantity: number,
) {
  const cart = await cartRepo.findCartByEmail(email);
  if (!cart) throw httpError("Cart not found", 404);

  const item = cart.items.find((i) => i.sku === sku);
  if (!item) throw httpError("Item not found in cart", 404);

  item.quantity = quantity;
  return cart.save();
}

export async function removeCartItem(email: string, sku: string) {
  const cart = await cartRepo.findCartByEmail(email);
  if (!cart) throw httpError("Cart not found", 404);

  const before = cart.items.length;
  cart.items = cart.items.filter((i) => i.sku !== sku) as typeof cart.items;
  if (cart.items.length === before) {
    throw httpError("Item not found in cart", 404);
  }

  return cart.save();
}

export async function clearCart(email: string) {
  const cart = await cartRepo.findCartByEmail(email);
  if (!cart) return null;
  cart.items = [] as typeof cart.items;
  return cart.save();
}
