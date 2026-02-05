export default function ContactPage() {
  return (
    <main>
      {/* HERO */}
      <section className="px-6 py-28 text-center">
        <div className="mx-auto max-w-2xl space-y-4">
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Contact us
          </h1>
          <p className="text-muted leading-relaxed">
            Have a question about a product, need help with an order, or want to
            get in touch? We’re happy to help.
          </p>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="px-6 pb-32">
        <div className="mx-auto max-w-3xl space-y-14">
          <div className="card p-10 space-y-8">
            {/* Intro */}
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-foreground">
                Send us a message
              </h2>
              <p className="text-sm text-muted">
                We usually respond within 24 hours on business days.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-6">
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted outline-none transition focus:border-[var(--accent)] focus:shadow-[var(--ring)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Subject
                </label>
                <input
                  type="text"
                  placeholder="How can we help?"
                  className="w-full rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted outline-none transition focus:border-[var(--accent)] focus:shadow-[var(--ring)]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  Message
                </label>
                <textarea
                  rows={5}
                  placeholder="Tell us a bit more about your question or issue…"
                  className="w-full resize-none rounded-md border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted outline-none transition focus:border-[var(--accent)] focus:shadow-[var(--ring)]"
                />
              </div>

              {/* CTA */}
              <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Send message
                </button>

                <p className="text-xs text-muted">
                  This form is for support and general inquiries only.
                </p>
              </div>
            </form>
          </div>

          {/* SUPPORT AREAS */}
          <div className="grid gap-8 text-center sm:grid-cols-3">
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                Product support
              </h3>
              <p className="text-sm text-muted">
                Help with downloads, files, or usage.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                Orders & billing
              </h3>
              <p className="text-sm text-muted">
                Questions about purchases or access.
              </p>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                General inquiries
              </h3>
              <p className="text-sm text-muted">
                Anything else — just ask.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
