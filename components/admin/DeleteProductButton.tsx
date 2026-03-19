"use client";

import { useTransition } from "react";

type Props = {
  productId: string;
  onDelete: (productId: string) => Promise<void>;
};

export default function DeleteProductButton({
  productId,
  onDelete,
}: Props) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      className="text-sm text-red-600 hover:underline disabled:opacity-50"
      onClick={() => {
        const confirmed = confirm(
          "Are you sure you want to permanently delete this product?"
        );

        if (!confirmed) return;

        startTransition(() => {
          onDelete(productId);
        });
      }}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
