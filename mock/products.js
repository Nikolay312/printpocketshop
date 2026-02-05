exports.products = [
  {
    id: "1",
    title: "Minimal CV Resume Template",
    slug: "minimal-cv-resume-template",
    description:
      "Clean and modern CV template suitable for professionals and students.",

    price: 12,
    currency: "EUR",

    // MUST match category.id
    category: "cv-templates",

    previewImages: ["/images/cv-preview-1.jpg"],

    format: "CANVA",
    license: "personal",

    fileUrl: "/downloads/minimal-cv-template.pdf",

    isFeatured: true,
    sales: 42,
  },
  {
    id: "2",
    title: "Printable Business Thank You Card",
    slug: "business-thank-you-card",
    description:
      "Printable thank you card for small businesses after a sale or service.",

    price: 6,
    currency: "EUR",

    // MUST match category.id
    category: "business-cards",

    previewImages: ["/images/thankyou-preview.jpg"],

    format: "PDF",
    license: "commercial",

    fileUrl: "/downloads/business-thank-you-card.pdf",

    isFeatured: false,
    sales: 18,
  },
];
