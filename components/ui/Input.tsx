"use client";

import { InputHTMLAttributes, forwardRef } from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ className, error, disabled, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        <input
          ref={ref}
          {...props}
          disabled={disabled}
          aria-invalid={!!error}
          className={clsx(
            /* Base */
            "w-full rounded-md px-3.5 py-2.5 text-sm text-foreground",
            "bg-background border transition-all duration-150 ease-out",
            "placeholder:text-muted",
            "focus:outline-none focus-visible:shadow-[var(--ring)]",

            /* States */
            error
              ? "border-red-500 focus:border-red-500 focus-visible:shadow-[0_0_0_3px_rgba(239,68,68,0.35)]"
              : "border-border hover:border-border focus:border-[var(--accent)]",

            disabled &&
              "cursor-not-allowed bg-surface-muted opacity-80 border-border",

            className
          )}
        />

        {/* Error message */}
        {error && (
          <p
            className="text-xs leading-snug text-red-600"
            aria-live="polite"
          >
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
