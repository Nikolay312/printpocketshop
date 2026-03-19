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
        onClick={onClose}
        className="
          absolute inset-0
          bg-black/30
          backdrop-blur-[2px]
          transition-opacity duration-200 ease-[var(--ease-out)]
          opacity-100
        "
        aria-hidden
      />

      {/* Modal Surface */}
      <div
        role="dialog"
        aria-modal="true"
        className={clsx(
          "relative z-10 w-full max-w-md",
          "bg-[var(--surface)]",
          "border border-[var(--border)]",
          "rounded-[var(--radius-md)]",
          "shadow-[var(--shadow-lg)]",
          "p-7 space-y-6",
          "transition-[opacity,transform] duration-200 ease-[var(--ease-out)]",
          "opacity-100 translate-y-0"
        )}
      >
        {title && (
          <h2 className="text-lg font-semibold tracking-tight text-[var(--fg)]">
            {title}
          </h2>
        )}

        <div className="text-sm text-[var(--muted)] leading-relaxed">
          {children}
        </div>

        {actions && (
          <div className="flex justify-end gap-3 pt-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
