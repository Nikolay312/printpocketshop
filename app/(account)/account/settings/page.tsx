"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function AccountSettingsPage() {
  const [email, setEmail] = useState("user@example.com");
  const [name, setName] = useState("John Doe");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock save – backend integration later
    alert("Settings saved");
  };

  return (
    <main className="mx-auto max-w-3xl px-6 py-12 space-y-8">
      {/* Header */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-foreground">
          Account settings
        </h1>
        <p className="text-sm text-muted">
          Manage your personal information and account details.
        </p>
      </header>

      {/* Form */}
      <form
        onSubmit={handleSave}
        className="card space-y-6 p-6"
      >
        {/* Name */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Full name
          </label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Email address
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
          <p className="text-xs text-muted">
            This email is used for order confirmations and account access.
          </p>
        </div>

        {/* Actions */}
        <div className="flex justify-end">
          <Button type="submit">
            Save changes
          </Button>
        </div>
      </form>
    </main>
  );
}
