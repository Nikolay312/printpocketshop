"use client";

import { useMemo, useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type PasswordSavingState = "idle" | "saving" | "saved" | "error";
type NotificationSavingState = "idle" | "saving" | "saved" | "error";

export default function AccountSettingsClient({
  initialProductUpdates,
}: {
  initialProductUpdates: boolean;
}) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const [productUpdates, setProductUpdates] = useState(initialProductUpdates);
  const [notificationSaving, setNotificationSaving] =
    useState<NotificationSavingState>("idle");
  const [notificationError, setNotificationError] = useState<string | null>(null);

  const [passwordSaving, setPasswordSaving] =
    useState<PasswordSavingState>("idle");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState<string | null>(null);

  const rules = useMemo(() => {
    return {
      length: newPassword.length >= 8,
      number: /\d/.test(newPassword),
      upper: /[A-Z]/.test(newPassword),
      match: newPassword.length > 0 && newPassword === confirmPassword,
    };
  }, [newPassword, confirmPassword]);

  const isValid =
    rules.length && rules.number && rules.upper && rules.match;

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    setPasswordSaving("saving");
    setPasswordErrorMessage(null);

    try {
      const res = await fetch("/api/account/change-password", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update password");
      }

      setPasswordSaving("saved");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setTimeout(() => setPasswordSaving("idle"), 1500);
    } catch (err: unknown) {
      setPasswordSaving("error");

      if (err instanceof Error) {
        setPasswordErrorMessage(err.message);
      } else {
        setPasswordErrorMessage("Something went wrong");
      }
    }
  };

  const handleToggleProductUpdates = async () => {
    if (notificationSaving === "saving") return;

    const nextValue = !productUpdates;

    setProductUpdates(nextValue);
    setNotificationSaving("saving");
    setNotificationError(null);

    try {
      const res = await fetch("/api/account/notifications", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productUpdatesEmail: nextValue,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update notification settings");
      }

      setNotificationSaving("saved");
      setTimeout(() => setNotificationSaving("idle"), 1200);
    } catch (err: unknown) {
      setProductUpdates(!nextValue);
      setNotificationSaving("error");

      if (err instanceof Error) {
        setNotificationError(err.message);
      } else {
        setNotificationError("Something went wrong");
      }
    }
  };

  return (
    <div className="space-y-24">
      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="px-24 py-24">
          <section className="space-y-8 py-10 first:pt-0">
            <div className="grid gap-10 lg:grid-cols-[280px_1fr]">
              <div className="space-y-3">
                <h3 className="text-base font-semibold text-foreground">
                  Change password
                </h3>
                <p className="text-sm text-muted leading-relaxed">
                  Update your credentials to keep your account secure.
                </p>
              </div>

              <form onSubmit={handlePasswordChange} className="max-w-md space-y-6">
                <Field label="Current password">
                  <Input
                    type={showPasswords ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </Field>

                <Field label="New password">
                  <Input
                    type={showPasswords ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </Field>

                {newPassword && <PasswordRules rules={rules} />}

                {newPassword.length > 0 && (
                  <Field label="Confirm new password">
                    <Input
                      type={showPasswords ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </Field>
                )}

                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="text-xs text-muted transition hover:text-foreground"
                >
                  {showPasswords ? "Hide passwords" : "Show passwords"}
                </button>

                <div className="flex items-center gap-4 pt-2">
                  <Button
                    type="submit"
                    disabled={!isValid || passwordSaving === "saving"}
                  >
                    Update password
                  </Button>

                  <span className="text-sm transition-all duration-300">
                    {passwordSaving === "saving" && (
                      <span className="animate-pulse text-muted">Saving…</span>
                    )}
                    {passwordSaving === "saved" && (
                      <span className="text-emerald-600">Password updated</span>
                    )}
                    {passwordSaving === "error" && (
                      <span className="text-red-600">{passwordErrorMessage}</span>
                    )}
                  </span>
                </div>
              </form>
            </div>
          </section>

          <div className="border-t border-border" />

          <section className="space-y-8 py-10">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Notifications
              </h3>
            </div>

            <div className="space-y-4">
              <NotificationCard
                label="Receipts & invoices"
                description="Includes purchase confirmations, payment receipts, and invoice delivery for completed orders."
                required
              />

              <NotificationCard
                label="Security notifications"
                description="Includes password changes and important account-related security alerts."
                required
              />

              <NotificationCard
                label="Product updates"
                description="Get notified when products you purchased receive meaningful updates, improvements, or new files."
                checked={productUpdates}
                onChange={handleToggleProductUpdates}
                saving={notificationSaving === "saving"}
                disabled={notificationSaving === "saving"}
              />

              <div className="min-h-[20px]">
                {notificationSaving === "saved" && (
                  <p className="text-sm text-emerald-600 transition-all duration-300">
                    Notification preferences updated.
                  </p>
                )}

                {notificationSaving === "error" && notificationError && (
                  <p className="text-sm text-red-600 transition-all duration-300">
                    {notificationError}
                  </p>
                )}
              </div>
            </div>
          </section>

          <div className="border-t border-border" />

          <section className="py-10 last:pb-0">
            <DangerZone />
          </section>
        </div>
      </section>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
    </label>
  );
}

function NotificationCard({
  label,
  description,
  checked,
  onChange,
  disabled = false,
  required = false,
  saving = false,
}: {
  label: string;
  description: string;
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean;
  required?: boolean;
  saving?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">
              {label}
            </p>

            {required && (
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600">
                Required
              </span>
            )}
          </div>

          <p className="text-xs leading-relaxed text-muted">
            {description}
          </p>

          {saving && (
            <p className="mt-1 animate-pulse text-xs text-muted">
              Saving…
            </p>
          )}
        </div>

        {!required ? (
          <button
            type="button"
            onClick={onChange}
            disabled={disabled || saving}
            aria-pressed={checked}
            aria-label={label}
            className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 ease-out focus:outline-none ${
              checked
                ? "bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.18)]"
                : "border border-border bg-slate-200"
            } ${disabled ? "cursor-not-allowed opacity-60" : "hover:scale-[1.03] active:scale-[0.97]"}`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow-sm transition-all duration-300 ease-out ${
                checked ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        ) : (
          <div className="self-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
            Always enabled
          </div>
        )}
      </div>
    </div>
  );
}

function DangerZone() {
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/account/delete", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete account");
      }

      window.location.href = "/";
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-border bg-muted/20 p-7">
      <div className="flex justify-between gap-6">
        <div>
          <h3 className="font-semibold text-foreground">Delete account</h3>
          <p className="text-sm text-muted">
            This will permanently remove your account and all associated data.
          </p>
        </div>

        {!confirming && (
          <Button variant="danger" onClick={() => setConfirming(true)}>
            Delete account
          </Button>
        )}
      </div>

      {confirming && (
        <div className="mt-6 space-y-4 rounded-xl border border-red-200 bg-red-50/40 p-5">
          <p className="text-sm font-medium text-red-700">
            Enter your password to confirm deletion.
          </p>

          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-3">
            <Button
              variant="danger"
              onClick={handleDelete}
              disabled={loading || !password}
            >
              {loading ? "Deleting..." : "Yes, delete permanently"}
            </Button>

            <Button
              variant="secondary"
              onClick={() => {
                setConfirming(false);
                setPassword("");
                setError(null);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordRules({ rules }: { rules: Record<string, boolean> }) {
  const items = [
    { label: "At least 8 characters", ok: rules.length },
    { label: "Contains a number", ok: rules.number },
    { label: "Contains uppercase letter", ok: rules.upper },
    { label: "Passwords match", ok: rules.match },
  ];

  return (
    <div className="space-y-2 rounded-xl border border-border bg-muted/30 p-4">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-2 text-sm">
          <span
            className={`h-2 w-2 rounded-full ${
              item.ok ? "bg-emerald-500" : "bg-muted-foreground/30"
            }`}
          />
          <span className={item.ok ? "text-foreground" : "text-muted"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}