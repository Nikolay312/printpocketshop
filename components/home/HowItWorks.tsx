export default function HowItWorks() {
  return (
    <div className="mx-auto max-w-6xl space-y-16 px-6 text-center">
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold">How it works</h2>
        <p className="text-muted">
          Simple, fast, and designed for instant access
        </p>
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[
          {
            title: "Choose a product",
            text: "Browse professionally designed digital templates.",
            icon: "🛍️",
          },
          {
            title: "Checkout securely",
            text: "Complete your purchase in seconds.",
            icon: "💳",
          },
          {
            title: "Instant download",
            text: "Access your files immediately after purchase.",
            icon: "⬇️",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-border bg-white p-8 text-center transition-all hover:-translate-y-1 hover:shadow-md"
          >
            <div className="text-3xl mb-4">{item.icon}</div>
            <h3 className="font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted">{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
