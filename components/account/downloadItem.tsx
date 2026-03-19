"use client";

import Image from "next/image";
import { Product } from "@/types/product";
import { formatDate } from "@/lib/formatDate";

type PurchasedDownloadItem = {
  orderId: string;
  purchasedAt: string;
  quantity?: number;
  license?: string;
  product:
    | (Product & {
        files: {
          id: string;
          label?: string | null;
        }[];
      })
    | null
    | undefined;
};

type Props = {
  item: PurchasedDownloadItem;
};

/* =========================
   Helpers
========================= */

function getFileExtension(label?: string | null) {
  if (!label) return null;
  const parts = label.split(".");
  if (parts.length < 2) return null;
  return parts.pop()?.toUpperCase() ?? null;
}

function getBadgeStyle(ext: string | null) {
  switch (ext) {
    case "PDF":
      return "bg-red-50 text-red-600 border-red-200";
    case "DOCX":
    case "DOC":
      return "bg-blue-50 text-blue-600 border-blue-200";
    case "PNG":
    case "JPG":
    case "JPEG":
      return "bg-emerald-50 text-emerald-600 border-emerald-200";
    default:
      return "bg-neutral-100 text-neutral-600 border-neutral-200";
  }
}

function getPreviewImageSrc(product: Product | null | undefined): string | null {
  if (!product) return null;

  const previewImages = (product as Product & { previewImages?: unknown }).previewImages;

  if (!Array.isArray(previewImages) || previewImages.length === 0) {
    return null;
  }

  const firstImage = previewImages[0];

  if (typeof firstImage === "string") {
    const trimmed = firstImage.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  if (
    firstImage &&
    typeof firstImage === "object" &&
    "url" in firstImage &&
    typeof (firstImage as { url?: unknown }).url === "string"
  ) {
    const trimmed = (firstImage as { url: string }).url.trim();
    return trimmed.length > 0 ? trimmed : null;
  }

  return null;
}

function getProductTitle(product: Product | null | undefined) {
  if (!product) return "Purchased product";
  if (typeof product.title === "string" && product.title.trim().length > 0) {
    return product.title;
  }
  return "Purchased product";
}

/* =========================
   Component
========================= */

export default function DownloadItem({ item }: Props) {
  const product = item.product ?? null;
  const previewSrc = getPreviewImageSrc(product);
  const title = getProductTitle(product);
  const files = product?.files ?? [];
  const productId = product?.id ?? null;

  return (
    <div
      className="
        rounded-2xl
        border border-neutral-200
        bg-white
        transition-all
        hover:shadow-lg
      "
    >
      <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start">
        <div
          className="
            relative h-24 w-full shrink-0 overflow-hidden
            rounded-xl border border-neutral-200
            bg-neutral-100
            sm:h-20 sm:w-28
          "
        >
          {previewSrc ? (
            <Image
              src={previewSrc}
              alt={title}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-medium text-neutral-400">
              No preview
            </div>
          )}
        </div>

        <div className="flex-1 space-y-2">
          <h3 className="text-base font-semibold leading-snug text-neutral-900">
            {title}
          </h3>

          <p className="text-xs text-neutral-500">
            Purchased on {formatDate(item.purchasedAt)}
          </p>

          {item.license ? (
            <p className="text-xs text-neutral-500">
              License: {item.license}
            </p>
          ) : null}

          {!product && (
            <p className="text-xs text-amber-600">
              This product is no longer listed in the shop, but your purchased files remain available here.
            </p>
          )}
        </div>

        <div className="flex w-full flex-col gap-3 sm:w-72">
          {files.length > 0 ? (
            files.map((file) => {
              const ext = getFileExtension(file.label);
              const downloadHref = productId
                ? `/api/download/${productId}/${file.id}`
                : "#";

              return (
                <a
                  key={file.id}
                  href={downloadHref}
                  aria-label={`Download ${file.label ?? "file"}`}
                  className={`
                    group
                    flex items-center justify-between
                    rounded-xl border border-neutral-200
                    px-4 py-3
                    transition-all duration-200
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300
                    ${
                      productId
                        ? "bg-neutral-50 hover:bg-white hover:shadow-sm"
                        : "pointer-events-none bg-neutral-100 opacity-60"
                    }
                  `}
                >
                  <div className="flex min-w-0 items-center gap-3">
                    {ext && (
                      <span
                        className={`
                          rounded-full border px-2.5 py-1 text-xs font-semibold
                          ${getBadgeStyle(ext)}
                        `}
                      >
                        {ext}
                      </span>
                    )}

                    <span className="truncate text-sm text-neutral-700 transition group-hover:text-neutral-900">
                      {file.label ?? "Download file"}
                    </span>
                  </div>

                  <span
                    className="
                      flex h-10 w-10 items-center justify-center
                      rounded-full border border-indigo-100
                      bg-indigo-50 text-indigo-600
                      transition-all duration-200
                      group-hover:scale-105
                      group-hover:bg-indigo-100
                      group-hover:text-indigo-700
                      group-hover:shadow-sm
                      group-active:scale-95
                    "
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 3v12" />
                      <path d="M7 10l5 5 5-5" />
                      <path d="M5 21h14" />
                    </svg>
                  </span>
                </a>
              );
            })
          ) : (
            <span className="text-sm text-neutral-500">
              No files available
            </span>
          )}
        </div>
      </div>
    </div>
  );
}