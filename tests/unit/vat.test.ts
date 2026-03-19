import { describe, it, expect } from "vitest";
import { computeVat } from "@/lib/vat";

describe("VAT calculation", () => {
  it("applies 20% VAT for same-country buyer", () => {
    const vat = computeVat({
      buyerCountry: "EU",
      sellerCountry: "EU",
      hasVatNumber: false,
    });

    expect(vat.rate).toBe(0.2);
    expect(vat.applied).toBe(true);
  });

  it("applies 0% VAT for cross-border with VAT number", () => {
    const vat = computeVat({
      buyerCountry: "DE",
      sellerCountry: "EU",
      hasVatNumber: true,
    });

    expect(vat.rate).toBe(0);
    expect(vat.applied).toBe(false);
  });

  it("applies 0% VAT for cross-border without VAT number", () => {
    const vat = computeVat({
      buyerCountry: "US",
      sellerCountry: "EU",
      hasVatNumber: false,
    });

    expect(vat.rate).toBe(0);
    expect(vat.applied).toBe(false);
  });
});
