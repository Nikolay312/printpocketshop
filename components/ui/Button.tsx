"use client";

import { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};

export default function Button({
  children,
  className,
  variant = "primary",
  loading = false,
  disabled,
  ...props
}: Props) {
  const isDisabled = disabled || loading;

  return (
    <button
      {...props}
      disabled={isDisabled}
      aria-busy={loading}
      className={clsx(
        /* Base */
        "relative inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold",
        "transition-all duration-150 ease-out",
        "focus-visible:outline-none focus-visible:shadow-[var(--ring)]",
        "disabled:pointer-events-none disabled:opacity-60",

        /* Variants */
        {
          /* Primary — main CTA */
          "bg-[var(--accent)] text-white shadow-sm hover:bg-[var(--accent-hover)] hover:-translate-y-px hover:shadow-md active:translate-y-0 active:shadow-sm":
            variant === "primary",

          /* Secondary — neutral action */
          "border border-border bg-background text-foreground hover:bg-surface hover:-translate-y-px active:translate-y-0":
            variant === "secondary",

          /* Danger — destructive action */
          "bg-[var(--danger)] text-white shadow-sm hover:bg-red-700 hover:-translate-y-px active:translate-y-0":
            variant === "danger",
        },

        className
      )}
    >
      {/* Loading spinner */}
      {loading && (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
        />
      )}

      {/* Content */}
      <span className={clsx(loading && "opacity-80")}>
        {children}
      </span>
    </button>
  );
}
