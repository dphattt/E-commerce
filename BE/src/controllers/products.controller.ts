import type { NextFunction, Request, Response } from "express";
import Product from "@/models/Product.model";

const DEFAULT_LIMIT = 10;

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .limit(DEFAULT_LIMIT)
      .lean();

    res.json({
      products,
      count: products.length,
      limit: DEFAULT_LIMIT,
    });
  } catch (e) {
    next(e);
  }
}
