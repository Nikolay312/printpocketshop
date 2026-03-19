import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read how PrintPocketShop collects, uses, stores, and protects personal information when you browse the site, create an account, or purchase digital products.",
};

const sections = [
  { id: "overview", title: "1. Overview" },
  { id: "information-collected", title: "2. Information We Collect" },
  { id: "how-we-collect", title: "3. How Information Is Collected" },
  { id: "use-of-information", title: "4. How We Use Your Information" },
  { id: "legal-basis", title: "5. Legal Bases for Processing" },
  { id: "payments", title: "6. Payments and Transaction Data" },
  { id: "cookies", title: "7. Cookies and Similar Technologies" },
  { id: "sharing", title: "8. Sharing of Information" },
  { id: "retention", title: "9. Data Retention" },
  { id: "security", title: "10. Data Security" },
  { id: "international", title: "11. International Transfers" },
  { id: "rights", title: "12. Your Privacy Rights" },
  { id: "children", title: "13. Children's Privacy" },
  { id: "third-party-links", title: "14. Third-Party Links and Services" },
  { id: "changes", title: "15. Changes to This Policy" },
  { id: "contact", title: "16. Contact Us" },
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

export default function PrivacyPolicyPage() {
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
                Privacy Policy
              </h1>

              <p className="mt-4 text-sm leading-7 text-muted">
                This Privacy Policy explains how PrintPocketShop collects,
                uses, stores, protects, and shares personal information when
                you visit the site, create an account, make a purchase, or
                otherwise interact with our services.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-6 text-muted">
                Please read this policy carefully to understand how your
                information is handled and what choices may be available to
                you.
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
                  PrintPocketShop respects your privacy and is committed to
                  handling personal information responsibly. This Privacy Policy
                  describes the categories of information we may collect, how
                  that information is used, when it may be shared, how long it
                  may be retained, and the steps we take to help protect it.
                </p>

                <p>
                  This policy applies to personal information collected through
                  our website, digital storefront, customer accounts, checkout
                  process, support interactions, and other related services we
                  make available.
                </p>

                <p>
                  By using PrintPocketShop, creating an account, placing an
                  order, or otherwise interacting with the site, you acknowledge
                  that your information may be collected and processed in
                  accordance with this Privacy Policy.
                </p>
              </div>
            </section>

            <SectionCard id="overview" title="1. Overview">
              <p>
                PrintPocketShop provides digital products and related services.
                In order to operate the site, process orders, deliver products,
                respond to support requests, and improve the customer
                experience, we may collect and process certain personal
                information.
              </p>
              <p>
                We aim to collect only the information reasonably necessary for
                legitimate business purposes, customer support, legal
                compliance, fraud prevention, and service improvement.
              </p>
            </SectionCard>

            <SectionCard
              id="information-collected"
              title="2. Information We Collect"
            >
              <p>
                Depending on how you interact with PrintPocketShop, we may
                collect different categories of information, including:
              </p>

              <ul className="list-disc space-y-2 pl-5">
                <li>
                  identity and contact information, such as your name, email
                  address, and account details;
                </li>
                <li>
                  account information, including login-related details and
                  preferences associated with your customer account;
                </li>
                <li>
                  transaction information, such as products purchased, order
                  dates, payment status, download access, and invoice-related
                  records;
                </li>
                <li>
                  communications you send to us, including support requests,
                  messages, and other correspondence;
                </li>
                <li>
                  technical and device information, such as browser type, device
                  type, operating system, IP address, approximate location data,
                  referral information, and site usage data;
                </li>
                <li>
                  analytics and interaction data, such as pages viewed, session
                  activity, click behavior, and navigation patterns on the
                  site.
                </li>
              </ul>

              <p>
                We do not intentionally collect more personal information than
                is reasonably necessary for the purposes described in this
                policy.
              </p>
            </SectionCard>

            <SectionCard
              id="how-we-collect"
              title="3. How Information Is Collected"
            >
              <p>We may collect information in several ways, including when you:</p>

              <ul className="list-disc space-y-2 pl-5">
                <li>browse or interact with the website;</li>
                <li>create or update an account;</li>
                <li>place an order or attempt a purchase;</li>
                <li>download or access purchased digital products;</li>
                <li>contact us for support or other inquiries;</li>
                <li>subscribe to updates, newsletters, or promotional communications where offered;</li>
                <li>interact with site tools that use cookies, analytics, or similar technologies.</li>
              </ul>

              <p>
                Some information is provided directly by you, some is generated
                automatically by your use of the site, and some may be received
                from trusted service providers involved in processing payments,
                analytics, fraud prevention, or platform operations.
              </p>
            </SectionCard>

            <SectionCard
              id="use-of-information"
              title="4. How We Use Your Information"
            >
              <p>We may use collected information for purposes such as:</p>

              <ul className="list-disc space-y-2 pl-5">
                <li>creating and managing customer accounts;</li>
                <li>processing orders and delivering digital products;</li>
                <li>providing download access and purchase history;</li>
                <li>communicating with you regarding purchases, account activity, or support matters;</li>
                <li>verifying transactions and preventing fraud, abuse, or unauthorized access;</li>
                <li>maintaining, improving, and securing the website and customer experience;</li>
                <li>analyzing usage trends and site performance;</li>
                <li>complying with legal, regulatory, tax, accounting, or enforcement obligations;</li>
                <li>sending service-related communications and, where allowed, limited promotional or marketing messages.</li>
              </ul>

              <p>
                We do not sell your personal information in the ordinary sense
                of directly exchanging it for money. Any data use is limited to
                legitimate operational, legal, support, and business purposes.
              </p>
            </SectionCard>

            <SectionCard id="legal-basis" title="5. Legal Bases for Processing">
              <p>
                Where applicable law requires a legal basis for processing, we
                may rely on one or more of the following:
              </p>

              <ul className="list-disc space-y-2 pl-5">
                <li>
                  performance of a contract, such as processing your order and
                  providing access to purchased products;
                </li>
                <li>
                  compliance with a legal obligation, such as tax, accounting,
                  fraud prevention, or lawful disclosure requirements;
                </li>
                <li>
                  legitimate interests, such as securing the site, improving
                  services, administering accounts, and responding to customer
                  inquiries;
                </li>
                <li>
                  consent, where consent is requested for a specific purpose,
                  such as optional marketing communications or certain cookies.
                </li>
              </ul>

              <p>
                The applicable legal basis may vary depending on the nature of
                the interaction and the laws that apply to your jurisdiction.
              </p>
            </SectionCard>

            <SectionCard
              id="payments"
              title="6. Payments and Transaction Data"
            >
              <p>
                Payment transactions may be handled by third-party payment
                processors. We may receive transaction-related information such
                as payment status, billing identifiers, order totals, and fraud
                screening results, but we do not necessarily store full payment
                card details on our own systems.
              </p>
              <p>
                Information connected to purchases may be retained for order
                fulfillment, customer support, accounting, dispute handling,
                legal compliance, and internal business records.
              </p>
            </SectionCard>

            <SectionCard
              id="cookies"
              title="7. Cookies and Similar Technologies"
            >
              <p>
                We may use cookies, local storage, pixels, analytics scripts,
                and similar technologies to operate the site, remember user
                preferences, maintain sessions, improve performance, understand
                traffic patterns, and support security-related functions.
              </p>
              <p>
                These technologies may help us remember cart contents, recognize
                repeat visits, monitor functionality, and measure how visitors
                interact with pages and features.
              </p>
              <p>
                Depending on your jurisdiction, you may have choices regarding
                non-essential cookies or similar technologies through your
                browser settings or any consent tools we may provide.
              </p>
            </SectionCard>

            <SectionCard id="sharing" title="8. Sharing of Information">
              <p>
                We may share personal information only where reasonably
                necessary for operating PrintPocketShop, fulfilling purchases,
                securing the site, complying with law, or protecting our rights.
                This may include sharing information with:
              </p>

              <ul className="list-disc space-y-2 pl-5">
                <li>payment processors and billing providers;</li>
                <li>website hosting, infrastructure, analytics, and technical service providers;</li>
                <li>email delivery and customer communication providers;</li>
                <li>fraud detection, authentication, or security service providers;</li>
                <li>professional advisers, auditors, insurers, or legal representatives where necessary;</li>
                <li>authorities, regulators, or law enforcement where disclosure is legally required or reasonably necessary.</li>
              </ul>

              <p>
                We may also disclose information if needed to enforce our terms,
                detect or prevent unlawful activity, respond to legal claims, or
                protect the safety, rights, or property of PrintPocketShop, our
                users, or others.
              </p>
            </SectionCard>

            <SectionCard id="retention" title="9. Data Retention">
              <p>
                We retain personal information for as long as reasonably
                necessary to fulfill the purposes described in this policy,
                including providing services, maintaining records, resolving
                disputes, enforcing agreements, preventing fraud, and complying
                with legal, tax, accounting, or regulatory obligations.
              </p>
              <p>
                Retention periods may vary depending on the type of information,
                the nature of the relationship with you, the products purchased,
                legal requirements, and operational needs.
              </p>
            </SectionCard>

            <SectionCard id="security" title="10. Data Security">
              <p>
                We use appropriate technical and organizational measures
                designed to help protect personal information from unauthorized
                access, misuse, alteration, disclosure, or destruction.
              </p>
              <p>
                While we work to maintain reasonable safeguards, no method of
                transmission over the internet or method of electronic storage
                is completely secure. As a result, we cannot guarantee absolute
                security of information at all times.
              </p>
              <p>
                You are also responsible for protecting your own account
                credentials, devices, and access to your email and downloads.
              </p>
            </SectionCard>

            <SectionCard
              id="international"
              title="11. International Transfers"
            >
              <p>
                Depending on where you are located and where our service
                providers operate, your information may be processed or stored
                in countries other than your own.
              </p>
              <p>
                Where required, we may rely on contractual protections,
                operational safeguards, or other lawful mechanisms intended to
                support the lawful transfer of personal information across
                borders.
              </p>
            </SectionCard>

            <SectionCard id="rights" title="12. Your Privacy Rights">
              <p>
                Depending on your jurisdiction, you may have rights regarding
                your personal information, which may include the right to:
              </p>

              <ul className="list-disc space-y-2 pl-5">
                <li>request access to certain personal information we hold;</li>
                <li>request correction of inaccurate or incomplete information;</li>
                <li>request deletion of certain information, subject to legal or operational limits;</li>
                <li>request restriction of certain processing activities;</li>
                <li>object to certain processing based on legitimate interests;</li>
                <li>withdraw consent where processing is based on consent;</li>
                <li>request portability of information where applicable.</li>
              </ul>

              <p>
                These rights are not absolute and may depend on applicable law,
                identity verification, and the nature of the information
                involved. To exercise a privacy-related request, please contact
                us using the method listed on the site.
              </p>
            </SectionCard>

            <SectionCard
              id="children"
              title="13. Children's Privacy"
            >
              <p>
                PrintPocketShop is not intended for use by young children, and
                we do not knowingly collect personal information from children
                where doing so would violate applicable law.
              </p>
              <p>
                If you believe that personal information relating to a child has
                been submitted to us inappropriately, please contact us so that
                we can review the matter and take appropriate action.
              </p>
            </SectionCard>

            <SectionCard
              id="third-party-links"
              title="14. Third-Party Links and Services"
            >
              <p>
                The site may contain links to third-party websites, tools,
                integrations, or services. This Privacy Policy applies to
                PrintPocketShop and does not necessarily apply to the privacy
                practices of third parties.
              </p>
              <p>
                We encourage you to review the privacy policies of any third
                parties whose services you use or whose websites you visit
                through external links.
              </p>
            </SectionCard>

            <SectionCard id="changes" title="15. Changes to This Policy">
              <p>
                We may update this Privacy Policy from time to time to reflect
                changes in legal requirements, business operations, technology,
                third-party services, or site functionality.
              </p>
              <p>
                Any updated version becomes effective when posted on this page,
                unless another effective date is stated. Your continued use of
                the site after an updated version is posted indicates acceptance
                of the revised policy to the extent permitted by law.
              </p>
            </SectionCard>

            <SectionCard id="contact" title="16. Contact Us">
              <p>
                If you have questions about this Privacy Policy, want to make a
                privacy-related request, or need clarification regarding how
                your information is handled, please contact us through the
                support or contact method listed on PrintPocketShop.
              </p>
              <p>
                For faster support, include the email address associated with
                your account or order and a short description of your request.
              </p>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}