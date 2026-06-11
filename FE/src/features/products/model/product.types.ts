import type { Money } from "@/shared/types";

export interface ProductVariantSize {
  id: string;
  label: string;
  inStock: boolean;
  sku: string;
}

export interface ProductVariant {
  id: string;
  color: string;
  image: string;
  hex: string;
  sizes: ProductVariantSize[];
}

export interface Product {
  _id: string;
  sourceUrl: string;
  title: string;
  price: Money;
  imageUrls: string[];
  localImagePaths: string[];
  categories: string[];
  scrapedAt: string;
  createdAt?: string;
  updatedAt?: string;
  description?: string;
  descTag?: string;
  variants?: ProductVariant[];
  ratingAverage?: number;
  ratingCount?: number;
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  limit: number;
  skip?: number;
}

export interface ProductDetailResponse {
  product: Product;
}
