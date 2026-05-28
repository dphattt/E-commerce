import type {
  Product,
  ProductDetailResponse,
  ProductListResponse,
} from "@/features/products/model/product.types";

const baseApi = (): string =>
  process.env.NEXT_PUBLIC_BASE_API ?? "http://localhost:3001/api";

/**
 * Server-safe products list fetcher. Uses native fetch so it works
 * inside React Server Components and respects Next.js fetch cache
 * tags ("products"). Pass { revalidate } from the caller if needed.
 */
export async function fetchRecentProducts(options?: {
  signal?: AbortSignal;
  revalidate?: number;
}): Promise<ProductListResponse> {
  const res = await fetch(`${baseApi()}/products`, {
    signal: options?.signal,
    next:
      options?.revalidate !== undefined
        ? { revalidate: options.revalidate, tags: ["products"] }
        : { tags: ["products"] },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
  }

  return (await res.json()) as ProductListResponse;
}

/**
 * Server-safe product detail fetcher. Returns null on 404 instead of
 * throwing, so route handlers can call notFound() cleanly.
 */
export async function fetchProductById(
  id: string,
  options?: { signal?: AbortSignal; revalidate?: number },
): Promise<Product | null> {
  const res = await fetch(`${baseApi()}/products/${encodeURIComponent(id)}`, {
    signal: options?.signal,
    next:
      options?.revalidate !== undefined
        ? { revalidate: options.revalidate, tags: ["products", `product:${id}`] }
        : { tags: ["products", `product:${id}`] },
  });

  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(
      `Failed to fetch product ${id}: ${res.status} ${res.statusText}`,
    );
  }

  const body = (await res.json()) as ProductDetailResponse;
  return body.product;
}
