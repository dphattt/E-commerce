"use client";

import Image from "next/image";
import { useCallback, useMemo } from "react";
import { Minus, Plus } from "lucide-react";
import type { Product } from "@/features/products/model/product.types";
import { formatUsd } from "@/shared/lib/format-money";

const DEFAULT_COLORS = ["Black", "Grey", "Navy"];
const DEFAULT_SIZES = ["XS", "S", "M", "L", "XL"];

export interface CheckoutLineState {
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

interface CheckoutProductCardProps {
  product: Product;
  lineState: CheckoutLineState;
  onLineChange: (next: CheckoutLineState) => void;
}

export function CheckoutProductCard({
  product,
  lineState,
  onLineChange,
}: CheckoutProductCardProps) {
  const { quantity, selectedColor, selectedSize } = lineState;

  const colors = useMemo(() => {
    if (product.variants?.length) {
      return product.variants.map((variant) => variant.color);
    }
    return DEFAULT_COLORS;
  }, [product]);

  const effectiveSelectedColor =
    selectedColor && colors.includes(selectedColor)
      ? selectedColor
      : (colors[0] ?? "");

  const selectedVariant = useMemo(
    () => product.variants?.find((v) => v.color === effectiveSelectedColor),
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

  const handleColorChange = useCallback(
    (color: string) => {
      const variant = product.variants?.find((v) => v.color === color);
      let nextSize = effectiveSelectedSize;

      if (variant?.sizes.length) {
        const stillValid = variant.sizes.some(
          (s) => s.label === effectiveSelectedSize && s.inStock,
        );
        if (!stillValid) {
          nextSize =
            variant.sizes.find((s) => s.inStock)?.label ??
            variant.sizes[0]?.label ??
            "";
        }
      }

      onLineChange({
        quantity,
        selectedColor: color,
        selectedSize: nextSize,
      });
    },
    [product, effectiveSelectedSize, onLineChange, quantity],
  );

  const imageUrl = selectedVariant?.image ?? product.imageUrls[0] ?? "";
  const unitPrice = product.price.amount;

  return (
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
            Color
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
                onClick={() =>
                  onLineChange({
                    quantity,
                    selectedColor: effectiveSelectedColor,
                    selectedSize: size,
                  })
                }
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
            Quantity
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              aria-label="Decrease quantity"
              disabled={quantity <= 1}
              onClick={() =>
                onLineChange({
                  quantity: Math.max(1, quantity - 1),
                  selectedColor: effectiveSelectedColor,
                  selectedSize: effectiveSelectedSize,
                })
              }
              className="flex size-9 items-center justify-center rounded-lg border border-store-border disabled:opacity-40"
            >
              <Minus className="size-4" />
            </button>
            <span className="min-w-8 text-center text-sm font-bold">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() =>
                onLineChange({
                  quantity: Math.min(99, quantity + 1),
                  selectedColor: effectiveSelectedColor,
                  selectedSize: effectiveSelectedSize,
                })
              }
              className="flex size-9 items-center justify-center rounded-lg border border-store-border"
            >
              <Plus className="size-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function lineSubtotal(product: Product, quantity: number): number {
  return product.price.amount * quantity;
}
