import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description:
    "Read the terms and conditions governing access to, purchases from, and use of digital products and services provided by PrintPocketShop.",
};

const sections = [
  { id: "acceptance", title: "1. Acceptance of These Terms" },
  { id: "eligibility", title: "2. Eligibility and Use of the Site" },
  { id: "accounts", title: "3. Accounts and Account Security" },
  { id: "products", title: "4. Digital Products and Delivery" },
  { id: "pricing", title: "5. Pricing, Payments, and Taxes" },
  { id: "license", title: "6. License and Permitted Use" },
  { id: "restrictions", title: "7. Prohibited Uses" },
  { id: "refunds", title: "8. Refunds and Cancellations" },
  { id: "intellectual-property", title: "9. Intellectual Property Rights" },
  { id: "availability", title: "10. Site Availability and Changes" },
  { id: "disclaimer", title: "11. Disclaimers" },
  { id: "liability", title: "12. Limitation of Liability" },
  { id: "indemnity", title: "13. Indemnification" },
  { id: "termination", title: "14. Suspension and Termination" },
  { id: "privacy", title: "15. Privacy and Data Use" },
  { id: "law", title: "16. Governing Law" },
  { id: "changes", title: "17. Changes to These Terms" },
  { id: "contact", title: "18. Contact Information" },
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

export default function TermsPage() {
  return (
    <main className="relative overflow-hidden bg-background">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-background" />
        <div className="absolute -top-40 -left-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-1/4 -right-28 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)]">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl">

              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                Terms & Conditions
              </h1>

              <p className="mt-4 text-sm leading-7 text-muted">
                These Terms & Conditions explain the rules that apply when
                you access PrintPocketShop, create an account, purchase digital
                products, or use any content, downloads, and services made
                available through the site.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-6 text-muted">
                Please read these terms carefully before placing an order or
                using any purchased files.
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

          {/* Content */}
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
                  Welcome to PrintPocketShop. These Terms & Conditions
                  (“Terms”) form a legally binding agreement between you and
                  PrintPocketShop regarding your access to and use of our
                  website, products, downloads, content, customer account
                  features, and any related services that we make available.
                </p>

                <p>
                  By accessing this site, creating an account, purchasing a
                  product, downloading a file, or otherwise using our services,
                  you acknowledge that you have read, understood, and agreed to
                  be bound by these Terms. If you do not agree with these
                  Terms, you should not use the site or purchase any products
                  from us.
                </p>

                <p>
                  Because PrintPocketShop sells digital products, it is
                  especially important that customers understand the scope of
                  permitted use, the limitations on redistribution, and the
                  policies that govern access, payment, licensing, and refunds.
                </p>
              </div>
            </section>

            <SectionCard id="acceptance" title="1. Acceptance of These Terms">
              <p>
                These Terms apply to all visitors, customers, account holders,
                and users of PrintPocketShop. Your use of the site constitutes
                acceptance of these Terms as they appear at the time of use.
              </p>
              <p>
                If you are using the site or purchasing products on behalf of a
                business, organization, or other legal entity, you represent
                that you have authority to bind that entity to these Terms, and
                references to “you” will include that entity.
              </p>
            </SectionCard>

            <SectionCard id="eligibility" title="2. Eligibility and Use of the Site">
              <p>
                You may use this site only if you are legally capable of
                entering into a binding agreement under applicable law. By using
                the site, you represent that the information you provide is
                accurate, current, and complete.
              </p>
              <p>
                You agree to use the site only for lawful purposes and in a way
                that does not infringe the rights of others, interfere with
                normal site operations, or compromise the security, stability,
                or performance of the platform.
              </p>
            </SectionCard>

            <SectionCard id="accounts" title="3. Accounts and Account Security">
              <p>
                Certain features of PrintPocketShop may require you to create an
                account. You are responsible for maintaining the confidentiality
                of your login credentials and for all activity conducted through
                your account.
              </p>
              <p>
                You agree to notify us promptly if you suspect unauthorized
                access, loss of credentials, or any security incident involving
                your account. We are not liable for losses resulting from your
                failure to maintain appropriate account security.
              </p>
              <p>
                We reserve the right to suspend, restrict, or terminate accounts
                that appear to be used fraudulently, unlawfully, abusively, or
                in breach of these Terms.
              </p>
            </SectionCard>

            <SectionCard id="products" title="4. Digital Products and Delivery">
              <p>
                PrintPocketShop provides digital products only. No physical
                products are shipped unless explicitly stated otherwise on the
                product page.
              </p>
              <p>
                After a successful purchase, digital files are generally made
                available through your account, download links, confirmation
                emails, or another delivery method specified at checkout. You
                are responsible for ensuring that the email address associated
                with your account is correct and that you can access your
                downloads after purchase.
              </p>
              <p>
                We may update product files, previews, descriptions, included
                assets, or technical requirements from time to time. Minor
                variations in display, formatting, color appearance, typography,
                or software compatibility may occur depending on your device,
                operating system, app version, or workflow.
              </p>
            </SectionCard>

            <SectionCard id="pricing" title="5. Pricing, Payments, and Taxes">
              <p>
                All prices displayed on the site are listed in the applicable
                currency shown at checkout, unless otherwise stated. We reserve
                the right to change prices, promotions, bundles, discounts, and
                product availability at any time without prior notice.
              </p>
              <p>
                Payment must be completed in full before access to purchased
                products is granted. You authorize us and our payment service
                providers to process the payment method you submit at checkout
                for the total amount due, including any applicable taxes, fees,
                or charges.
              </p>
              <p>
                You are responsible for any taxes, duties, levies, or similar
                charges that may apply to your purchase under the laws of your
                jurisdiction.
              </p>
            </SectionCard>

            <SectionCard id="license" title="6. License and Permitted Use">
              <p>
                Subject to full payment and continued compliance with these
                Terms, PrintPocketShop grants you a limited, non-exclusive,
                non-transferable, revocable license to use the purchased digital
                product for the purpose and scope described on the relevant
                product page or license description.
              </p>
              <p>
                Unless a broader commercial license is expressly stated, your
                purchase does not transfer ownership of the product or any
                intellectual property rights. It grants only the right to use
                the product as permitted by the applicable license.
              </p>
              <p>
                You may modify or adapt a purchased product for your own
                permitted use where the license allows it. However, modified
                versions remain subject to the same restrictions unless we have
                expressly agreed otherwise in writing.
              </p>
            </SectionCard>

            <SectionCard id="restrictions" title="7. Prohibited Uses">
              <p>You may not, unless expressly permitted by the applicable license or by our prior written consent:</p>
              <ul className="list-disc space-y-2 pl-5">
                <li>resell, sublicense, redistribute, or share the original product files;</li>
                <li>make purchased files publicly available for download or reuse;</li>
                <li>claim authorship, ownership, or exclusive rights over our products or source files;</li>
                <li>use products in a way that violates law, regulation, or third-party rights;</li>
                <li>remove copyright, branding, attribution, or proprietary notices where they exist;</li>
                <li>use bots, scraping tools, or other automated means to extract content from the site without permission;</li>
                <li>attempt to reverse engineer, circumvent, disable, or interfere with site security features or access controls.</li>
              </ul>
              <p>
                Any use outside the scope of the granted license is strictly
                prohibited and may result in suspension of access, license
                revocation, legal action, or both.
              </p>
            </SectionCard>

            <SectionCard id="refunds" title="8. Refunds and Cancellations">
              <p>
                Because PrintPocketShop sells digital products that are
                typically delivered immediately after purchase, orders may be
                subject to limited refund eligibility. Please review our Refund
                Policy for the detailed terms that govern refund requests,
                exceptions, and claim handling.
              </p>
              <p>
                In general, refunds may be denied where a product has already
                been downloaded, accessed, or materially consumed, except where
                required by applicable law or where a product is proven to be
                materially defective and the issue cannot be reasonably
                resolved.
              </p>
              <p>
                Duplicate purchases, accidental orders, or customer
                compatibility issues may be reviewed on a case-by-case basis,
                but approval is not guaranteed unless required by law or
                explicitly stated in our Refund Policy.
              </p>
            </SectionCard>

            <SectionCard
              id="intellectual-property"
              title="9. Intellectual Property Rights"
            >
              <p>
                All content on PrintPocketShop, including but not limited to
                product files, previews, layouts, graphics, branding, text,
                logos, icons, downloadable assets, design systems, and website
                elements, is owned by or licensed to PrintPocketShop and is
                protected by intellectual property laws.
              </p>
              <p>
                Except for the limited license expressly granted after purchase,
                no rights, title, or interest in any product or site content are
                transferred to you.
              </p>
            </SectionCard>

            <SectionCard id="availability" title="10. Site Availability and Changes">
              <p>
                We may update, suspend, restrict, discontinue, or modify any
                part of the site, product catalog, features, technical
                integrations, pricing, content, or services at any time and
                without liability.
              </p>
              <p>
                While we aim to maintain reliable access, we do not guarantee
                that the site or any download feature will be uninterrupted,
                secure, error-free, or compatible with all devices, browsers,
                software versions, or user environments at all times.
              </p>
            </SectionCard>

            <SectionCard id="disclaimer" title="11. Disclaimers">
              <p>
                The site and all products are provided on an “as is” and “as
                available” basis, to the fullest extent permitted by law. We
                make no warranties, whether express, implied, statutory, or
                otherwise, including without limitation warranties of
                merchantability, fitness for a particular purpose,
                non-infringement, availability, security, accuracy, or
                compatibility.
              </p>
              <p>
                We do not warrant that products will meet every individual
                workflow, software environment, commercial objective, design
                preference, or technical expectation. It is your responsibility
                to review product descriptions and requirements before
                purchasing.
              </p>
            </SectionCard>

            <SectionCard id="liability" title="12. Limitation of Liability">
              <p>
                To the maximum extent permitted by law, PrintPocketShop and its
                owners, affiliates, licensors, service providers, contractors,
                and partners will not be liable for any indirect, incidental,
                consequential, special, exemplary, or punitive damages, or for
                any loss of profits, data, goodwill, revenue, opportunity, or
                business interruption arising out of or relating to your use of
                the site or any product.
              </p>
              <p>
                To the extent liability cannot be excluded, our total aggregate
                liability arising from or related to any claim will not exceed
                the amount you paid for the specific product or order giving
                rise to the claim.
              </p>
            </SectionCard>

            <SectionCard id="indemnity" title="13. Indemnification">
              <p>
                You agree to defend, indemnify, and hold harmless
                PrintPocketShop and its affiliates, officers, owners,
                contractors, service providers, and licensors from and against
                any claims, damages, liabilities, losses, costs, and expenses,
                including reasonable legal fees, arising out of or related to
                your misuse of the site, your breach of these Terms, your
                violation of law, or your infringement of any third-party right.
              </p>
            </SectionCard>

            <SectionCard id="termination" title="14. Suspension and Termination">
              <p>
                We reserve the right to suspend, restrict, or terminate your
                access to the site, your account, or your licenses at any time
                if we reasonably believe that you have violated these Terms,
                misused our products, engaged in fraudulent activity, attempted
                unauthorized distribution, or created risk or legal exposure for
                us or other users.
              </p>
              <p>
                Termination or suspension does not limit any other legal or
                equitable remedies that may be available to us.
              </p>
            </SectionCard>

            <SectionCard id="privacy" title="15. Privacy and Data Use">
              <p>
                Your use of the site is also subject to our Privacy Policy,
                which explains how we collect, use, store, and protect personal
                information. By using the site, you acknowledge that your
                information may be processed in accordance with that policy.
              </p>
              <p>
                We encourage you to review the Privacy Policy carefully,
                especially if you create an account, subscribe to updates, make
                a purchase, or contact customer support.
              </p>
            </SectionCard>

            <SectionCard id="law" title="16. Governing Law">
              <p>
                These Terms and any dispute arising out of or relating to these
                Terms, the site, or any product purchased from PrintPocketShop
                will be governed by and interpreted in accordance with the laws
                applicable in the jurisdiction in which PrintPocketShop
                operates, without regard to conflict of laws principles, except
                where mandatory consumer protection laws require otherwise.
              </p>
            </SectionCard>

            <SectionCard id="changes" title="17. Changes to These Terms">
              <p>
                We may revise these Terms from time to time to reflect changes
                to our business, product offerings, legal requirements, payment
                systems, licensing practices, or operational processes.
              </p>
              <p>
                Updated Terms become effective when posted on this page unless a
                different effective date is stated. Your continued use of the
                site after updated Terms are posted constitutes acceptance of
                the revised Terms.
              </p>
            </SectionCard>

            <SectionCard id="contact" title="18. Contact Information">
              <p>
                If you have any questions about these Terms & Conditions, your
                license rights, a purchase, or a policy issue, please contact
                us through the contact method listed on the site.
              </p>
              <p>
                For faster support, include the email address associated with
                your order and any relevant order details when reaching out.
              </p>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}