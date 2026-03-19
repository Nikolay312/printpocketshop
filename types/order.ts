import type { Product } from "./product";

export type OrderStatus = "PENDING" | "PAID" | "REFUNDED" | "EXPIRED";

export type OrderItem = {
  quantity: number;
  product: Product;
  license?: "PERSONAL" | "COMMERCIAL";
};

export type Order = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  total: number;
  items: OrderItem[];
};
