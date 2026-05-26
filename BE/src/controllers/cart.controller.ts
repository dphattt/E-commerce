import type { NextFunction, Request, Response } from "express";
import Cart from "@/services/Cart.service";
import { httpError } from "@/utils/http-error";

type AddItemBody = {
  sku?: string;
  quantity?: number;
  unitPrice?: { amount: number; currency: string };
};

type UpdateItemBody = {
  quantity?: number;
};

/** GET /api/cart — Lấy giỏ hàng của user hiện tại */
export async function getCart(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.user!.email;
    const cart = await Cart.findOne({ userEmail: email });
    if (!cart) {
      return res.json({ userEmail: email, items: [], subtotal: { amount: 0, currency: "USD" } });
    }
    res.json(cart);
  } catch (e) {
    next(e);
  }
}

/** POST /api/cart/items — Thêm item vào giỏ (nếu đã có sku thì cộng quantity) */
export async function addItem(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.user!.email;
    const { sku, quantity = 1, unitPrice } = req.body as AddItemBody;

    if (!sku) throw httpError("sku is required", 400);
    if (!unitPrice?.amount || !unitPrice?.currency)
      throw httpError("unitPrice.amount and unitPrice.currency are required", 400);
    if (!Number.isInteger(quantity) || quantity < 1)
      throw httpError("quantity must be a positive integer", 400);

    let cart = await Cart.findOne({ userEmail: email });
    if (!cart) {
      cart = new Cart({ userEmail: email, items: [] });
    }

    const existing = cart.items.find((i) => i.sku === sku);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ sku, quantity, unitPrice });
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (e) {
    next(e);
  }
}

/** PATCH /api/cart/items/:sku — Cập nhật quantity của item */
export async function updateItem(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.user!.email;
    const { sku } = req.params;
    const { quantity } = req.body as UpdateItemBody;

    if (!Number.isInteger(quantity) || (quantity as number) < 1)
      throw httpError("quantity must be a positive integer", 400);

    const cart = await Cart.findOne({ userEmail: email });
    if (!cart) throw httpError("Cart not found", 404);

    const item = cart.items.find((i) => i.sku === sku);
    if (!item) throw httpError("Item not found in cart", 404);

    item.quantity = quantity as number;
    await cart.save();
    res.json(cart);
  } catch (e) {
    next(e);
  }
}

/** DELETE /api/cart/items/:sku — Xoá một item khỏi giỏ */
export async function removeItem(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.user!.email;
    const { sku } = req.params;

    const cart = await Cart.findOne({ userEmail: email });
    if (!cart) throw httpError("Cart not found", 404);

    const before = cart.items.length;
    cart.items = cart.items.filter((i) => i.sku !== sku) as typeof cart.items;

    if (cart.items.length === before) throw httpError("Item not found in cart", 404);

    await cart.save();
    res.json(cart);
  } catch (e) {
    next(e);
  }
}

/** DELETE /api/cart — Xoá toàn bộ giỏ hàng */
export async function clearCart(req: Request, res: Response, next: NextFunction) {
  try {
    const email = req.user!.email;
    const cart = await Cart.findOne({ userEmail: email });
    if (!cart) return res.json({ userEmail: email, items: [], subtotal: { amount: 0, currency: "USD" } });

    cart.items = [] as typeof cart.items;
    await cart.save();
    res.json(cart);
  } catch (e) {
    next(e);
  }
}
