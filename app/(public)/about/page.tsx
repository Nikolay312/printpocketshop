export default function AboutPage() {
  return (
    <main className="relative overflow-hidden bg-background text-foreground">
      {/* BACKGROUND */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/4 -right-24 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* HERO */}
      <section className="relative px-6 pb-24 pt-32 sm:pb-28 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-8">
              <div className="space-y-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  About PrintPocketShop
                </p>

                <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                  Thoughtfully crafted digital templates for clear, modern work.
                </h1>
              </div>

              <p className="max-w-3xl text-base leading-8 text-muted sm:text-lg">
                PrintPocketShop is a digital template studio focused on clean
                structure, practical usability, and polished presentation. We
                create products that help individuals, teams, and businesses
                communicate more clearly through layouts that feel refined,
                usable, and intentionally designed.
              </p>

              <p className="max-w-3xl text-base leading-8 text-muted">
                Rather than producing generic files built around short-lived
                trends, we concentrate on fundamentals: hierarchy, spacing,
                readability, balance, and workflow. The goal is simple — to
                make digital products that look professional, feel reliable,
                and remain useful long after first download.
              </p>
            </div>

            <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.14)] backdrop-blur-2xl">
              <div className="space-y-8">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    What we focus on
                  </p>
                  <p className="mt-3 text-sm leading-7 text-muted">
                    Clear systems, elegant structure, and templates that are
                    actually useful in real workflows.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-semibold text-foreground">
                      Clarity
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Easy to read, easy to use, easy to trust.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-semibold text-foreground">
                      Structure
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Layout systems built with consistency and intent.
                    </p>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <p className="text-sm font-semibold text-foreground">
                      Usability
                    </p>
                    <p className="mt-2 text-sm leading-6 text-muted">
                      Practical files designed for real-world application.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO / STORY */}
      <section className="relative px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Our approach
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                Designed with purpose, not decoration.
              </h2>
            </div>

            <div className="space-y-6 text-base leading-8 text-muted">
              <p>
                At PrintPocketShop, design is not treated as surface styling.
                It is treated as structure — the invisible framework that makes
                information clearer, layouts more useful, and finished work more
                confident. Every template begins with organization first:
                spacing, alignment, visual rhythm, and hierarchy.
              </p>

              <p>
                This means our products are built to support practical outcomes,
                not just visual appeal. Whether a template is being used for a
                client-facing document, internal workflow, branding material, or
                personal organization, it should feel calm, coherent, and easy
                to work with.
              </p>

              <p>
                We believe good digital products should reduce friction. They
                should help people start faster, present better, and avoid the
                clutter that often comes from overdesigned or inconsistent
                templates. That philosophy shapes everything we make.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="relative border-y border-white/10 bg-white/[0.03] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Design principles
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              The standards behind every product.
            </h2>
            <p className="mt-5 text-base leading-8 text-muted">
              Every template follows the same core principles so the final
              result feels considered, useful, and professionally composed.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.10)] backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-foreground">
                Structured layouts
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                Grids, spacing systems, and content hierarchy are built with
                discipline so information feels organized rather than crowded.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.10)] backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-foreground">
                Practical usability
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                Products are created for actual use, with an emphasis on
                simplicity, editability, and efficient adaptation.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.10)] backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-foreground">
                Timeless presentation
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                We prefer lasting clarity over temporary trends, so designs stay
                relevant and professional over time.
              </p>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.10)] backdrop-blur-xl">
              <h3 className="text-lg font-semibold text-foreground">
                Consistent quality
              </h3>
              <p className="mt-4 text-sm leading-7 text-muted">
                Every product is developed with the same attention to visual
                balance, readability, and dependable customer use.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="relative px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.05] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.14)] backdrop-blur-2xl sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Built for
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                People who care how their work is presented.
              </h2>
              <p className="mt-5 text-base leading-8 text-muted">
                Our templates are built for professionals, creators, small
                businesses, organized individuals, and anyone who wants their
                materials to feel clean, coherent, and well considered.
              </p>
            </div>

            <div className="space-y-8">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-foreground">
                  For professionals
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Templates that support polished communication, credible
                  presentation, and efficient day-to-day work.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-foreground">
                  For client work
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Layouts designed to help deliver material that feels elevated,
                  trustworthy, and professionally structured.
                </p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl">
                <h3 className="text-lg font-semibold text-foreground">
                  For personal organization
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted">
                  Useful files that bring order and visual clarity to planning,
                  documentation, and everyday systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="relative px-6 pb-28 pt-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="rounded-[36px] border border-white/10 bg-white/[0.05] px-8 py-12 shadow-[0_25px_80px_rgba(0,0,0,0.14)] backdrop-blur-2xl sm:px-12 sm:py-14">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
              Final note
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Built for clarity, made to be used.
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-muted">
              PrintPocketShop exists to create digital products that feel more
              refined than ordinary templates and more usable than purely
              decorative assets. We design for people who value order,
              readability, and confident presentation — because the best
              templates do not compete with your content, they support it.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}