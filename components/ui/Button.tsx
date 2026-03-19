"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
  loading?: boolean;
};

const Button = forwardRef<HTMLButtonElement, Props>(
  (
    {
      children,
      className,
      variant = "primary",
      loading = false,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        type={type}
        {...props}
        disabled={isDisabled}
        aria-busy={loading}
        aria-disabled={isDisabled}
        className={clsx(
          /* Base */
          "relative inline-flex items-center justify-center gap-2",
          "h-11 px-6 rounded-[var(--radius-lg)]",
          "text-sm font-semibold tracking-tight",
          "select-none whitespace-nowrap",
          "transition-[transform,box-shadow,background-color,border-color] duration-200 ease-[var(--ease-out)]",
          "focus-visible:outline-none focus-visible:shadow-[var(--ring)]",
          "disabled:pointer-events-none disabled:opacity-60",

          /* Primary */
          variant === "primary" &&
            clsx(
              "bg-[var(--accent)] text-white border border-transparent shadow-[var(--shadow-sm)]",
              "hover:bg-[var(--accent-hover)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)]",
              "active:bg-[var(--accent-pressed)] active:translate-y-0 active:shadow-[var(--shadow-sm)]"
            ),

          /* Secondary */
          variant === "secondary" &&
            clsx(
              "bg-[var(--surface)] text-[var(--fg)] border border-[var(--border)] shadow-[var(--shadow-xs)]",
              "hover:bg-[var(--accent-soft)] hover:border-[var(--border-strong)] hover:-translate-y-[1px] hover:shadow-[var(--shadow-sm)]",
              "active:translate-y-0 active:shadow-[var(--shadow-xs)]"
            ),

          /* Danger */
          variant === "danger" &&
            clsx(
              "bg-[var(--danger)] text-white border border-transparent shadow-[var(--shadow-sm)]",
              "hover:-translate-y-[1px] hover:shadow-[var(--shadow-md)]",
              "active:translate-y-0 active:shadow-[var(--shadow-sm)]"
            ),

          className
        )}
      >
        {/* Spinner */}
        {loading && (
          <span
            aria-hidden
            className={clsx(
              "absolute left-4 h-4 w-4 animate-spin rounded-full border-2",
              variant === "primary" || variant === "danger"
                ? "border-white/40 border-t-white"
                : "border-[var(--muted)]/40 border-t-[var(--fg)]"
            )}
          />
        )}

        <span
          className={clsx(
            "relative flex items-center gap-2",
            loading && "opacity-80"
          )}
        >
          {children}
        </span>
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
