import crypto, { randomBytes } from "node:crypto";
import axios from "axios";
import { momoConfig, usdToVnd } from "@/config/momo.config";
import { httpError } from "@/utils/http-error";
import type { CreateOrderBody } from "@/models/orders/orders.validation";
import * as ordersService from "@/models/orders/orders.service";
import * as pendingMomoRepo from "@/models/payments/pending-momo.repository";

const momoClient = axios.create({
  baseURL: momoConfig.endpoint,
  timeout: 30_000,
  headers: {
    "Content-Type": "application/json",
  },
});

interface MomoCreateResponse {
  partnerCode: string;
  orderId: string;
  requestId: string;
  amount: number;
  responseTime: number;
  message: string;
  resultCode: number;
  payUrl?: string;
  deeplink?: string;
  qrCodeUrl?: string;
}

function buildCreateSignature(params: {
  accessKey: string;
  amount: string;
  extraData: string;
  ipnUrl: string;
  orderId: string;
  orderInfo: string;
  partnerCode: string;
  redirectUrl: string;
  requestId: string;
  requestType: string;
}) {
  const rawSignature = [
    `accessKey=${params.accessKey}`,
    `amount=${params.amount}`,
    `extraData=${params.extraData}`,
    `ipnUrl=${params.ipnUrl}`,
    `orderId=${params.orderId}`,
    `orderInfo=${params.orderInfo}`,
    `partnerCode=${params.partnerCode}`,
    `redirectUrl=${params.redirectUrl}`,
    `requestId=${params.requestId}`,
    `requestType=${params.requestType}`,
  ].join("&");

  return crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");
}

function buildCallbackSignature(params: {
  accessKey: string;
  amount: string;
  extraData: string;
  message: string;
  orderId: string;
  orderInfo: string;
  orderType: string;
  partnerCode: string;
  payType: string;
  requestId: string;
  responseTime: string;
  resultCode: string;
  transId: string;
}) {
  const rawSignature = [
    `accessKey=${params.accessKey}`,
    `amount=${params.amount}`,
    `extraData=${params.extraData}`,
    `message=${params.message}`,
    `orderId=${params.orderId}`,
    `orderInfo=${params.orderInfo}`,
    `orderType=${params.orderType}`,
    `partnerCode=${params.partnerCode}`,
    `payType=${params.payType}`,
    `requestId=${params.requestId}`,
    `responseTime=${params.responseTime}`,
    `resultCode=${params.resultCode}`,
    `transId=${params.transId}`,
  ].join("&");

  return crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");
}

function generateMomoOrderId(): string {
  return `MOMO${Date.now()}${randomBytes(2).toString("hex").toUpperCase()}`;
}

export async function createMomoPaymentFromCheckout(
  email: string,
  body: CreateOrderBody,
) {
  if (body.paymentMethod !== "momo") {
    throw httpError("Checkout must use MoMo payment", 400);
  }

  await ordersService.validateCheckoutForOrder(email, body);

  const momoOrderId = generateMomoOrderId();
  const requestId = momoOrderId;
  const amountVnd = usdToVnd(body.total.amount);
  const amount = String(amountVnd);
  const orderInfo = `Pay MoMo checkout ${momoOrderId}`;
  const extraData = "";
  const redirectUrl = `${momoConfig.redirectUrl}?momoOrderId=${encodeURIComponent(momoOrderId)}`;

  await pendingMomoRepo.createPendingMomoPayment({
    momoOrderId,
    userEmail: email,
    checkout: body,
  });

  const signature = buildCreateSignature({
    accessKey: momoConfig.accessKey,
    amount,
    extraData,
    ipnUrl: momoConfig.ipnUrl,
    orderId: momoOrderId,
    orderInfo,
    partnerCode: momoConfig.partnerCode,
    redirectUrl,
    requestId,
    requestType: momoConfig.requestType,
  });

  const requestBody = {
    partnerCode: momoConfig.partnerCode,
    partnerName: momoConfig.partnerName,
    storeId: momoConfig.storeId,
    requestId,
    amount,
    orderId: momoOrderId,
    orderInfo,
    redirectUrl,
    ipnUrl: momoConfig.ipnUrl,
    lang: momoConfig.lang,
    requestType: momoConfig.requestType,
    autoCapture: true,
    extraData,
    orderGroupId: "",
    signature,
  };

  const { data } = await momoClient.post<MomoCreateResponse>(
    "/v2/gateway/api/create",
    requestBody,
  );

  if (data.resultCode !== 0) {
    throw httpError(data.message || "MoMo payment creation failed", 502);
  }

  return {
    momoOrderId,
    amountVnd,
    amountUsd: body.total.amount,
    currency: body.total.currency,
    payUrl: data.payUrl ?? null,
    qrCodeUrl: data.qrCodeUrl ?? data.payUrl ?? null,
    deeplink: data.deeplink ?? null,
    requestId,
  };
}

/**
 * Called when MoMo redirects back to our backend `/api/payments/momo/return`.
 * Creates the order (success OR failure) and clears the cart.
 */
export async function processMomoReturn(query: Record<string, unknown>) {
  const partnerCode = String(query.partnerCode ?? "");
  const orderId = String(query.orderId ?? "");
  const requestId = String(query.requestId ?? "");
  const amount = String(query.amount ?? "");
  const orderInfo = String(query.orderInfo ?? "");
  const orderType = String(query.orderType ?? "");
  const transId = String(query.transId ?? "");
  // MoMo redirect may use resultCode or errorCode depending on API version
  const resultCode = String(query.resultCode ?? query.errorCode ?? "");
  const message = String(query.message ?? "");
  const payType = String(query.payType ?? "");
  const responseTime = String(query.responseTime ?? "");
  const extraData = String(query.extraData ?? "");
  const signature = String(query.signature ?? "");

  // Verify signature (skip only if MoMo sends no sig on cancel - still create failed order)
  if (signature) {
    const expectedSignature = buildCallbackSignature({
      accessKey: momoConfig.accessKey,
      amount,
      extraData,
      message,
      orderId,
      orderInfo,
      orderType,
      partnerCode,
      payType,
      requestId,
      responseTime,
      resultCode,
      transId,
    });

    if (signature !== expectedSignature) {
      throw httpError("Invalid MoMo redirect signature", 400);
    }
  }

  const momoOrderId = String(query.momoOrderId ?? orderId);
  const isSuccess = resultCode === "0";

  const pending = await pendingMomoRepo.findPendingMomoPaymentByOrderId(momoOrderId);
  if (!pending) {
    throw httpError("MoMo pending payment not found", 404);
  }

  // Idempotent: if already processed, redirect to the same order
  if (pending.status === "completed" && pending.orderCode) {
    return { orderCode: pending.orderCode, success: isSuccess };
  }

  const order = await ordersService.createOrder(pending.userEmail, pending.checkout, {
    status: isSuccess ? "awaiting_pickup" : "payment_failed",
    isPay: isSuccess,
    momoOrderId,
    clearCart: true,
  });

  await pendingMomoRepo.markPendingMomoPaymentCompleted(momoOrderId, order.orderCode);

  return { orderCode: order.orderCode, success: isSuccess };
}

export async function handleMomoIpn(body: Record<string, unknown>) {
  const partnerCode = String(body.partnerCode ?? "");
  const orderId = String(body.orderId ?? "");
  const requestId = String(body.requestId ?? "");
  const amount = String(body.amount ?? "");
  const orderInfo = String(body.orderInfo ?? "");
  const orderType = String(body.orderType ?? "");
  const transId = String(body.transId ?? "");
  const resultCode = String(body.resultCode ?? "");
  const message = String(body.message ?? "");
  const payType = String(body.payType ?? "");
  const responseTime = String(body.responseTime ?? "");
  const extraData = String(body.extraData ?? "");
  const signature = String(body.signature ?? "");

  const expectedSignature = buildCallbackSignature({
    accessKey: momoConfig.accessKey,
    amount,
    extraData,
    message,
    orderId,
    orderInfo,
    orderType,
    partnerCode,
    payType,
    requestId,
    responseTime,
    resultCode,
    transId,
  });

  if (signature !== expectedSignature) {
    throw httpError("Invalid MoMo IPN signature", 400);
  }

  if (resultCode !== "0") {
    return { acknowledged: true, updated: false };
  }

  // IPN is a fallback – if order already created by return handler, skip
  const pending = await pendingMomoRepo.findPendingMomoPaymentByOrderId(orderId);
  if (!pending) {
    return { acknowledged: true, updated: false };
  }

  if (pending.status === "completed") {
    return { acknowledged: true, updated: false };
  }

  await ordersService.createOrder(pending.userEmail, pending.checkout, {
    status: "awaiting_pickup",
    isPay: true,
    momoOrderId: orderId,
    clearCart: true,
  });

  await pendingMomoRepo.markPendingMomoPaymentCompleted(orderId, "IPN");

  return { acknowledged: true, updated: true };
}
