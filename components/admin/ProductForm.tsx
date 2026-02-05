"use client";

import { useState, useEffect } from "react";
import type { ProductFormat, ProductStatus } from "@prisma/client";

export type AdminProductFormData = {
  title: string;
  description: string;
  price: number;
  format?: ProductFormat;
  categoryId: string;
  status: ProductStatus;
  fileKey: string | null;
  previewImages: string[];
};

type Category = {
  id: string;
  name: string;
};

type Props = {
  categories: Category[];
  initial?: {
    title: string;
    description?: string;
    price: number;
    format?: ProductFormat;
    status: ProductStatus;
    fileKey: string | null;
    previewImages?: string[];
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
  onSubmit: (data: AdminProductFormData) => void;
};

function parseFileKeys(value: string | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [value];
  } catch {
    return [value];
  }
}

export default function ProductForm({ categories, initial, onSubmit }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(initial?.price ?? 0);
  const [format, setFormat] = useState<ProductFormat | undefined>(
    initial?.format
  );
  const [categoryId, setCategoryId] = useState(initial?.category.id ?? "");
  const [status, setStatus] = useState<ProductStatus>(
    initial?.status ?? "DRAFT"
  );

  const [previewImages, setPreviewImages] = useState<string[]>(
    initial?.previewImages ?? []
  );

  const [productFiles, setProductFiles] = useState<string[]>(
    parseFileKeys(initial?.fileKey ?? null)
  );

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (status === "PUBLISHED" && productFiles.length === 0) {
      setStatus("DRAFT");
    }
  }, [status, productFiles]);

  function moveImage(from: number, to: number) {
    setPreviewImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(from, 1);
      copy.splice(to, 0, item);
      return copy;
    });
  }

  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();

        onSubmit({
          title,
          description,
          price,
          format,
          categoryId,
          status,
          fileKey:
            productFiles.length > 0
              ? JSON.stringify(productFiles)
              : null,
          previewImages,
        });
      }}
    >
      <input
        className="border p-2 w-full"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="border p-2 w-full min-h-[160px]"
        placeholder="Product description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        className="border p-2 w-full"
        type="number"
        min={0}
        step={1}
        value={price}
        onChange={(e) => setPrice(Number(e.target.value))}
      />

      <select
        className="border p-2 w-full"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        <option value="">Select category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        className="border p-2 w-full"
        value={status}
        onChange={(e) => setStatus(e.target.value as ProductStatus)}
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED" disabled={productFiles.length === 0}>
          Published{" "}
          {productFiles.length === 0 ? "(upload file first)" : ""}
        </option>
      </select>

      {/* Preview Images */}
      <div className="space-y-2">
        <input
          type="file"
          multiple
          disabled={uploading}
          onChange={async (e) => {
            const input = e.currentTarget;
            const files = input.files ? Array.from(input.files) : [];
            if (!files.length) return;

            input.value = "";
            setUploading(true);

            try {
              for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload/preview-image", {
                  method: "POST",
                  body: formData,
                });

                if (!res.ok) throw new Error();

                const { url } = await res.json();
                setPreviewImages((prev) => [...prev, url]);
              }
            } finally {
              setUploading(false);
            }
          }}
        />

        {previewImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previewImages.map((img, index) => (
              <div
                key={img}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData("text/plain", index.toString())
                }
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  const from = Number(
                    e.dataTransfer.getData("text/plain")
                  );
                  moveImage(from, index);
                }}
                className="relative cursor-move"
              >
                <img src={img} className="border rounded" />

                <button
                  type="button"
                  className="absolute top-1 right-1 bg-black/70 text-white text-xs px-2 py-1 rounded"
                  onClick={() =>
                    setPreviewImages((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Product Files */}
      <div className="space-y-2">
        <input
          type="file"
          multiple
          disabled={uploading}
          onChange={async (e) => {
            const input = e.currentTarget;
            const files = input.files ? Array.from(input.files) : [];
            if (!files.length) return;

            input.value = "";
            setUploading(true);

            try {
              for (const file of files) {
                const formData = new FormData();
                formData.append("file", file);

                const res = await fetch("/api/upload/product-file", {
                  method: "POST",
                  body: formData,
                });

                if (!res.ok) throw new Error();

                const { fileKey } = await res.json();
                setProductFiles((prev) => [...prev, fileKey]);
              }
            } finally {
              setUploading(false);
            }
          }}
        />

        {productFiles.length > 0 && (
          <ul className="text-sm space-y-1">
            {productFiles.map((key, index) => (
              <li
                key={key}
                className="flex items-center justify-between border p-2 rounded"
              >
                <span className="truncate">
                  {key.split("/").pop()}
                </span>
                <button
                  type="button"
                  className="text-red-600 text-xs"
                  onClick={() =>
                    setProductFiles((prev) =>
                      prev.filter((_, i) => i !== index)
                    )
                  }
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button className="btn-primary" type="submit" disabled={uploading}>
        Save
      </button>
    </form>
  );
}
