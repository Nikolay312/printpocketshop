import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Find detailed answers to common questions about PrintPocketShop orders, downloads, file formats, licenses, payments, refunds, and customer support.",
};

const sections = [
  { id: "orders-access", title: "1. Orders, Downloads & Account Access" },
  { id: "files-compatibility", title: "2. Files, Formats & Compatibility" },
  { id: "licenses-usage", title: "3. Licenses & Permitted Use" },
  { id: "payments-refunds", title: "4. Payments, Billing & Refunds" },
  { id: "support", title: "5. Support & Additional Help" },
];

const faqGroups = [
  {
    id: "orders-access",
    title: "1. Orders, Downloads & Account Access",
    faqs: [
      {
        question: "How do downloads work after purchase?",
        answer:
          "After a successful purchase, your digital files are generally made available through your customer account, download area, order confirmation, or other delivery method shown at checkout. Because PrintPocketShop provides digital products, delivery is typically fast and does not involve physical shipping. We recommend creating or maintaining access to your account so you can manage your downloads and order history more easily.",
      },
      {
        question: "Can I download my files again later?",
        answer:
          "In most cases, yes. Purchased files are typically associated with your account so that you can re-access them later if needed. Continued access may depend on your account status, product availability, and any technical or policy limitations that apply at the time. For the best experience, keep your account email current and store backups of important purchased files for your own records.",
      },
      {
        question: "Do I need an account to access my purchases?",
        answer:
          "Account-based access is generally the most reliable way to manage purchases, re-download products, and view your order history. If the site allows a purchase flow that later connects to an account, you may still be asked to log in or verify your email in order to manage your downloads securely.",
      },
      {
        question: "What should I do if I cannot find my download?",
        answer:
          "First, check your account, any order confirmation messages, and any download or library area associated with your purchase. If the file still cannot be located, contact support with the email address used for the order, the product name, and the approximate purchase date so the issue can be reviewed promptly.",
      },
      {
        question: "Will I receive a physical item in the mail?",
        answer:
          "Unless a product page clearly states otherwise, PrintPocketShop products are digital only. That means no printed item or physical shipment is included. You receive access to downloadable files, templates, or digital assets rather than a physical package.",
      },
    ],
  },
  {
    id: "files-compatibility",
    title: "2. Files, Formats & Compatibility",
    faqs: [
      {
        question: "What file formats are included with products?",
        answer:
          "File formats vary by product and are listed on the relevant product page. Depending on the item, formats may include PDF files, editable templates, image assets, design source files, or other digital formats. You should always review the product description carefully before purchase to confirm what is included.",
      },
      {
        question: "How do I know whether a product is compatible with my software?",
        answer:
          "Compatibility depends on the specific product, file type, and the software or tools you intend to use. Product pages should be treated as the primary reference for compatibility, included formats, editing requirements, and recommended use. If you rely on a particular workflow, application version, or platform, it is best to confirm compatibility before purchasing.",
      },
      {
        question: "Can I edit the files after purchase?",
        answer:
          "Many products are intended to be customized, but editability depends on the file type and product design. Some files may be ready to use as-is, while others may support editing in compatible software. The extent to which a product can be edited should be described on the product page or in the included documentation.",
      },
      {
        question: "Why might a file look different on my device or printer?",
        answer:
          "Display and output can vary depending on your screen, printer, software, operating system, fonts, color settings, paper type, export method, and other technical factors. Digital previews are intended to help illustrate the design, but exact results may differ slightly based on your environment and setup.",
      },
      {
        question: "What if I have trouble opening or using a file?",
        answer:
          "If you experience a technical issue, contact support before assuming the product is unusable. In many cases, file access problems can be resolved through replacement links, clarification, updated files, or product-specific guidance. Including screenshots, error messages, and your software details can help speed up support.",
      },
    ],
  },
  {
    id: "licenses-usage",
    title: "3. Licenses & Permitted Use",
    faqs: [
      {
        question: "What license is included with a product?",
        answer:
          "Each product is sold with a defined license, and the scope of permitted use depends on the license type selected at purchase and any terms stated on the product page. In general, personal licenses are intended for private, non-commercial use, while commercial licenses may allow broader professional or client-related use. Full details should be reviewed on the License page.",
      },
      {
        question: "Can I use a purchased product for client work?",
        answer:
          "That depends on the license. A commercial license may allow use in professional or client-facing work, but this does not usually mean you may transfer the original source files to the client for independent reuse unless that right is expressly granted. If your use case involves client delivery, repeated deployment, or multi-user access, review the license terms carefully before proceeding.",
      },
      {
        question: "Can I resell or share the files I purchase?",
        answer:
          "No, not unless PrintPocketShop has expressly granted that right in writing. In most cases, you may not resell, redistribute, sublicense, upload, share, or otherwise provide the original files or source materials to others. This restriction generally applies even if you have edited or customized the files.",
      },
      {
        question: "Do I own the product after purchase?",
        answer:
          "No. A purchase gives you a license to use the product within the allowed scope; it does not transfer ownership of the original design, source files, or intellectual property. PrintPocketShop or its licensors retain ownership of the original product unless otherwise stated in writing.",
      },
      {
        question: "What if I need broader rights than my current license allows?",
        answer:
          "If your intended use goes beyond the scope of your original license, you should obtain the appropriate upgraded or alternative license before using the product in that way. This may apply if you move from personal use to commercial use, expand into client work, or need broader deployment rights.",
      },
    ],
  },
  {
    id: "payments-refunds",
    title: "4. Payments, Billing & Refunds",
    faqs: [
      {
        question: "When am I charged for an order?",
        answer:
          "You are typically charged at the time of checkout when your payment is submitted and approved. Access to digital products is usually granted only after payment has been successfully completed.",
      },
      {
        question: "What payment issues can occur?",
        answer:
          "Payment issues may arise from card authorization problems, billing mismatches, fraud screening, insufficient funds, payment provider interruptions, or technical checkout errors. If you believe you were charged incorrectly or encountered an unusual billing issue, contact support with the relevant order information so it can be reviewed.",
      },
      {
        question: "Are refunds available for digital purchases?",
        answer:
          "Because PrintPocketShop sells digital products that are often delivered immediately after purchase, refunds are generally limited. In many cases, completed digital purchases are treated as final. However, certain issues, such as duplicate purchases, billing errors, or materially defective files, may be reviewed in accordance with the Refund Policy and any applicable law.",
      },
      {
        question: "What should I do if I bought the same product twice?",
        answer:
          "If you believe you made a duplicate purchase by mistake, contact support as soon as possible with the relevant order details. Duplicate orders may be reviewed for refund or credit eligibility depending on the circumstances and account history.",
      },
      {
        question: "Where can I read the full refund terms?",
        answer:
          "The full refund terms, including what is generally non-refundable and the limited circumstances in which a refund may be reviewed, are set out on the Refund Policy page. Customers should review that policy before purchase, especially for immediately accessible digital goods.",
      },
    ],
  },
  {
    id: "support",
    title: "5. Support & Additional Help",
    faqs: [
      {
        question: "How do I get help with a product or order?",
        answer:
          "If you need assistance, please contact support using the method listed on the site. To help us respond efficiently, include your order email address, the product name, a short description of the issue, and any useful supporting details such as screenshots or error messages.",
      },
      {
        question: "Can you clarify whether my use case is allowed?",
        answer:
          "Yes. If you are unsure whether a specific business, client, resale, printing, or digital usage scenario is covered by your license, it is best to ask before using the product in that way. Licensing questions are important because the permitted scope can vary depending on the product and the license selected.",
      },
      {
        question: "Do you provide custom support for every software workflow?",
        answer:
          "Support is generally focused on product access, file delivery, and reasonable product-related clarification. While we try to help where possible, we may not be able to provide full technical consulting for every external tool, software version, device environment, or custom workflow.",
      },
      {
        question: "What if my question is not covered here?",
        answer:
          "This FAQ is intended as a general guide, but it does not replace the full Terms, License, Refund Policy, or Privacy Policy. If your situation is specific or unusual, please contact us directly so we can review it based on the actual product, order, and intended use.",
      },
    ],
  },
];

function SectionCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      className="scroll-mt-32 rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-8"
    >
      <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
        {title}
      </h2>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function FAQItem({
  question,
  answer,
}: {
  question: string;
  answer: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <h3 className="text-base font-semibold tracking-tight text-foreground">
        {question}
      </h3>
      <p className="mt-3 text-sm leading-7 text-muted sm:text-[15px]">
        {answer}
      </p>
    </div>
  );
}

export default function FAQPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/4 -right-28 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl">


              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                Frequently Asked Questions
              </h1>

              <p className="mt-4 text-sm leading-7 text-muted">
                Find structured answers to common questions about orders,
                downloads, file formats, licenses, payments, refunds, and
                support. This page is designed to give clear guidance before
                and after purchase.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-6 text-muted">
                For policy-specific details, please also review the Terms,
                License, Refund Policy, and Privacy Policy pages.
              </div>

              <nav className="mt-8 hidden lg:block">
                <p className="mb-3 text-xs font-medium uppercase tracking-[0.14em] text-muted">
                  On this page
                </p>

                <ul className="space-y-2">
                  {sections.map((section) => (
                    <li key={section.id}>
                      <a
                        href={`#${section.id}`}
                        className="block rounded-xl px-3 py-2 text-sm text-muted transition hover:bg-white/[0.05] hover:text-foreground"
                      >
                        {section.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>

          <div className="space-y-8">
            <section className="rounded-[32px] border border-white/10 bg-white/[0.05] p-8 shadow-[0_25px_80px_rgba(0,0,0,0.14)] backdrop-blur-2xl sm:p-10">
              <div className="max-w-3xl space-y-5 text-sm leading-7 text-muted sm:text-[15px]">
                <p>
                  This FAQ page provides a practical overview of the questions
                  customers most often ask before and after purchasing from
                  PrintPocketShop. It is intended to make common topics easier
                  to understand, including digital delivery, product access,
                  file formats, licensing, billing, and support.
                </p>

                <p>
                  Because PrintPocketShop sells digital products, some policies
                  differ from what customers may expect from physical retail.
                  For example, delivery is typically electronic, access may be
                  account-based, and refund rights are often more limited once
                  files have been made available.
                </p>

                <p>
                  This page is for general guidance only. If your question
                  involves a specific product, order, licensing scenario, or
                  technical issue, please review the relevant policy page or
                  contact support directly for clarification.
                </p>
              </div>
            </section>

            {faqGroups.map((group) => (
              <SectionCard key={group.id} id={group.id} title={group.title}>
                {group.faqs.map((faq) => (
                  <FAQItem
                    key={faq.question}
                    question={faq.question}
                    answer={faq.answer}
                  />
                ))}
              </SectionCard>
            ))}

            <section className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-8">
              <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                Still need help?
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted sm:text-[15px]">
                If your question is not covered here, please contact us with
                the product name, your order email address, and a brief
                explanation of the issue or use case. That helps us respond
                more accurately and provide guidance that matches your actual
                situation.
              </p>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}