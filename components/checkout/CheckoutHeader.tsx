interface Props {
  step: number;
}

export default function CheckoutHeader({ step }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
          Secure checkout
        </h1>

        <div className="text-xs font-medium tracking-wide text-muted">
          Step {step} of 3
        </div>
      </div>

      <div className="h-px w-full bg-border" />
    </div>
  );
}
