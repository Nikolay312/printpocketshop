// Currencies supported by the shop
export const CURRENCIES = ["EUR", "USD", "BGN"] as const;

// Product formats
export const PRODUCT_FORMATS = [
  "PDF",
  "PNG",
  "JPG",
  "CANVA",
] as const;

// Product licenses
export const PRODUCT_LICENSES = [
  "personal",
  "commercial",
] as const;

// Order statuses
export const ORDER_STATUSES = [
  "pending",
  "paid",
  "failed",
] as const;

// UI
export const ITEMS_PER_PAGE = 12;
