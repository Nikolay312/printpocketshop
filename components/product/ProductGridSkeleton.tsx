import ProductCardSkeleton from "./ProductCardSkeleton";

interface Props {
  count?: number;
}

export default function ProductGridSkeleton({ count = 8 }: Props) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2 sm:gap-7
        lg:grid-cols-3 lg:gap-8
        xl:grid-cols-4 xl:gap-8
      "
    >
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
