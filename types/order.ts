import type { Product } from "./product";

export type OrderStatus = "PAID" | "PENDING" | "FAILED";

export type OrderItem = {
  quantity: number;
  product: Product;
};

export type Order = {
  id: string;
  createdAt: string; // ✅ STRING (not Date)
  status: OrderStatus;
  total: number;
  items: OrderItem[];
};
