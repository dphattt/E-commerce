export const momoConfig = {
  accessKey: process.env.MOMO_ACCESS_KEY ?? "F8BBA842ECF85",
  secretKey: process.env.MOMO_SECRET_KEY ?? "K951B6PE1waDMi640xX08PD3vg6EkVlz",
  partnerCode: process.env.MOMO_PARTNER_CODE ?? "MOMO",
  partnerName: process.env.MOMO_PARTNER_NAME ?? "Gymshark",
  storeId: process.env.MOMO_STORE_ID ?? "GymsharkStore",
  endpoint: process.env.MOMO_ENDPOINT ?? "https://test-payment.momo.vn",
  requestType: process.env.MOMO_REQUEST_TYPE ?? "payWithMethod",
  lang: process.env.MOMO_LANG ?? "vi",
  usdToVndRate: Number(process.env.MOMO_USD_TO_VND_RATE ?? "25000"),
  redirectUrl:
    process.env.MOMO_REDIRECT_URL ??
    `${process.env.API_ORIGIN ?? "http://localhost:3001"}/api/payments/momo/return`,
  ipnUrl:
    process.env.MOMO_IPN_URL ??
    `${process.env.API_ORIGIN ?? "http://localhost:3001"}/api/payments/momo/ipn`,
  frontendOrigin:
    process.env.APP_ORIGIN ?? "http://localhost:3000",
};

export function usdToVnd(amountUsd: number, rate = momoConfig.usdToVndRate): number {
  return Math.max(1, Math.round(amountUsd * rate));
}
