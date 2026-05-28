import { httpError } from "@/utils/http-error";
import * as productsRepo from "@/modules/products/products.repository";

export async function listRecentProducts(limit = 10) {
  return productsRepo.findRecentProducts(limit);
}

export async function getProductById(id: string) {
  const product = await productsRepo.findProductById(id);
  if (!product) throw httpError("Product not found", 404);
  return product;
}
