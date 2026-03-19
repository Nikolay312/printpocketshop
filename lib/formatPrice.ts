export function formatPrice(
  cents: number,
  currency?: string | null
) {
  const safeCurrency =
    typeof currency === "string" && currency.length === 3
      ? currency.toUpperCase()
      : "EUR";

  // choose locale based on currency
  const locale =
    safeCurrency === "EUR"
      ? "de-DE"
      : safeCurrency === "BGN"
      ? "bg-BG"
      : "en-US";

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: safeCurrency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(cents / 100);
  } catch {
    // fallback safety
    return `€${(cents / 100).toFixed(2)}`;
  }
}