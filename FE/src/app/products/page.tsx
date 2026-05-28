import dynamic from "next/dynamic";

const ProductList = dynamic(() =>
  import("@/components/pages/ProductList").then((m) => m.ProductList),
);

export default function ProductListPage() {
  return (
    <main className="w-full flex-1 bg-store-paper">
      <ProductList />
    </main>
  );
}
