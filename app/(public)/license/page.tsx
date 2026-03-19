import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "License",
  description:
    "Review the licensing terms for PrintPocketShop digital products, including personal use, commercial use, restrictions, ownership, and upgrade guidance.",
};

const sections = [
  { id: "overview", title: "1. License Overview" },
  { id: "ownership", title: "2. Ownership and Intellectual Property" },
  { id: "personal-license", title: "3. Personal License" },
  { id: "commercial-license", title: "4. Commercial License" },
  { id: "restrictions", title: "5. General Restrictions" },
  { id: "modifications", title: "6. Modifications and Derivative Use" },
  { id: "client-work", title: "7. Client Work and End Use" },
  { id: "digital-redistribution", title: "8. Digital Redistribution Prohibition" },
  { id: "upgrade", title: "9. License Upgrades" },
  { id: "termination", title: "10. Breach and Termination" },
  { id: "clarification", title: "11. Clarification and Contact" },
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

function LicenseBox({
  title,
  subtitle,
  allowed,
  prohibited,
}: {
  title: string;
  subtitle: string;
  allowed: string[];
  prohibited: string[];
}) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.12)] backdrop-blur-xl sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-muted sm:text-[15px]">
        {subtitle}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-emerald-500/15 bg-emerald-500/[0.05] p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-emerald-400">
            You may
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
            {allowed.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-red-500/15 bg-red-500/[0.05] p-5">
          <h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-red-400">
            You may not
          </h3>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-muted">
            {prohibited.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function LicensePage() {
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
                License
              </h1>

              <p className="mt-4 text-sm leading-7 text-muted">
                This page explains how PrintPocketShop digital products may be
                used under different license types. It outlines what customers
                are permitted to do, what remains prohibited, and how license
                scope applies to personal use, commercial work, and client
                delivery.
              </p>

              <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs leading-6 text-muted">
                A purchase grants usage rights only. It does not transfer
                copyright, authorship, or ownership of the original files.
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
                  PrintPocketShop licenses digital products for specific types
                  of use. These licenses are designed to make permitted use
                  clear while protecting the original work, design files, and
                  intellectual property associated with each product.
                </p>

                <p>
                  Each purchase includes a license that defines how the product
                  may be used. The scope of that license depends on the license
                  type selected at purchase, the product description, and any
                  specific terms shown on the relevant product page.
                </p>

                <p>
                  If you are unsure whether your intended use is covered, you
                  should treat the use as not permitted until clarified. This is
                  particularly important for client delivery, resale scenarios,
                  large-scale production, and any use involving digital
                  redistribution.
                </p>
              </div>
            </section>

            <SectionCard id="overview" title="1. License Overview">
              <p>
                A PrintPocketShop purchase grants a limited, non-exclusive,
                non-transferable, revocable license to use the purchased
                product within the scope of the selected license.
              </p>
              <p>
                The license gives you rights of use only. It does not assign or
                transfer ownership of the original files, source designs,
                layout systems, branding elements, or underlying intellectual
                property.
              </p>
              <p>
                The applicable product page, checkout details, and this License
                page should be read together. If a product includes a more
                specific license statement, that product-specific statement may
                further define or limit permitted use.
              </p>
            </SectionCard>

            <SectionCard
              id="ownership"
              title="2. Ownership and Intellectual Property"
            >
              <p>
                All PrintPocketShop products remain the property of
                PrintPocketShop or its licensors, unless expressly stated
                otherwise in writing. This includes source files, templates,
                layouts, design structures, graphics, preview materials, and
                related branding or creative assets.
              </p>
              <p>
                Purchasing a product does not transfer copyright, trademark
                rights, authorship, or exclusive ownership. You receive only the
                right to use the product in accordance with the selected
                license.
              </p>
            </SectionCard>

            <LicenseBox
              title="3. Personal License"
              subtitle="The Personal License is intended for private, non-commercial use. It is suitable for customers who want to use a purchased product for themselves, for personal organization, gifting, home use, or other non-business purposes."
              allowed={[
                "use the product for your own personal projects and private purposes",
                "print or export the design for personal use",
                "customize or edit the product for your own non-commercial use",
                "store the purchased files for your own personal access and reuse within the allowed scope",
              ]}
              prohibited={[
                "resell, redistribute, sublicense, or share the original files",
                "use the product in client work, freelance work, or any business-related project",
                "offer the design or a modified version as a standalone digital product",
                "upload, publish, or make the source files publicly available",
              ]}
            />

            <LicenseBox
              title="4. Commercial License"
              subtitle="The Commercial License is intended for professional and business use. It permits broader use of the purchased product in commercial contexts, including certain client-facing and revenue-generating applications, subject to the restrictions below."
              allowed={[
                "use the product in commercial projects and business materials",
                "customize the product for brand, business, or client-facing use",
                "use the product as part of a finished end product or printed output for sale, where the original digital files are not redistributed",
                "use the product in client work where the delivered value is the finished design or final output rather than the raw template file itself",
              ]}
              prohibited={[
                "resell, sublicense, or redistribute the original template or source files as standalone digital goods",
                "offer the product, whether modified or unmodified, as a competing template, download, or editable resource",
                "claim the original design as your own intellectual property",
                "permit multiple unrelated users to reuse one license where separate licensing would reasonably be required",
              ]}
            />

            <SectionCard id="restrictions" title="5. General Restrictions">
              <p>
                Regardless of license type, certain uses are always prohibited
                unless PrintPocketShop provides explicit written permission.
              </p>

              <ul className="list-disc space-y-2 pl-5">
                <li>reselling or redistributing the original source or template files;</li>
                <li>sharing purchased files with other users, teams, communities, or clients for their independent reuse;</li>
                <li>uploading files to marketplaces, cloud libraries, shared folders, free-resource sites, or template repositories;</li>
                <li>using the product in a way that competes directly with PrintPocketShop;</li>
                <li>removing any copyright or proprietary notices where present;</li>
                <li>using the files for unlawful, deceptive, defamatory, or infringing purposes.</li>
              </ul>

              <p>
                These restrictions apply whether the product is used in its
                original form or after modification.
              </p>
            </SectionCard>

            <SectionCard
              id="modifications"
              title="6. Modifications and Derivative Use"
            >
              <p>
                You may modify purchased products to suit your permitted use,
                including editing text, colors, layouts, images, dimensions, or
                design elements where the file format supports modification.
              </p>
              <p>
                However, modifying a product does not create ownership rights in
                the original design and does not remove the restrictions that
                apply to the licensed asset. A modified version remains subject
                to the same licensing limitations unless a broader written
                permission has been granted.
              </p>
            </SectionCard>

            <SectionCard
              id="client-work"
              title="7. Client Work and End Use"
            >
              <p>
                Commercial-license purchases may generally be used in client
                work, provided the client receives a finished output, finished
                design application, or completed end product rather than the raw
                template or reusable source file itself.
              </p>
              <p>
                Unless expressly permitted, you may not transfer the original
                source files to a client for their own independent reuse,
                resale, modification, or redistribution under a single purchase
                intended only for your use.
              </p>
              <p>
                If the intended project involves repeated reuse by a client,
                multi-user deployment, or broader redistribution rights, an
                upgraded or custom license may be required.
              </p>
            </SectionCard>

            <SectionCard
              id="digital-redistribution"
              title="8. Digital Redistribution Prohibition"
            >
              <p>
                PrintPocketShop products may not be redistributed as digital
                goods in a way that allows another party to access, edit,
                extract, repurpose, or reuse the original design resource as a
                template, asset, or source file.
              </p>
              <p>
                This prohibition applies to standalone file sales, bundled
                downloads, marketplace uploads, free giveaways, membership
                libraries, shared drives, educational resource packs, template
                swaps, and any similar distribution model.
              </p>
              <p>
                In simple terms: you may use the product to create an end
                result within your license scope, but you may not pass the
                product itself along as a reusable digital resource.
              </p>
            </SectionCard>

            <SectionCard id="upgrade" title="9. License Upgrades">
              <p>
                If your intended use expands beyond the scope of the license you
                originally purchased, you should obtain the appropriate upgraded
                license before proceeding with that use.
              </p>
              <p>
                Examples of situations that may require an upgrade include
                moving from personal to commercial use, using a product in
                client projects, scaling to broader business deployment, or
                needing rights not covered by the standard license terms.
              </p>
              <p>
                Where available, upgrades may be purchased through your account
                or by contacting us for clarification.
              </p>
            </SectionCard>

            <SectionCard
              id="termination"
              title="10. Breach and Termination"
            >
              <p>
                Any use of a product outside the permitted scope of the selected
                license constitutes a breach of the license terms.
              </p>
              <p>
                In the event of a breach, PrintPocketShop may revoke the
                license, suspend account access, refuse future service, require
                removal of unauthorized uses, or pursue other remedies available
                under law or contract.
              </p>
              <p>
                Termination of a license does not waive any rights arising from
                prior unauthorized use.
              </p>
            </SectionCard>

            <SectionCard
              id="clarification"
              title="11. Clarification and Contact"
            >
              <p>
                If you are unsure whether a specific use is covered under a
                Personal License or Commercial License, please contact us before
                using the product in that way.
              </p>
              <p>
                This is especially important for marketplace distribution,
                large-volume resale, digital product creation, white-label use,
                team access, client-source delivery, educational distribution,
                and any use where the original file may be passed to another
                party.
              </p>
              <p>
                For faster assistance, include the product name and a short
                description of your intended use when reaching out.
              </p>
            </SectionCard>
          </div>
        </div>
      </div>
    </main>
  );
}