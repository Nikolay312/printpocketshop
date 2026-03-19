export type ProductLicense =
  | "PERSONAL"
  | "COMMERCIAL";

export type ProductFormat =
  | "PDF"
  | "PNG"
  | "JPG"
  | "CANVA";

export type Currency =
  | "EUR"
  | "USD"
  | "BGN";

export interface Category {
  id: string;
  name: string;
  slug: string;
}

/**
 * Downloadable product file
 */
export interface ProductFile {
  id: string;
  label?: string | null;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;

  image?: string | null;
  previewImages: string[];

  // multi-file system
  files: ProductFile[];

  price: number;
  currency: Currency;

  category: {
    id: string;
    name: string;
    slug: string;
  };

  tags: string[];

  format: ProductFormat;
  license: ProductLicense;

  isFeatured: boolean;
  sales: number;
  createdAt: string | Date;
}

/**
 * Purchased product (can reference deleted product)
 */
export type PurchasedProduct = {
  product: Product | null; // ✅ FIXED
  purchasedAt: string; // ISO
  orderId: string;
};