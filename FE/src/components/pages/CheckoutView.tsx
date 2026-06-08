"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  CheckoutProductCard,
  lineSubtotal,
  type CheckoutLineState,
} from "@/components/pages/CheckoutProductCard";
import { buildOrderItemsFromCheckout } from "@/features/checkout/lib/build-order-items";
import { useCheckoutProducts } from "@/features/checkout/hooks/useCheckoutProducts";
import { useAuth } from "@/features/auth";
import { createOrderApi } from "@/features/orders";
import { useApplicableVouchers } from "@/features/vouchers/hooks/useApplicableVouchers";
import {
  getWardsByProvince,
  provinces,
  type Ward,
} from "@/lib/vietnam-address";
import { formatUsd } from "@/shared/lib/format-money";

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Standard delivery", fee: 5 },
  { id: "express", label: "Express delivery", fee: 15 },
] as const;

const PAYMENT_METHODS = [
  { id: "vnpay", label: "VNPay" },
  { id: "bank", label: "Bank transfer" },
  { id: "momo", label: "MoMo" },
  { id: "cod", label: "Cash on delivery" },
] as const;

interface CheckoutViewProps {
  slug?: string;
}

const EMPTY_LINE_STATE: CheckoutLineState = {
  quantity: 1,
  selectedColor: "",
  selectedSize: "",
};

export function CheckoutView({ slug }: CheckoutViewProps) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { slugs, products, loading, failedSlugs, isReady } =
    useCheckoutProducts(slug);
  const [lineStates, setLineStates] = useState<CheckoutLineState[]>([]);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placeOrderError, setPlaceOrderError] = useState<string | null>(null);
  const [deliveryId, setDeliveryId] =
    useState<(typeof DELIVERY_OPTIONS)[number]["id"]>("standard");
  const [provinceCode, setProvinceCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [voucherCode, setVoucherCode] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof PAYMENT_METHODS)[number]["id"]>("vnpay");

  useEffect(() => {
    setLineStates(products.map(() => ({ ...EMPTY_LINE_STATE })));
  }, [products]);

  const provinceOptions = useMemo(
    () => provinces.map((p) => ({ value: p.code, label: p.name })),
    [],
  );

  const wardOptions = useMemo(() => {
    if (!provinceCode) return [];
    return getWardsByProvince(provinceCode).map((w: Ward) => ({
      value: w.code,
      label: w.name,
    }));
  }, [provinceCode]);

  const subtotal = useMemo(() => {
    return products.reduce((sum, product, index) => {
      const line = lineStates[index] ?? EMPTY_LINE_STATE;
      return sum + lineSubtotal(product, line.quantity);
    }, 0);
  }, [products, lineStates]);

  const productIds = useMemo(
    () => products.map((product) => product._id),
    [products],
  );

  const {
    vouchers: applicableVouchers,
    loading: vouchersLoading,
    error: vouchersError,
  } = useApplicableVouchers(productIds, subtotal);

  useEffect(() => {
    if (!applicableVouchers.length) {
      setVoucherCode("");
      return;
    }

    const stillValid = applicableVouchers.some(
      (voucher) => voucher.code === voucherCode,
    );
    if (!stillValid) {
      setVoucherCode(applicableVouchers[0].code);
    }
  }, [applicableVouchers, voucherCode]);

  const delivery =
    DELIVERY_OPTIONS.find((d) => d.id === deliveryId) ?? DELIVERY_OPTIONS[0];
  const shippingFee = delivery.fee;
  const selectedVoucher = applicableVouchers.find(
    (voucher) => voucher.code === voucherCode,
  );

  const voucherDiscount = selectedVoucher
    ? Math.round((subtotal * selectedVoucher.discountValue) / 100)
    : 0;
  const total = Math.max(0, subtotal - voucherDiscount) + shippingFee;

  async function handlePlaceOrder() {
    if (!isAuthenticated) {
      router.push("/account/login");
      return;
    }

    setPlaceOrderError(null);
    setIsPlacingOrder(true);

    try {
      const { order } = await createOrderApi({
        items: buildOrderItemsFromCheckout(products, lineStates),
        deliveryMethod: deliveryId,
        paymentMethod,
        provinceCode: provinceCode || undefined,
        wardCode: wardCode || undefined,
        streetAddress: streetAddress.trim() || undefined,
        subtotal: { amount: subtotal, currency: "USD" },
        shippingFee,
        voucherCode: selectedVoucher?.code,
        voucherDiscount,
        total: { amount: total, currency: "USD" },
      });
      router.push(`/account?placed=${encodeURIComponent(order.orderCode)}`);
    } catch {
      setPlaceOrderError("Could not place your order. Please try again.");
    } finally {
      setIsPlacingOrder(false);
    }
  }

  if (!slug || slugs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-base font-bold uppercase tracking-wider text-store-ink-strong">
          No products to checkout
        </p>
        <Link
          href="/wishlist"
          className="rounded-lg bg-store-ink-strong px-6 py-2.5 text-xs font-black uppercase tracking-wider text-store-paper"
        >
          Back to wishlist
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-base font-bold uppercase tracking-wider text-store-ink-strong">
          Loading products...
        </p>
      </div>
    );
  }

  if (!isReady || products.length !== slugs.length) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-base font-bold uppercase tracking-wider text-store-ink-strong">
          Could not load product details
        </p>
        <p className="max-w-sm text-sm text-store-fg-muted">
          No product found for slug:{" "}
          {failedSlugs.length > 0 ? failedSlugs.join(", ") : slugs.join(", ")}
        </p>
        <Link
          href="/products"
          className="rounded-lg bg-store-ink-strong px-6 py-2.5 text-xs font-black uppercase tracking-wider text-store-paper"
        >
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="-mx-4 -mt-9 w-[calc(100%+2rem)] bg-store-paper sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-black uppercase tracking-tight text-store-ink-strong">
          Checkout
        </h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-8">
            {products.map((product, index) => (
              <CheckoutProductCard
                key={`${product._id}-${index}`}
                product={product}
                lineState={lineStates[index] ?? EMPTY_LINE_STATE}
                onLineChange={(next) =>
                  setLineStates((current) =>
                    current.map((line, lineIndex) =>
                      lineIndex === index ? next : line,
                    ),
                  )
                }
              />
            ))}

            <section className="space-y-3">
              <p className="text-[11px] font-black uppercase tracking-widest text-store-ink-strong">
                Delivery method
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                {DELIVERY_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setDeliveryId(opt.id)}
                    className={`flex flex-1 flex-col rounded-xl border p-4 text-left transition-colors ${
                      deliveryId === opt.id
                        ? "border-store-ink-strong bg-store-surface"
                        : "border-store-border hover:border-store-ink-strong/50"
                    }`}
                  >
                    <span className="text-sm font-bold text-store-ink-strong">
                      {opt.label}
                    </span>
                    <span className="text-xs text-store-fg-muted">
                      {formatUsd(opt.fee)}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SearchableSelect
                label="Province / City"
                placeholder="Search province..."
                options={provinceOptions}
                value={provinceCode}
                onChange={(code) => {
                  setProvinceCode(code);
                  setWardCode("");
                }}
              />
              <SearchableSelect
                label="Ward"
                placeholder={
                  provinceCode ? "Search ward..." : "Select a province first"
                }
                options={wardOptions}
                value={wardCode}
                onChange={setWardCode}
                disabled={!provinceCode}
              />
              <div className="flex flex-col gap-1.5 sm:col-span-2">
                <label
                  htmlFor="street-address"
                  className="text-[11px] font-black uppercase tracking-widest text-store-ink-strong"
                >
                  Street address
                </label>
                <input
                  id="street-address"
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="e.g. 123 Main Street"
                  className="h-11 w-full rounded-lg border border-store-border bg-store-paper px-3 text-sm outline-none focus:border-store-ink-strong"
                />
              </div>
            </section>
          </div>

          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-2xl border border-store-border/60 bg-store-surface-2/40 p-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-store-ink-strong">
                Discount vouchers
              </p>
              {vouchersLoading ? (
                <p className="text-sm text-store-fg-muted">Loading vouchers...</p>
              ) : vouchersError ? (
                <p className="text-sm text-destructive">{vouchersError}</p>
              ) : applicableVouchers.length === 0 ? (
                <p className="text-sm text-store-fg-muted">
                  No vouchers apply to these products.
                </p>
              ) : (
                <div className="flex flex-col gap-2">
                  {applicableVouchers.map((voucher) => (
                    <label
                      key={voucher.code}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                        voucherCode === voucher.code
                          ? "border-store-ink-strong bg-store-surface"
                          : "border-store-border hover:border-store-ink-strong/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="voucher"
                        checked={voucherCode === voucher.code}
                        onChange={() => setVoucherCode(voucher.code)}
                        className="accent-store-ink"
                      />
                      <span className="font-medium text-store-ink-strong">
                        {voucher.label} ({voucher.discountValue}% off)
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-store-border/60 bg-store-surface-2/40 p-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-store-ink-strong">
                Payment method
              </p>
              <div className="flex flex-col gap-2">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      paymentMethod === method.id
                        ? "border-store-ink-strong bg-store-surface"
                        : "border-store-border hover:border-store-ink-strong/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className="accent-store-ink"
                    />
                    <span className="font-medium text-store-ink-strong">
                      {method.label}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-store-border bg-store-paper p-5 shadow-sm">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-store-fg-muted">
                  <span>Subtotal ({products.length} items)</span>
                  <span>{formatUsd(subtotal)}</span>
                </div>
                <div className="flex justify-between text-store-fg-muted">
                  <span>Shipping</span>
                  <span>{formatUsd(shippingFee)}</span>
                </div>
                {voucherDiscount > 0 ? (
                  <div className="flex justify-between text-green-700">
                    <span>Discount</span>
                    <span>-{formatUsd(voucherDiscount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-store-border pt-3 text-base font-black text-store-ink-strong">
                  <span>Total</span>
                  <span>{formatUsd(total)}</span>
                </div>
              </div>

              {placeOrderError ? (
                <p className="mt-3 text-center text-sm text-destructive">
                  {placeOrderError}
                </p>
              ) : null}
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="mt-5 w-full cursor-pointer rounded-lg bg-store-ink-strong py-4 text-xs font-black uppercase tracking-[0.2em] text-store-paper transition-colors hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isPlacingOrder ? "Placing order..." : "Place order"}
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
