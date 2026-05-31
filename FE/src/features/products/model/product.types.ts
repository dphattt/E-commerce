import type { Money } from "@/shared/types";

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
