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
  const [passwordErrorMessage, setPasswordErrorMessage] =
    useState<string | null>(null);

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
    <div className="mx-auto w-full max-w-5xl space-y-6 sm:space-y-8">

      <section className="space-y-6 sm:space-y-8">
        <div className="rounded-3xl bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                  Change password
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Update your credentials to keep your account secure across all
                  devices.
                </p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-5 sm:space-y-6">
              <div className="grid gap-4 sm:gap-5">
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
              </div>

              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="inline-flex min-h-11 items-center text-sm font-medium text-muted-foreground transition hover:text-foreground"
              >
                {showPasswords ? "Hide passwords" : "Show passwords"}
              </button>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                <Button
                  type="submit"
                  disabled={!isValid || passwordSaving === "saving"}
                >
                  {passwordSaving === "saving" ? "Updating..." : "Update password"}
                </Button>

                <div className="min-h-[24px] text-sm">
                  {passwordSaving === "saving" && (
                    <span className="animate-pulse text-muted-foreground">
                      Saving changes…
                    </span>
                  )}
                  {passwordSaving === "saved" && (
                    <span className="text-emerald-600">Password updated</span>
                  )}
                  {passwordSaving === "error" && (
                    <span className="text-red-600">{passwordErrorMessage}</span>
                  )}
                </div>
              </div>
            </form>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-6 lg:p-8">
          <div className="mb-6 space-y-2">
            <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Email preferences
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              Control which account and product emails you receive while keeping
              essential operational messages enabled.
            </p>
          </div>

          <div className="space-y-3 sm:space-y-4">
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

            <div className="min-h-[22px] px-1">
              {notificationSaving === "saved" && (
                <p className="text-sm text-emerald-600">
                  Notification preferences updated.
                </p>
              )}

              {notificationSaving === "error" && notificationError && (
                <p className="text-sm text-red-600">{notificationError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-card p-5 shadow-[0_10px_30px_rgba(0,0,0,0.06)] sm:p-6 lg:p-8">
          <DangerZone />
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
    <label className="block space-y-2.5">
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
    <div className="rounded-2xl bg-muted/35 p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-semibold text-foreground">{label}</p>

            {required && (
              <span className="rounded-full bg-background px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Required
              </span>
            )}
          </div>

          <p className="text-sm leading-6 text-muted-foreground">
            {description}
          </p>

          {saving && (
            <p className="animate-pulse text-xs font-medium text-muted-foreground">
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
            className={`relative inline-flex h-8 w-14 shrink-0 items-center rounded-full transition-all duration-300 ease-out focus:outline-none ${
              checked ? "bg-emerald-500" : "bg-slate-300"
            } ${
              disabled
                ? "cursor-not-allowed opacity-60"
                : "hover:scale-[1.03] active:scale-[0.97]"
            }`}
          >
            <span
              className={`inline-block h-6 w-6 rounded-full bg-white shadow-sm transition-all duration-300 ease-out ${
                checked ? "translate-x-7" : "translate-x-1"
              }`}
            />
          </button>
        ) : (
          <div className="inline-flex w-fit shrink-0 items-center rounded-full bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700">
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
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          Delete account
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          This action permanently removes your account and associated data. It
          cannot be undone.
        </p>
      </div>

      {!confirming && (
        <div className="pt-1">
          <Button variant="danger" onClick={() => setConfirming(true)}>
            Delete account
          </Button>
        </div>
      )}

      {confirming && (
        <div className="rounded-2xl bg-red-50/70 p-4 sm:p-5">
          <div className="space-y-4">
            <p className="text-sm font-medium text-red-700">
              Enter your password to confirm permanent deletion.
            </p>

            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {error && <p className="text-sm text-red-600">{error}</p>}

            <div className="flex flex-col gap-3 sm:flex-row">
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
    <div className="rounded-2xl bg-muted/35 p-4">
      <div className="space-y-2.5">
        {items.map((item) => (
          <div key={item.label} className="flex items-center gap-2.5 text-sm">
            <span
              className={`h-2.5 w-2.5 rounded-full ${
                item.ok ? "bg-emerald-500" : "bg-muted-foreground/30"
              }`}
            />
            <span className={item.ok ? "text-foreground" : "text-muted-foreground"}>
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}