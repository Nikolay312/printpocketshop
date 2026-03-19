import Link from "next/link";
import DiscountCodeForm from "@/components/admin/DiscountCodeForm";
import { createDiscountCode } from "@/lib/admin.server";

export default function AdminNewCodePage() {

  async function action(formData: FormData) {
    "use server";
    await createDiscountCode(formData);
  }

  return (
    <div className="space-y-24">
      <section className="rounded-3xl border border-border bg-background shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-between px-16 pt-16">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Create Discount Code
            </h1>

            <p className="mt-2 text-sm text-muted">
              Create a new discount code for checkout.
            </p>
          </div>

          <Link
            href="/admin/codes"
            className="inline-flex items-center rounded-full border border-border px-5 py-2 text-sm font-medium text-foreground transition hover:bg-muted/20"
          >
            Back
          </Link>
        </div>

        <div className="px-16 py-16">
          <DiscountCodeForm action={action} />
        </div>
      </section>
    </div>
  );
}