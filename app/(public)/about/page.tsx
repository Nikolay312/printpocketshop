export default function AboutPage() {
  return (
    <main>
      {/* HERO */}
      <section className="container-app py-28 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h1 className="text-4xl font-semibold tracking-tight">
            About PrintPocketShop
          </h1>

          <p className="text-lg text-muted leading-relaxed">
            PrintPocketShop is a curated marketplace for premium digital
            templates — designed to save time, elevate your work, and help
            you present yourself professionally.
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section className="bg-surface">
        <div className="container-app py-24 text-center">
          <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-2xl font-semibold">
              Our mission
            </h2>

            <p className="text-muted leading-relaxed">
              We created PrintPocketShop to make high-quality digital
              templates accessible and practical. From professionals and
              small businesses to students and creatives, our goal is to
              provide designs that are easy to use, affordable, and ready
              the moment you need them.
            </p>
          </div>
        </div>
      </section>

      {/* VALUES */}
      <section className="container-app py-24">
        <div className="space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-semibold">
              What sets us apart
            </h2>
            <p className="text-muted">
              Thoughtfully designed products you can rely on
            </p>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-8">
              <h3 className="font-semibold">
                Professional quality
              </h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Every product is crafted with attention to layout,
                typography, and usability — so your final result always
                looks polished and intentional.
              </p>
            </div>

            <div className="card p-8">
              <h3 className="font-semibold">
                Instant access
              </h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                All products are digital and available immediately after
                purchase, with lifetime access through your account.
              </p>
            </div>

            <div className="card p-8">
              <h3 className="font-semibold">
                Designed for real use
              </h3>
              <p className="mt-3 text-sm text-muted leading-relaxed">
                Our templates are made for real-world needs — easy to
                customize, compatible with modern tools, and ready to use
                without friction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* AUDIENCE */}
      <section className="bg-surface">
        <div className="container-app py-24 text-center">
          <div className="mx-auto max-w-4xl space-y-6">
            <h2 className="text-2xl font-semibold">
              Who PrintPocketShop is for
            </h2>

            <p className="text-muted leading-relaxed">
              Whether you’re preparing a resume, running a small business,
              planning an event, or organizing your life, PrintPocketShop
              provides practical, well-designed templates that help you get
              things done faster — without compromising quality.
            </p>
          </div>
        </div>
      </section>

      {/* CLOSING */}
      <section className="container-app py-24 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-2xl font-semibold">
            Designed to make your work easier
          </h2>

          <p className="text-muted leading-relaxed">
            PrintPocketShop is built around one simple idea: great design
            should work for you. Explore our collection and discover digital
            templates that are ready when you are.
          </p>
        </div>
      </section>
    </main>
  );
}
