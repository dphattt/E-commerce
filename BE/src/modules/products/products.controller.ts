import type { NextFunction, Request, Response } from "express";
import * as productsService from "@/modules/products/products.service";

const DEFAULT_LIMIT = 10;

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await productsService.listRecentProducts(DEFAULT_LIMIT);
    res.json({
      products,
      count: products.length,
      limit: DEFAULT_LIMIT,
    });
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
