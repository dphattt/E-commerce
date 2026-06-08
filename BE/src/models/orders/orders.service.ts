import { randomBytes } from "node:crypto";
import { httpError } from "@/utils/http-error";
import type { CreateOrderBody } from "@/models/orders/orders.validation";
import * as ordersRepo from "@/models/orders/orders.repository";
import * as vouchersService from "@/models/vouchers/vouchers.service";

function generateOrderCode(): string {
  const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const suffix = randomBytes(3).toString("hex").toUpperCase();
  return `GS-${date}-${suffix}`;
}

export async function listOrders(email: string) {
  return ordersRepo.findOrdersByEmail(email);
}

export async function getOrder(email: string, orderCode: string) {
  const order = await ordersRepo.findOrderByCodeForEmail(orderCode, email);
  if (!order) throw httpError("Order not found", 404);
  return order;
}

export async function createOrder(email: string, body: CreateOrderBody) {
  const orderCode = generateOrderCode();
  const productIds = body.items
    .map((item) => item.productId)
    .filter((id): id is string => Boolean(id));

  const voucherResult = await vouchersService.validateVoucherForOrder({
    voucherCode: body.voucherCode,
    productIds,
    subtotal: body.subtotal.amount,
  });

  const expectedTotal = Math.max(
    0,
    body.subtotal.amount - voucherResult.voucherDiscount,
  ) + body.shippingFee;

  if (Math.abs(expectedTotal - body.total.amount) > 0.01) {
    throw httpError("Order total does not match voucher calculation", 400);
  }

  const order = await ordersRepo.createOrder({
    orderCode,
    userEmail: email,
    status: "pending",
    items: body.items,
    subtotal: body.subtotal,
    shippingFee: body.shippingFee,
    voucherCode: voucherResult.voucherCode,
    voucherDiscount: voucherResult.voucherDiscount,
    total: body.total,
    deliveryMethod: body.deliveryMethod,
    paymentMethod: body.paymentMethod,
    shippingAddress: {
      provinceCode: body.provinceCode,
      wardCode: body.wardCode,
      streetAddress: body.streetAddress,
    },
  });

  return order;
}
