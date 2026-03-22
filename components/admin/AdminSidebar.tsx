"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Folder,
  ShoppingCart,
  Receipt,
  Sparkles,
  TicketPercent,
} from "lucide-react";

const NAV_LINKS = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/categories", label: "Categories", icon: Folder },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/codes", label: "Codes", icon: TicketPercent },
  { href: "/admin/invoices", label: "Invoices", icon: Receipt },
  { href: "/admin/updates", label: "Updates", icon: Sparkles },
];

function isLinkActive(pathname: string, href: string) {
  return href === "/admin"
    ? pathname === "/admin"
    : pathname === href || pathname.startsWith(href + "/");
}

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:w-72">
      {/* Mobile */}
      <div className="lg:hidden">
        <div className="space-y-3">
          <div className="overflow-hidden rounded-[22px] border border-border/70 bg-background/95 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur">
            <div className="border-b border-border/60 px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Admin panel
                  </p>
                  <h2 className="mt-1 text-sm font-semibold text-foreground">
                    Navigation
                  </h2>
                </div>

                <div className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">
                  {NAV_LINKS.find((link) => isLinkActive(pathname, link.href))
                    ?.label ?? "Menu"}
                </div>
              </div>
            </div>

            <div className="px-3 py-3">
              <nav className="grid grid-cols-2 gap-2">
                {NAV_LINKS.map((link, index) => {
                  const isActive = isLinkActive(pathname, link.href);
                  const Icon = link.icon;

                  return (
                    <Link key={link.href} href={link.href} className="block">
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.32,
                          delay: index * 0.03,
                          ease: [0.22, 1, 0.36, 1],
                        }}
                        whileTap={{ scale: 0.98 }}
                        className={clsx(
                          "relative flex min-h-[84px] flex-col justify-between rounded-2xl px-3.5 py-3.5",
                          "transition-all duration-200",
                          isActive
                            ? "bg-foreground text-background shadow-[0_10px_22px_rgba(15,23,42,0.14)]"
                            : "bg-muted/40 text-foreground hover:bg-muted/70"
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div
                            className={clsx(
                              "flex h-10 w-10 items-center justify-center rounded-xl transition-colors duration-200",
                              isActive
                                ? "bg-white/12 text-white"
                                : "bg-background text-foreground shadow-sm"
                            )}
                          >
                            <Icon className="h-[18px] w-[18px] shrink-0" />
                          </div>

                          {isActive && (
                            <motion.span
                              layoutId="admin-mobile-active-pill"
                              className="h-2 w-2 rounded-full bg-white/90"
                              transition={{
                                type: "spring",
                                stiffness: 420,
                                damping: 30,
                              }}
                            />
                          )}
                        </div>

                        <div className="pt-3">
                          <p
                            className={clsx(
                              "text-sm font-semibold leading-5",
                              isActive
                                ? "text-white"
                                : "text-foreground"
                            )}
                          >
                            {link.label}
                          </p>
                        </div>
                      </motion.div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>

          <div className="-mx-1 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <nav className="flex min-w-max gap-2 pb-1">
              {NAV_LINKS.map((link) => {
                const isActive = isLinkActive(pathname, link.href);
                const Icon = link.icon;

                return (
                  <Link key={`${link.href}-chip`} href={link.href} className="shrink-0">
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      transition={{
                        type: "spring",
                        stiffness: 360,
                        damping: 28,
                      }}
                      className={clsx(
                        "inline-flex min-h-10 items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium whitespace-nowrap transition-all duration-200",
                        isActive
                          ? "bg-foreground text-background shadow-sm"
                          : "bg-muted/55 text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-3.5 w-3.5 shrink-0" />
                      <span>{link.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop */}
      <nav className="hidden space-y-2 lg:block">
        {NAV_LINKS.map((link) => {
          const isActive = isLinkActive(pathname, link.href);
          const Icon = link.icon;

          return (
            <Link key={link.href} href={link.href} className="block">
              <motion.div
                whileHover={{ x: 3 }}
                transition={{
                  type: "spring",
                  stiffness: 350,
                  damping: 25,
                }}
                className={clsx(
                  "relative flex items-center gap-3 rounded-xl px-4 py-3 text-[15px] font-medium",
                  "border transition-all duration-200",
                  isActive
                    ? "bg-accent/8 border-accent/20 text-foreground"
                    : "bg-background border-border text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="account-sidebar-indicator"
                    className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-full bg-accent"
                    transition={{
                      type: "spring",
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}

                <Icon className="relative z-10 h-4.5 w-4.5" />
                <span className="relative z-10">{link.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}