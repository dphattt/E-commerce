import type { Metadata } from "next";
import { CheckoutView } from "@/components/pages/CheckoutView";

export const metadata: Metadata = {
  title: "Checkout | Gymshark",
};

interface PageProps {
  searchParams: Promise<{ slug?: string }>;
}

export default async function CheckoutPage({ searchParams }: PageProps) {
  const { slug } = await searchParams;

  return <CheckoutView slug={slug} />;
}
