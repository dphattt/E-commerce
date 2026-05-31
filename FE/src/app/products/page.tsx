import { ProductList } from "@/components/pages/ProductList";
import type { Product } from "@/features/products";

interface PageProps {
  searchParams: Promise<{ categorySlug?: string; limit?: string; skip?: string }>;
}

async function fetchProducts(
  categorySlug?: string,
  limit = 40,
  skip = 0,
): Promise<{ products: Product[]; total: number }> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_API ?? "http://localhost:3001";

  const params = new URLSearchParams({ limit: String(limit), skip: String(skip) });
  if (categorySlug) params.set("categorySlug", categorySlug);

  try {
    const res = await fetch(`${baseUrl}/api/products?${params}`, {
      cache: "no-store",
    });
    if (!res.ok) return { products: [], total: 0 };
    const data = await res.json();
    return { products: data.products ?? [], total: data.total ?? 0 };
  } catch {
    return { products: [], total: 0 };
  }
}

export default async function ProductListPage({ searchParams }: PageProps) {
  const { categorySlug } = await searchParams;
  const { products, total } = await fetchProducts(categorySlug);

  return (
    <main className="w-full flex-1 bg-store-paper">
      <ProductList
        products={products}
        total={total}
        categorySlug={categorySlug}
      />
    </main>
  );
}
