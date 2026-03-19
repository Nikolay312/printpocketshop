import React from "react";

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-gradient-to-b from-white to-neutral-50 text-neutral-900">
      {children}
    </div>
  );
}