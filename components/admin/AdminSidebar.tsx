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

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:w-72">
      {/* Mobile */}
      <div className="lg:hidden">
        <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <nav className="flex min-w-max gap-2 pb-1">
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === "/admin"
                  ? pathname === "/admin"
                  : pathname === link.href ||
                    pathname.startsWith(link.href + "/");

              const Icon = link.icon;

              return (
                <Link key={link.href} href={link.href} className="shrink-0">
                  <motion.div
                    whileTap={{ scale: 0.98 }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 25,
                    }}
                    className={clsx(
                      "flex min-h-11 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium whitespace-nowrap",
                      "transition-all duration-200",
                      isActive
                        ? "bg-foreground text-background shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{link.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Desktop */}
      <nav className="hidden space-y-2 lg:block">
        {NAV_LINKS.map((link) => {
          const isActive =
            link.href === "/admin"
              ? pathname === "/admin"
              : pathname === link.href ||
                pathname.startsWith(link.href + "/");

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