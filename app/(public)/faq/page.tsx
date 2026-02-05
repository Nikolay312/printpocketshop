export default function FAQPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-24 space-y-20">
      {/* HEADER */}
      <header className="space-y-4">
        <h1 className="text-3xl font-semibold tracking-tight text-foreground">
          Frequently Asked Questions
        </h1>
        <p className="max-w-2xl text-muted leading-relaxed">
          Find answers to common questions about digital downloads, file formats,
          licenses, payments, and support.
        </p>
      </header>

      {/* FAQ LIST */}
      <section className="space-y-14">
        {/* DOWNLOADS */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Downloads & access
          </h2>

          <div className="space-y-2">
            <h3 className="font-medium text-foreground">
              How do downloads work?
            </h3>
            <p className="text-muted leading-relaxed">
              After completing your purchase, your digital files become
              instantly available. You can download them right away from your
              account under the <strong>Downloads</strong> section.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium text-foreground">
              Can I re-download my files later?
            </h3>
            <p className="text-muted leading-relaxed">
              Yes. All purchases include lifetime access, so you can re-download
              your files anytime from your account.
            </p>
          </div>
        </div>

        {/* FILES */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Files & compatibility
          </h2>

          <div className="space-y-2">
            <h3 className="font-medium text-foreground">
              What file formats do you provide?
            </h3>
            <p className="text-muted leading-relaxed">
              File formats vary by product and are always listed clearly on the
              product page. Common formats include PDF files, Canva templates,
              and other editable design formats.
            </p>
          </div>
        </div>

        {/* LICENSE */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Licenses & usage
          </h2>

          <div className="space-y-2">
            <h3 className="font-medium text-foreground">
              What license comes with the products?
            </h3>
            <p className="text-muted leading-relaxed">
              Each product includes a clearly defined license. Personal licenses
              are intended for individual use only, while commercial licenses
              allow use in client work or business projects. License details are
              displayed on every product page.
            </p>
          </div>
        </div>

        {/* PAYMENTS */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Payments & refunds
          </h2>

          <div className="space-y-2">
            <h3 className="font-medium text-foreground">
              Do you offer refunds?
            </h3>
            <p className="text-muted leading-relaxed">
              Because all products are digital and delivered instantly after
              purchase, refunds are not offered. We recommend reviewing the
              product description and details carefully before completing your
              order.
            </p>
          </div>
        </div>

        {/* SUPPORT */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Support
          </h2>

          <div className="space-y-2">
            <h3 className="font-medium text-foreground">
              What if I need help or have an issue?
            </h3>
            <p className="text-muted leading-relaxed">
              If you have any questions or experience issues with your purchase,
              feel free to contact us. We’re happy to help and aim to respond as
              quickly as possible.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="border-t border-border pt-12 text-center space-y-3">
        <p className="text-sm text-muted">
          Still have questions?
        </p>
        <a
          href="/contact"
          className="btn-primary inline-flex"
        >
          Contact support
        </a>
      </div>
    </main>
  );
}
