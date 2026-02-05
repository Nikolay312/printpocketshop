"use client";

import { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  actions?: ReactNode;
};

export default function Modal({
  open,
  onClose,
  title,
  children,
  actions,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={clsx(
          "relative z-10 w-full max-w-md rounded-2xl bg-white p-6 space-y-4"
        )}
      >
        {title && (
          <h2 className="text-lg font-semibold">
            {title}
          </h2>
        )}

        <div className="text-sm text-gray-600">
          {children}
        </div>

        {actions && (
          <div className="flex justify-end gap-3 pt-4">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
