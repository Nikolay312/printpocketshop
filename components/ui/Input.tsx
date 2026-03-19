"use client";

import {
  InputHTMLAttributes,
  forwardRef,
  useId,
} from "react";
import clsx from "clsx";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  error?: string;
  containerClassName?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      containerClassName,
      error,
      disabled,
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const errorId = `${inputId}-error`;

    const hasError = Boolean(error);

    return (
      <div
        className={clsx(
          "w-full space-y-2",
          containerClassName
        )}
      >
        <input
          ref={ref}
          id={inputId}
          {...props}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? errorId : undefined}
          className={clsx(
            /* Base */
            "w-full h-11 px-4",
            "rounded-[var(--radius-md)]",
            "text-sm text-[var(--fg)]",
            "bg-[var(--surface)]",
            "border border-[var(--border)]",
            "shadow-[var(--shadow-xs)]",
            "transition-all duration-200 ease-[var(--ease-out)]",
            "placeholder:text-[var(--muted-2)]",
            "focus:outline-none",
            "will-change-[border-color,box-shadow]",

            /* Normal hover */
            !hasError &&
              "hover:border-[var(--border-strong)]",

            /* Focus state (Premium) */
            !hasError &&
              "focus:border-[var(--accent)] focus:shadow-[var(--shadow-sm)] focus-visible:shadow-[var(--ring)]",

            /* Error state */
            hasError &&
              "border-[var(--danger)] focus:border-[var(--danger)] focus-visible:shadow-[0_0_0_3px_rgba(220,38,38,0.20)]",

            /* Disabled */
            disabled &&
              "cursor-not-allowed bg-[var(--surface-2)] text-[var(--muted)] border-[var(--border)] shadow-none opacity-90",

            className
          )}
        />

        {/* Error message */}
        {hasError && (
          <p
            id={errorId}
            className="text-xs leading-relaxed text-[var(--danger)]"
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
