import dynamic from "next/dynamic";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchProductById, type Product } from "@/features/products";

const ProductDetail = dynamic(() =>
  import("@/components/pages/ProductDetail").then((m) => m.ProductDetail),
);

type RouteParams = { slug: string };

async function loadProduct(slug: string): Promise<Product | null> {
  try {
    return await fetchProductById(slug, { revalidate: 60 });
  } catch (err) {
    // Network or BE outage: fall through to the existing mock-driven
    // ProductDetail so the route still renders something. Once the
    // BE is the single source of truth this can throw instead.
    if (process.env.NODE_ENV !== "production") {
      console.warn("[products/[slug]] BE fetch failed, falling back to mock:", err);
    }
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await loadProduct(slug);
  if (!product) {
    return { title: `${slug} | Product` };
  }
  return {
    title: `${product.title} | Gymshark`,
    description: product.title,
    openGraph: {
      title: product.title,
      images: product.imageUrls.slice(0, 1),
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;
  const product = await loadProduct(slug);

  // If the BE is reachable and the slug is a valid object id but no
  // doc matched, surface a real 404. We only call notFound() when
  // we know for sure the product is missing (BE returned 404); a
  // network error keeps the existing mock UI alive instead.
  if (product === null && /^[0-9a-fA-F]{24}$/.test(slug)) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
      <ProductDetail slug={slug} product={product ?? undefined} />
    </main>
  );
}
