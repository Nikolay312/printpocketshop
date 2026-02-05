"use client";

type Props = {
  label: string;
  endpoint: "/api/upload/product-file" | "/api/upload/preview-image";
  accept?: string;
  multiple?: boolean;
  onUploaded: (value: string | string[]) => void;
};

export default function UploadField({
  label,
  endpoint,
  accept,
  multiple = false,
  onUploaded,
}: Props) {
  async function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const uploaded: string[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error ?? "Upload failed");
        return;
      }

      // product-file returns { fileKey }
      // preview-image returns { url }
      uploaded.push(data.fileKey ?? data.url);
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
