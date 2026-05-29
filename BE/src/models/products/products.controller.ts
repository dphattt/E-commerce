import type { NextFunction, Request, Response } from "express";
import * as productsService from "@/models/products/products.service";

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 100;

export async function getProducts(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { categorySlug, limit: l, skip: s } = req.query as Record<string, string | undefined>;

    const limit = Math.min(Number(l) || DEFAULT_LIMIT, MAX_LIMIT);
    const skip = Math.max(Number(s) || 0, 0);

    if (categorySlug) {
      const result = await productsService.listProductsByCategory(categorySlug, limit, skip);
      return res.json({ ...result, limit, skip });
    }

    const products = await productsService.listRecentProducts(limit);
    res.json({ products, total: products.length, limit, skip });
  } catch (e) {
    next(e);
  }
}

export async function getProductById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { id } = req.params as { id: string };
    const product = await productsService.getProductById(id);
    res.json({ product });
  } catch (e) {
    next(e);
  }
}
