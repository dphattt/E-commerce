import dynamic from "next/dynamic";
import type { Metadata } from "next";

const ProductDetail = dynamic(() =>
  import("@/components/pages/ProductDetail").then((m) => m.ProductDetail),
);

type RouteParams = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<RouteParams>;
}): Promise<Metadata> {
  const { slug } = await params;
  return {
    title: `${slug} | Product`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;

  return (
    <main className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8">
      <ProductDetail slug={slug} />
    </main>
  );
}
