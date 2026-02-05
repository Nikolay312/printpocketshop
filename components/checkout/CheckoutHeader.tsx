interface Props {
  step: number;
}

export default function CheckoutHeader({ step }: Props) {
  return (
    <div className="space-y-2">
      <h1 className="text-3xl font-semibold">Checkout</h1>
      <p className="text-sm text-gray-500">
        Step {step} of 3 · Secure checkout
      </p>
    </div>
  );
}
