import type {
  Product,
  Currency,
  ProductFormat,
  ProductLicense,
  ProductFile,
} from "@/types/product";

/* =========================
   RAW MOCK SHAPE
========================= */
type MockProduct = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  previewImages: string[];
  format: string;
  license: string;
  fileUrl: string;
  isFeatured: boolean;
  sales: number;
};

/* =========================
   NORMALIZERS
========================= */

function normalizeCurrency(value: string): Currency {
  if (value === "EUR" || value === "USD") return value;
  return "EUR";
}

function normalizeFormat(value: string): ProductFormat {
  switch (value) {
    case "PDF":
      return "PDF";
    case "PNG":
      return "PNG";
    case "JPG":
      return "JPG";
    case "CANVA":
      return "CANVA";
    default:
      return "PDF";
  }
}

function normalizeLicense(value: string): ProductLicense {
  if (value.toUpperCase() === "COMMERCIAL") return "COMMERCIAL";
  return "PERSONAL";
}

function normalizeCategory(slug: string) {
  return {
    id: slug,
    slug,
    name: slug
      .replace(/-/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  };
}

function normalizeFiles(mock: MockProduct): ProductFile[] {
  if (!mock.fileUrl) return [];

  return [
    {
      id: `${mock.id}-file`,
      label: null,
    },
  ];
}

/* =========================
   MAPPER
========================= */

export function mapMockProductToProduct(
  mock: MockProduct
): Product {
  return {
    id: mock.id,
    title: mock.title,
    slug: mock.slug,
    description: mock.description,

    price: mock.price,
    currency: normalizeCurrency(mock.currency),

    previewImages: mock.previewImages,
    files: normalizeFiles(mock),

    format: normalizeFormat(mock.format),
    license: normalizeLicense(mock.license),

    isFeatured: mock.isFeatured,
    sales: mock.sales,

    createdAt: new Date().toISOString(),

    category: normalizeCategory(mock.category),

    tags: [],
  };
}