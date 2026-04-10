"use client";

import React from "react";

type Props = {
  label: string;
  accept?: string;
  multiple?: boolean;
  onUploaded: (value: string | string[]) => void;
};

export default function UploadField({
  label,
  accept,
  multiple = false,
  onUploaded,
}: Props) {
  async function uploadFile(file: File): Promise<string> {
    // 1. Get presigned URL
    const res = await fetch("/api/upload/presigned-url", {
      method: "POST",
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      throw new Error("Failed to get upload URL");
    }

    const { uploadUrl, fileKey } = await res.json();

    // 2. Upload directly to R2
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!uploadRes.ok) {
      throw new Error(`Upload failed: ${file.name}`);
    }

    return fileKey;
  }

  async function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const uploaded: string[] = [];

    for (const file of files) {
      try {
        const key = await uploadFile(file);
        uploaded.push(key);
      } catch (err) {
        console.error(err);
        alert("Upload failed: " + file.name);
        return;
      }
    }

    onUploaded(multiple ? uploaded : uploaded[0]);
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      <input
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="block w-full text-sm"
      />
    </div>
  );
}