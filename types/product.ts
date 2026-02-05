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

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;

  image?: string;
  previewImages: string[];
  fileUrl?: string;

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
  createdAt: string;
}


export type PurchasedProduct = {
  product: Product;
  purchasedAt: string; // ISO
  orderId: string;
};
