"use client";

import React from "react";

export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  data: T[];
  columns: Column<T>[];
  emptyMessage?: string;
};

function renderCell(value: unknown): React.ReactNode {
  if (
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return String(value);
  }

  if (value instanceof Date) {
    return value.toLocaleDateString();
  }

  return null;
}

export default function DataTable<T>({
  data,
  columns,
  emptyMessage = "No data available.",
}: Props<T>) {
  if (data.length === 0) {
    return (
      <div className="rounded-2xl border p-10 text-center text-gray-500">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className="px-4 py-3 text-left font-medium"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y">
          {data.map((row, i) => (
            <tr key={i} className="hover:bg-gray-50 transition">
              {columns.map((col) => (
                <td
                  key={String(col.key)}
                  className="px-4 py-3"
                >
                  {col.render
                    ? col.render(row)
                    : renderCell(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
