export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col">

      {/* Checkout Header */}
      <header className="bg-white border-b border-neutral-200">
        <div className="mx-auto max-w-[820px] px-6 h-[96px] flex items-center justify-center relative">

          {/* Progress */}
          <ProgressSteps />

        </div>
      </header>

      {/* Content */}
      <main className="flex-1">
        {children}
      </main>

    </div>
  );
}

/* ---------- Progress Component ---------- */

function ProgressSteps() {
  return (
    <div className="relative w-full max-w-[560px]">

      {/* Rail Background */}
      <div className="absolute top-[18px] left-0 right-0 h-[2px] bg-neutral-200" />

      {/* Active Rail */}
      <div className="absolute top-[18px] left-0 w-1/2 h-[2px] bg-black transition-all duration-700 ease-out" />

      {/* Steps */}
      <div className="relative flex justify-between text-sm font-medium">

        <Step label="Cart" completed />
        <Step label="Payment" active />
        <Step label="Confirmation" />

      </div>
    </div>
  );
}

function Step({
  label,
  active = false,
  completed = false,
}: {
  label: string;
  active?: boolean;
  completed?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-3 min-w-[80px]">

      {/* Circle */}
      <div
        className={`
          h-3 w-3 rounded-full transition-all duration-300
          ${active ? "bg-black scale-110" : ""}
          ${completed ? "bg-neutral-700" : ""}
          ${!active && !completed ? "bg-neutral-300" : ""}
        `}
      />

      {/* Label */}
      <span
        className={`
          transition-colors duration-200
          ${active ? "text-black" : ""}
          ${completed ? "text-neutral-700" : ""}
          ${!active && !completed ? "text-neutral-400" : ""}
        `}
      >
        {label}
      </span>

    </div>
  );
}