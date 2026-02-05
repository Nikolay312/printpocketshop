"use client";

import { createContext, useContext, useState } from "react";
import clsx from "clsx";

type ToastType = "success" | "error" | "warning";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastContextValue = {
  showToast: (message: string, type?: ToastType) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3200);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast stack */}
      <div className="fixed bottom-6 right-6 z-50 flex max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            role="status"
            aria-live="polite"
            className={clsx(
              "flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-medium",
              "border shadow-lg backdrop-blur-sm",
              "animate-in fade-in slide-in-from-bottom-2 duration-200",
              {
                /* Success */
                "bg-[var(--foreground)] text-white border-transparent":
                  toast.type === "success",

                /* Error */
                "bg-white text-foreground border-red-200":
                  toast.type === "error",

                /* Warning */
                "bg-white text-foreground border-yellow-200":
                  toast.type === "warning",
              }
            )}
          >
            {/* Icon */}
            <span
              className={clsx(
                "mt-0.5 flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold",
                {
                  "bg-white/20 text-white": toast.type === "success",
                  "bg-red-100 text-red-600": toast.type === "error",
                  "bg-yellow-100 text-yellow-700":
                    toast.type === "warning",
                }
              )}
            >
              {toast.type === "success" && "✓"}
              {toast.type === "error" && "!"}
              {toast.type === "warning" && "⚠"}
            </span>

            {/* Message */}
            <span className="leading-snug">{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside ToastProvider");
  }
  return ctx;
}
