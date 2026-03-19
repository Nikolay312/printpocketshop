export type VatInput = {
  buyerCountry: string;
  sellerCountry: string;
  hasVatNumber: boolean;
};

export type VatResult = {
  rate: number;
  applied: boolean;
};

export function computeVat({
  buyerCountry,
  sellerCountry,
  hasVatNumber,
}: VatInput): VatResult {
  // Reverse charge (cross-border B2B)
  if (buyerCountry !== sellerCountry && hasVatNumber) {
    return { rate: 0, applied: false };
  }

  // Domestic VAT
  if (buyerCountry === sellerCountry) {
    return { rate: 0.2, applied: true };
  }

  // Everything else
  return { rate: 0, applied: false };
}
