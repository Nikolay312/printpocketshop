export default function TrustSection() {
  return (
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid gap-10 rounded-3xl bg-surface-muted p-12 text-center sm:grid-cols-3">
        <div>
          <h3 className="font-semibold">Instant access</h3>
          <p className="mt-2 text-sm text-muted">
            Download your files immediately after purchase.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Lifetime access</h3>
          <p className="mt-2 text-sm text-muted">
            Re-download your purchases anytime.
          </p>
        </div>

        <div>
          <h3 className="font-semibold">Professional quality</h3>
          <p className="mt-2 text-sm text-muted">
            Carefully crafted digital products.
          </p>
        </div>
      </div>
    </div>
  );
}
