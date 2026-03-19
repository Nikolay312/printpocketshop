import { notFound } from "next/navigation";
import Link from "next/link";

import {
  getDiscountCodeForAdmin,
  updateDiscountCode,
  deleteDiscountCode,
} from "@/lib/admin.server";

import DiscountCodeForm from "@/components/admin/DiscountCodeForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditCodePage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  const code = await getDiscountCodeForAdmin(id);

  if (!code) {
    notFound();
  }

  async function updateAction(formData: FormData) {
    "use server";
    await updateDiscountCode(id, formData);
  }

  async function deleteAction() {
    "use server";
    await deleteDiscountCode(id);
  }

  return (
    <div className="space-y-24">
      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        {/* Header */}
        <div className="flex items-center justify-between px-16 pt-16">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Edit Code
            </h1>

            <p className="mt-2 text-sm text-muted">
              Update discount code settings.
            </p>
          </div>

          <Link
            href="/admin/codes"
            className="inline-flex items-center rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition hover:bg-muted/20"
          >
            Back
          </Link>
        </div>

        {/* Form */}
        <div className="px-16 py-16">
          <DiscountCodeForm
            action={updateAction}
            defaultValues={{
              code: code.code,
              discountType: code.discountType,
              percentOff: code.percentOff,
              amountOff: code.amountOff,
              maxUses: code.maxUses,
              perUserLimit: code.perUserLimit,
              expiresAt: code.expiresAt,
              isActive: code.isActive,
            }}
          />
        </div>

        {/* Danger Zone */}
        <div className="border-t border-border px-16 py-12">
          <form action={deleteAction}>
            <button
              type="submit"
              className="rounded-full border border-red-500/30 px-5 py-2 text-sm font-medium text-red-600 transition hover:bg-red-500/10"
            >
              Delete Code
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}