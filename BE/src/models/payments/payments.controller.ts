import type { NextFunction, Request, Response } from "express";
import type { CreateOrderBody } from "@/models/orders/orders.validation";
import { momoConfig } from "@/config/momo.config";
import { vnpayConfig } from "@/config/vnpay.config";
import * as momoService from "@/models/payments/momo.service";
import * as vnpayService from "@/models/payments/vnpay.service";

/** POST /api/payments/momo/create — Tạo phiên thanh toán MoMo (chưa tạo đơn hàng) */
export async function createMomoPayment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const email = req.user!.email;
    const body = req.body as CreateOrderBody;
    const payment = await momoService.createMomoPaymentFromCheckout(email, body);
    res.json({ payment });
  } catch (e) {
    next(e);
  }
}

/** GET /api/payments/momo/return — MoMo redirect sau thanh toán (success or failure) */
export async function momoReturn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await momoService.processMomoReturn(
      req.query as Record<string, unknown>,
    );
    res.redirect(
      `${momoConfig.frontendOrigin}/account?placed=${encodeURIComponent(result.orderCode)}&scroll=orders`,
    );
  } catch (e) {
    next(e);
  }
}

/** POST /api/payments/momo/ipn — Webhook xác nhận thanh toán từ MoMo */
export async function momoIpn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await momoService.handleMomoIpn(
      req.body as Record<string, unknown>,
    );
    res.json(result);
  } catch (e) {
    next(e);
  }
}

/** POST /api/payments/vnpay/create — Tạo URL thanh toán VNPay (chưa tạo đơn hàng) */
export async function createVnpayPayment(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const email = req.user!.email;
    const body = req.body as CreateOrderBody;
    const clientIp = vnpayService.resolveClientIp(req);
    const payment = await vnpayService.createVnpayPaymentFromCheckout(
      email,
      body,
      clientIp,
    );
    res.json({ payment });
  } catch (e) {
    next(e);
  }
}

/** GET /api/payments/vnpay/result/:vnpTxnRef — Kiểm tra đơn sau khi thanh toán VNPay */
export async function getVnpayPaymentResult(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const email = req.user!.email;
    const { vnpTxnRef } = req.params as { vnpTxnRef: string };
    const result = await vnpayService.getVnpayPaymentResult(email, vnpTxnRef);
    res.json(result);
  } catch (e) {
    next(e);
  }
}

function buildVnpayResultRedirect(result: {
  success: boolean;
  orderCode: string | null;
  amountVnd: number;
  amountUsd: number;
}) {
  const params = new URLSearchParams({
    status: result.success ? "success" : "failed",
    amountVnd: String(result.amountVnd),
    amountUsd: String(result.amountUsd),
  });
  if (result.orderCode) {
    params.set("orderCode", result.orderCode);
  }
  return `${vnpayConfig.frontendOrigin}/payment/result?${params}`;
}

/** GET /api/payments/vnpay/return — VNPay redirect sau thanh toán */
export async function vnpayReturn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await vnpayService.processVnpayCallback(
      req.query as Record<string, unknown>,
    );
    res.redirect(buildVnpayResultRedirect(result));
  } catch {
    res.redirect(`${vnpayConfig.frontendOrigin}/payment/result?status=failed`);
  }
}

/** GET /api/payments/vnpay/ipn — VNPay IPN xác nhận thanh toán */
export async function vnpayIpn(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const result = await vnpayService.handleVnpayIpn(
      req.query as Record<string, unknown>,
    );
    res.json(result);
  } catch (e) {
    next(e);
  }
}
