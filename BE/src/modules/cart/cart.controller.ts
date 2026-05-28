import type { NextFunction, Request, Response } from "express";
import Cart from "@/modules/cart/Cart.model";
import ProductVariant from "@/modules/products/ProductVariant.model";
import { httpError } from "@/utils/http-error";
import type {
  AddItemBody,
  UpdateItemBody,
} from "@/modules/cart/cart.validation";

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
    const { sku, quantity } = req.body as AddItemBody;

    // Server-side price lookup: never trust prices from the client.
    const variant = await ProductVariant.findOne({ sku, isActive: true }).lean();
    if (!variant) throw httpError("Variant not found or inactive", 404);
    const unitPrice = variant.price;

    let cart = await Cart.findOne({ userEmail: email });
    if (!cart) {
      cart = new Cart({ userEmail: email, items: [] });
    }

    const existing = cart.items.find((i) => i.sku === sku);
    if (existing) {
      existing.quantity += quantity;
      existing.unitPrice = unitPrice;
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

    const cart = await Cart.findOne({ userEmail: email });
    if (!cart) throw httpError("Cart not found", 404);

    const item = cart.items.find((i) => i.sku === sku);
    if (!item) throw httpError("Item not found in cart", 404);

    item.quantity = quantity;
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
