export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "popular";

export interface ShopFilters {
  category: string | null;
  priceMin: number | null;
  priceMax: number | null;
  search: string;
}

export interface ShopState {
  filters: ShopFilters;
  sort: SortOption;
}
