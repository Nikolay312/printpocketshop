"use client";

import { useState, useEffect } from "react";

/* =========================
   TYPES
========================= */

type ProductFormat = "PDF" | "PNG" | "JPG" | "CANVA";
type ProductStatus = "DRAFT" | "PUBLISHED";

export type AdminProductFormData = {
  title: string;
  description: string;
  price: number; // cents
  format?: ProductFormat;
  categoryId: string;
  status: ProductStatus;
  files: string[];
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
    files: string[];
    previewImages?: string[];
    category: {
      id: string;
      name: string;
      slug: string;
    };
  };
  onSubmit: (data: AdminProductFormData) => void;
};

/* =========================
   COMPONENT
========================= */

export default function ProductForm({
  categories,
  initial,
  onSubmit,
}: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(
    initial?.description ?? ""
  );

  const [priceEuros, setPriceEuros] = useState<string>(() => {
    if (!initial) return "0.00";
    return (initial.price / 100).toFixed(2);
  });

  const [format, setFormat] = useState<ProductFormat | undefined>(
    initial?.format
  );

  const [categoryId, setCategoryId] = useState(
    initial?.category.id ?? ""
  );

  const [status, setStatus] = useState<ProductStatus>(
    initial?.status ?? "DRAFT"
  );

  const [previewImages, setPreviewImages] = useState<string[]>(
    initial?.previewImages ?? []
  );

  const [productFiles, setProductFiles] = useState<string[]>(
    initial?.files ?? []
  );

  const [uploading, setUploading] = useState(false);

  /* =========================
     GUARD: cannot publish without file
  ========================= */

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

  /* =========================
     FILE UPLOAD HANDLERS
  ========================= */

  async function uploadPreviewImages(files: File[]) {
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload/preview-image", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Preview upload failed");
        }

        const { url } = (await res.json()) as { url: string };
        setPreviewImages((prev) => [...prev, url]);
      }
    } catch (err) {
      console.error(err);
      alert("Preview image upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function uploadProductFiles(files: File[]) {
    setUploading(true);
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload/product-file", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("File upload failed");
        }

        const { fileKey } = (await res.json()) as { fileKey: string };
        setProductFiles((prev) => [...prev, fileKey]);
      }
    } catch (err) {
      console.error(err);
      alert("Product file upload failed.");
    } finally {
      setUploading(false);
    }
  }

  /* =========================
     SUBMIT
  ========================= */

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const euros = Number(priceEuros);
    if (Number.isNaN(euros) || euros < 0) {
      alert("Invalid price");
      return;
    }

    const priceCents = Math.round(euros * 100);

    onSubmit({
      title,
      description,
      price: priceCents,
      format,
      categoryId,
      status,
      files: productFiles,
      previewImages,
    });
  }

  /* =========================
     RENDER
  ========================= */

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <input
        className="w-full border p-2"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <textarea
        className="min-h-[160px] w-full border p-2"
        placeholder="Product description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <div className="space-y-1">
        <label className="block text-sm font-medium">
          Price (EUR)
        </label>
        <input
          className="w-full border p-2"
          type="number"
          min={0}
          step="0.01"
          inputMode="decimal"
          placeholder="0.00"
          value={priceEuros}
          onChange={(e) => setPriceEuros(e.target.value)}
          required
        />
      </div>

      <select
        className="w-full border p-2"
        value={categoryId}
        onChange={(e) => setCategoryId(e.target.value)}
        required
      >
        <option value="">Select category</option>
        {categories.map((c: Category) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        className="w-full border p-2"
        value={status}
        onChange={(e) => setStatus(e.target.value as ProductStatus)}
      >
        <option value="DRAFT">Draft</option>
        <option value="PUBLISHED" disabled={productFiles.length === 0}>
          Published{" "}
          {productFiles.length === 0 ? "(upload file first)" : ""}
        </option>
      </select>

      <select
        className="w-full border p-2"
        value={format ?? ""}
        onChange={(e) =>
          setFormat(
            e.target.value === ""
              ? undefined
              : (e.target.value as ProductFormat)
          )
        }
      >
        <option value="">Select format</option>
        <option value="PDF">PDF</option>
        <option value="PNG">PNG</option>
        <option value="JPG">JPG</option>
        <option value="CANVA">CANVA</option>
      </select>

      <div className="space-y-2">
        <input
          type="file"
          multiple
          disabled={uploading}
          onChange={(e) => {
            const files = e.target.files
              ? Array.from(e.target.files)
              : [];
            if (!files.length) return;
            uploadPreviewImages(files);
            e.target.value = "";
          }}
        />

        {previewImages.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {previewImages.map((img: string, index: number) => (
              <div
                key={img}
                draggable
                onDragStart={(e) =>
                  e.dataTransfer.setData(
                    "text/plain",
                    index.toString()
                  )
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
                <img src={img} className="rounded border" alt="" />

                <button
                  type="button"
                  className="absolute right-1 top-1 rounded bg-black/70 px-2 py-1 text-xs text-white"
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

      <div className="space-y-2">
        <input
          type="file"
          multiple
          disabled={uploading}
          onChange={(e) => {
            const files = e.target.files
              ? Array.from(e.target.files)
              : [];
            if (!files.length) return;
            uploadProductFiles(files);
            e.target.value = "";
          }}
        />

        {productFiles.length > 0 && (
          <ul className="space-y-1 text-sm">
            {productFiles.map((key: string, index: number) => (
              <li
                key={key}
                className="flex items-center justify-between rounded border p-2"
              >
                <span className="truncate">
                  {key.split("/").pop()}
                </span>
                <button
                  type="button"
                  className="text-xs text-red-600"
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

      <button
        className="btn-primary"
        type="submit"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Save"}
      </button>
    </form>
  );
}