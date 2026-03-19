import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Refund Policy",
  description:
    "Read PrintPocketShop's refund policy for digital products, including eligibility, exceptions, technical issue handling, and customer support.",
};

const sections = [
  { id: "general", title: "1. General Policy" },
  { id: "digital-products", title: "2. Nature of Digital Products" },
  { id: "non-refundable", title: "3. Non-Refundable Circumstances" },
  { id: "eligible", title: "4. When a Refund May Be Considered" },
  { id: "technical-issues", title: "5. Technical Issues and Support" },
  { id: "duplicates", title: "6. Duplicate or Accidental Purchases" },
  { id: "how-to-request", title: "7. How to Request a Refund Review" },
  { id: "processing", title: "8. Review and Processing" },
  { id: "chargebacks", title: "9. Chargebacks and Abuse Prevention" },
  { id: "changes", title: "10. Changes to This Policy" },
  { id: "contact", title: "11. Contact Us" },
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
      <div className="mt-5 space-y-4 text-sm leading-7 text-muted sm:text-[15px]">
        {children}
      </div>
    </section>
  );
}

export default function RefundPolicyPage() {
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
                Refund Policy
              </h1>

              <p className="mt-4 text-sm leading-7 text-muted">
                This policy explains how refund requests are handled for
                purchases made through PrintPocketShop, with particular
                attention to the nature of digital products and instant file
                access.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-6 text-muted">
                Please review this policy carefully before completing your
                purchase, as most digital product orders are treated as final
                once access is granted.
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
              <p className="text-sm leading-7 text-muted">
                Last updated:{" "}
                <span className="font-medium text-foreground">
                  March 17, 2026
                </span>
              </p>

              <div className="mt-6 max-w-3xl space-y-5 text-sm leading-7 text-muted sm:text-[15px]">
                <p>
                  At PrintPocketShop, we aim to provide clear product
                  information, transparent licensing, and reliable access to
                  digital downloads. Because our products are delivered
                  electronically and are often made available immediately after
                  purchase, refund rights are more limited than they may be for
                  physical goods.
                </p>

                <p>
                  This Refund Policy explains when refunds are generally not
                  available, the limited situations in which a refund or credit
                  may be considered, and how we handle technical issues,
                  duplicate purchases, and customer support requests.
                </p>

                <p>
                  By placing an order through PrintPocketShop, you acknowledge
                  that you have reviewed this policy and understand the refund
                  conditions that apply to digital purchases.
                </p>
              </div>
            </section>

            <SectionCard id="general" title="1. General Policy">
              <p>
                All purchases made through PrintPocketShop are subject to this
                Refund Policy. Because we sell digital products that are
                commonly delivered instantly after payment, completed orders are
                generally treated as final.
              </p>
              <p>
                We encourage customers to review the product description,
                included files, compatibility notes, licensing information, and
                preview materials before making a purchase.
              </p>
            </SectionCard>

            <SectionCard id="digital-products" title="2. Nature of Digital Products">
              <p>
                PrintPocketShop sells digital goods only, unless a product page
                explicitly states otherwise. Digital products may include
                downloadable files, templates, assets, documents, design
                elements, or related content delivered electronically.
              </p>
              <p>
                Once a digital product has been purchased and access has been
                granted, whether through a download page, customer account,
                email delivery, or any other method, the product is considered
                delivered.
              </p>
              <p>
                Because digital files can usually be retained, copied, or stored
                immediately after access is granted, refunds are limited in
                order to protect the integrity of digital distribution and the
                intellectual property associated with our products.
              </p>
            </SectionCard>

            <SectionCard id="non-refundable" title="3. Non-Refundable Circumstances">
              <p>
                Refunds are generally not provided in the following situations:
              </p>

              <ul className="list-disc space-y-2 pl-5">
                <li>you changed your mind after purchase;</li>
                <li>you no longer need the product;</li>
                <li>you purchased the wrong item by mistake but had access to the files;</li>
                <li>you did not read the product description, license terms, or compatibility details before purchasing;</li>
                <li>you expected features, files, formats, or uses that were not stated on the product page;</li>
                <li>you are unable to use the files because of your own software limitations, lack of required applications, or unsupported workflow;</li>
                <li>you request a refund after substantially downloading, accessing, saving, or using the files.</li>
              </ul>

              <p>
                As a general rule, once digital content has been delivered or
                made accessible, refunds are not guaranteed unless required by
                applicable law or expressly approved under the limited review
                circumstances described below.
              </p>
            </SectionCard>

            <SectionCard id="eligible" title="4. When a Refund May Be Considered">
              <p>
                Although most digital product purchases are non-refundable, we
                may review refund requests in limited circumstances, including:
              </p>

              <ul className="list-disc space-y-2 pl-5">
                <li>
                  the same product was purchased more than once in error;
                </li>
                <li>
                  you were charged incorrectly due to a confirmed billing issue;
                </li>
                <li>
                  the files delivered are materially corrupted, incomplete, or
                  unusable, and the issue cannot be resolved by replacement or support;
                </li>
                <li>
                  the delivered product materially differs from its published description;
                </li>
                <li>
                  a refund is required under applicable consumer protection law.
                </li>
              </ul>

              <p>
                Any refund review is conducted at our discretion, subject to the
                facts of the order, the product involved, the extent of file
                access, and any legal obligations that may apply.
              </p>
            </SectionCard>

            <SectionCard id="technical-issues" title="5. Technical Issues and Support">
              <p>
                If you experience difficulty downloading, opening, accessing, or
                using your purchased files, please contact us before requesting
                a refund. In many cases, technical issues can be resolved
                through support, replacement files, updated download links, or
                clarification regarding product use.
              </p>
              <p>
                A technical issue does not automatically qualify an order for a
                refund. We reserve the right to first attempt a reasonable fix
                or support solution where the product itself is valid but an
                access or usage problem has occurred.
              </p>
              <p>
                To help us assist efficiently, please provide as much detail as
                possible, including the product name, order details, a clear
                description of the problem, and screenshots or error messages if
                available.
              </p>
            </SectionCard>

            <SectionCard id="duplicates" title="6. Duplicate or Accidental Purchases">
              <p>
                If you accidentally purchase the same product more than once,
                please contact us promptly. Duplicate purchases may be eligible
                for a refund or store credit where the duplicate transaction can
                be verified and no abuse is suspected.
              </p>
              <p>
                We may decline duplicate refund requests where there is evidence
                of repeated misuse, excessive claims, or circumstances that
                suggest the account or order was used improperly.
              </p>
            </SectionCard>

            <SectionCard id="how-to-request" title="7. How to Request a Refund Review">
              <p>
                To request a refund review, please contact us using the support
                method listed on the site and include the following details:
              </p>

              <ul className="list-disc space-y-2 pl-5">
                <li>your full name and email address used for the order;</li>
                <li>the product name and approximate purchase date;</li>
                <li>the reason for your request;</li>
                <li>any relevant screenshots, billing references, or error details.</li>
              </ul>

              <p>
                Providing complete and accurate information helps us review your
                request more quickly and fairly.
              </p>
            </SectionCard>

            <SectionCard id="processing" title="8. Review and Processing">
              <p>
                Once we receive a refund request, we may review order records,
                download activity, file access history, communications, billing
                details, and any supporting information you provide.
              </p>
              <p>
                If a refund is approved, it will generally be issued to the
                original payment method used for the purchase, unless otherwise
                required by law or agreed with you. Processing times may vary
                depending on the payment provider and financial institution.
              </p>
              <p>
                In some cases, we may offer a replacement file, correction,
                product exchange, or store credit instead of a cash refund where
                this is appropriate and lawful.
              </p>
            </SectionCard>

            <SectionCard id="chargebacks" title="9. Chargebacks and Abuse Prevention">
              <p>
                If you believe a transaction was unauthorized, please contact us
                first so we can investigate and help resolve the matter.
              </p>
              <p>
                Fraudulent refund claims, abusive chargebacks, repeated misuse
                of customer support, or attempts to obtain products without
                paying may result in account suspension, refusal of future
                service, revocation of licenses, or further action where
                appropriate.
              </p>
            </SectionCard>

            <SectionCard id="changes" title="10. Changes to This Policy">
              <p>
                We may update this Refund Policy from time to time to reflect
                changes in our business operations, product offerings, customer
                support procedures, legal requirements, or digital delivery
                practices.
              </p>
              <p>
                Any updated version becomes effective when posted on this page,
                unless a different effective date is stated.
              </p>
            </SectionCard>

            <SectionCard id="contact" title="11. Contact Us">
              <p>
                If you have questions about this Refund Policy or wish to submit
                a refund-related request, please contact us through the support
                or contact method listed on PrintPocketShop.
              </p>
              <p>
                For the fastest assistance, include your order email address,
                product name, and a short explanation of the issue when reaching
                out.
              </p>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}