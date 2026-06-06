"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Minus, Plus } from "lucide-react";
import { SearchableSelect } from "@/components/ui/searchable-select";
import {
  fetchProductById,
  useCachedProduct,
  useProductCache,
} from "@/features/products";
import {
  getWardsByProvince,
  provinces,
  type Ward,
} from "@/lib/vietnam-address";
import { formatUsd } from "@/shared/lib/format-money";

const DEFAULT_COLORS = ["Black", "Grey", "Navy"];
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"];

const DELIVERY_OPTIONS = [
  { id: "standard", label: "Giao hàng thường", fee: 5 },
  { id: "express", label: "Giao hàng nhanh", fee: 15 },
] as const;

const VOUCHERS = [
  { id: "", label: "Không dùng voucher", type: "none" as const, value: 0 },
  {
    id: "GYM10",
    label: "GYM10 — Giảm 10%",
    type: "percent" as const,
    value: 10,
  },
  {
    id: "SAVE50",
    label: "SAVE50 — Giảm $50",
    type: "fixed" as const,
    value: 50,
  },
  {
    id: "FREESHIP",
    label: "FREESHIP — Miễn phí vận chuyển",
    type: "shipping" as const,
    value: 0,
  },
];

const PAYMENT_METHODS = [
  { id: "vnpay", label: "VNPay" },
  { id: "bank", label: "Chuyển khoản ngân hàng" },
  { id: "momo", label: "MoMo" },
  { id: "cod", label: "Thanh toán khi nhận hàng" },
] as const;

interface CheckoutViewProps {
  slug?: string;
}

export function CheckoutView({ slug }: CheckoutViewProps) {
  const product = useCachedProduct(slug ?? "");
  const { cacheProduct } = useProductCache();

  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [deliveryId, setDeliveryId] =
    useState<(typeof DELIVERY_OPTIONS)[number]["id"]>("standard");
  const [provinceCode, setProvinceCode] = useState("");
  const [wardCode, setWardCode] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [voucherId, setVoucherId] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<(typeof PAYMENT_METHODS)[number]["id"]>("vnpay");

  const colors = useMemo(() => {
    if (product?.variants?.length) {
      return product.variants.map((v) => v.color);
    }
    return DEFAULT_COLORS;
  }, [product]);

  const effectiveSelectedColor =
    selectedColor && colors.includes(selectedColor)
      ? selectedColor
      : (colors[0] ?? "");

  const selectedVariant = useMemo(
    () => product?.variants?.find((v) => v.color === effectiveSelectedColor),
    [product, effectiveSelectedColor],
  );

  const sizes = useMemo(() => {
    if (selectedVariant?.sizes.length) {
      return selectedVariant.sizes.filter((s) => s.inStock).map((s) => s.label);
    }
    return DEFAULT_SIZES;
  }, [selectedVariant]);

  const effectiveSelectedSize =
    selectedSize && sizes.includes(selectedSize)
      ? selectedSize
      : (sizes[0] ?? "");

  useEffect(() => {
    if (!product?._id || product.variants?.length) return;

    const controller = new AbortController();
    fetchProductById(product._id, { signal: controller.signal })
      .then((res) => cacheProduct(res.product))
      .catch(() => {});

    return () => controller.abort();
  }, [product?._id, product?.variants?.length, cacheProduct]);

  const handleColorChange = useCallback(
    (color: string) => {
      setSelectedColor(color);
      const variant = product?.variants?.find((v) => v.color === color);
      if (!variant?.sizes.length) return;

      const stillValid = variant.sizes.some(
        (s) => s.label === effectiveSelectedSize && s.inStock,
      );
      if (stillValid) return;

      const nextSize =
        variant.sizes.find((s) => s.inStock) ?? variant.sizes[0];
      setSelectedSize(nextSize.label);
    },
    [product, effectiveSelectedSize],
  );

  const imageUrl = useMemo(() => {
    if (selectedVariant?.image) return selectedVariant.image;
    return product?.imageUrls[0] ?? "";
  }, [product, selectedVariant]);

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

  const unitPrice = product?.price.amount ?? 0;
  const subtotal = unitPrice * quantity;
  const delivery =
    DELIVERY_OPTIONS.find((d) => d.id === deliveryId) ?? DELIVERY_OPTIONS[0];
  const shippingFee = delivery.fee;

  const voucher = VOUCHERS.find((v) => v.id === voucherId) ?? VOUCHERS[0];

  let voucherDiscount = 0;
  let effectiveShipping: number = shippingFee;

  if (voucher.type === "percent") {
    voucherDiscount = Math.round((subtotal * voucher.value) / 100);
  } else if (voucher.type === "fixed") {
    voucherDiscount = voucher.value;
  } else if (voucher.type === "shipping") {
    effectiveShipping = 0;
  }

  const total = Math.max(0, subtotal - voucherDiscount) + effectiveShipping;

  if (!slug) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-base font-bold uppercase tracking-wider text-store-ink-strong">
          Không có sản phẩm để thanh toán
        </p>
        <Link
          href="/wishlist"
          className="rounded-lg bg-store-ink-strong px-6 py-2.5 text-xs font-black uppercase tracking-wider text-store-paper"
        >
          Về wishlist
        </Link>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <p className="text-base font-bold uppercase tracking-wider text-store-ink-strong">
          Chưa tải được thông tin sản phẩm
        </p>
        <p className="max-w-sm text-sm text-store-fg-muted">
          Hãy mở sản phẩm từ danh sách hoặc wishlist trước khi thanh toán.
        </p>
        <Link
          href={`/products/${slug}`}
          className="rounded-lg bg-store-ink-strong px-6 py-2.5 text-xs font-black uppercase tracking-wider text-store-paper"
        >
          Xem sản phẩm
        </Link>
      </div>
    );
  }

  return (
    <div className="-mx-4 -mt-9 w-[calc(100%+2rem)] bg-store-paper sm:-mx-6 sm:w-[calc(100%+3rem)] lg:-mx-8 lg:w-[calc(100%+4rem)]">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="mb-8 text-2xl font-black uppercase tracking-tight text-store-ink-strong">
          Thanh toán
        </h1>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_380px]">
          {/* Left */}
          <div className="flex flex-col gap-8">
            <section className="flex gap-5 rounded-2xl border border-store-border/60 bg-store-surface-2/40 p-5">
              <div className="relative aspect-2/3 w-28 shrink-0 overflow-hidden rounded-xl bg-store-surface sm:w-32">
                {imageUrl ? (
                  <Image
                    key={imageUrl}
                    src={imageUrl}
                    alt={`${product.title} — ${effectiveSelectedColor || "default"}`}
                    fill
                    sizes="128px"
                    className="object-cover transition-opacity duration-300"
                  />
                ) : null}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-4">
                <div>
                  <h2 className="text-sm font-black uppercase leading-snug text-store-ink-strong">
                    {product.title}
                  </h2>
                  <p className="mt-1 text-lg font-black text-store-ink-strong">
                    {formatUsd(unitPrice)}
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-store-ink-strong">
                    Màu
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => handleColorChange(color)}
                        className={`rounded-lg border px-3 py-1.5 text-xs font-bold uppercase transition-colors ${
                          effectiveSelectedColor === color
                            ? "border-store-ink-strong bg-store-ink-strong text-store-paper"
                            : "border-store-border bg-store-paper hover:border-store-ink-strong"
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-[11px] font-black uppercase tracking-widest text-store-ink-strong">
                    Size
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-10 rounded-lg border px-3 py-1.5 text-xs font-bold uppercase transition-colors ${
                          effectiveSelectedSize === size
                            ? "border-store-ink-strong bg-store-ink-strong text-store-paper"
                            : "border-store-border bg-store-paper hover:border-store-ink-strong"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-[11px] font-black uppercase tracking-widest text-store-ink-strong">
                    Số lượng
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      aria-label="Giảm số lượng"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      className="flex size-9 items-center justify-center rounded-lg border border-store-border disabled:opacity-40"
                    >
                      <Minus className="size-4" />
                    </button>
                    <span className="min-w-8 text-center text-sm font-bold">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Tăng số lượng"
                      onClick={() => setQuantity((q) => Math.min(99, q + 1))}
                      className="flex size-9 items-center justify-center rounded-lg border border-store-border"
                    >
                      <Plus className="size-4" />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <p className="text-[11px] font-black uppercase tracking-widest text-store-ink-strong">
                Hình thức giao hàng
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
                label="Tỉnh / Thành phố"
                placeholder="Nhập để tìm tỉnh thành..."
                options={provinceOptions}
                value={provinceCode}
                onChange={(code) => {
                  setProvinceCode(code);
                  setWardCode("");
                }}
              />
              <SearchableSelect
                label="Phường / Xã"
                placeholder={
                  provinceCode ? "Nhập để tìm phường xã..." : "Chọn tỉnh trước"
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
                  Số nhà / Đường
                </label>
                <input
                  id="street-address"
                  type="text"
                  value={streetAddress}
                  onChange={(e) => setStreetAddress(e.target.value)}
                  placeholder="Ví dụ: 123 Nguyễn Huệ"
                  className="h-11 w-full rounded-lg border border-store-border bg-store-paper px-3 text-sm outline-none focus:border-store-ink-strong"
                />
              </div>
            </section>
          </div>

          {/* Right */}
          <aside className="flex flex-col gap-6 lg:sticky lg:top-24 lg:self-start">
            <section className="rounded-2xl border border-store-border/60 bg-store-surface-2/40 p-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-store-ink-strong">
                Voucher giảm giá
              </p>
              <div className="flex flex-col gap-2">
                {VOUCHERS.map((v) => (
                  <label
                    key={v.id || "none"}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors ${
                      voucherId === v.id
                        ? "border-store-ink-strong bg-store-surface"
                        : "border-store-border hover:border-store-ink-strong/40"
                    }`}
                  >
                    <input
                      type="radio"
                      name="voucher"
                      checked={voucherId === v.id}
                      onChange={() => setVoucherId(v.id)}
                      className="accent-store-ink"
                    />
                    <span className="font-medium text-store-ink-strong">
                      {v.label}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-store-border/60 bg-store-surface-2/40 p-5">
              <p className="mb-3 text-[11px] font-black uppercase tracking-widest text-store-ink-strong">
                Hình thức thanh toán
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
                  <span>Tạm tính</span>
                  <span>{formatUsd(subtotal)}</span>
                </div>
                <div className="flex justify-between text-store-fg-muted">
                  <span>Vận chuyển</span>
                  <span>{formatUsd(effectiveShipping)}</span>
                </div>
                {voucherDiscount > 0 ? (
                  <div className="flex justify-between text-green-700">
                    <span>Giảm giá</span>
                    <span>-{formatUsd(voucherDiscount)}</span>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-store-border pt-3 text-base font-black text-store-ink-strong">
                  <span>Tổng cộng</span>
                  <span>{formatUsd(total)}</span>
                </div>
              </div>

              <button
                type="button"
                className="mt-5 w-full rounded-lg bg-store-ink-strong py-4 text-xs font-black uppercase tracking-[0.2em] text-store-paper transition-colors hover:opacity-70 cursor-pointer"
              >
                Đặt hàng
              </button>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
}
