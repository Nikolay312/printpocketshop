  "use client";

  import Link from "next/link";
  import { usePathname } from "next/navigation";
  import clsx from "clsx";
  import { motion } from "framer-motion";
  import {
    User,
    Package,
    Download,
    Settings,
  } from "lucide-react";

  const NAV_LINKS = [
    { href: "/account/profile", label: "Profile", icon: User },
    { href: "/account/orders", label: "Orders", icon: Package },
    { href: "/account/downloads", label: "Downloads", icon: Download },
    { href: "/account/settings", label: "Settings", icon: Settings },
  ];

  export default function AccountSidebar() {
    const pathname = usePathname();

    return (
      <aside className="w-full lg:w-72 shrink-0">
        <nav className="space-y-2">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
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
                  {/* Linear-style active bar */}
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

                  <span className="relative z-10">
                    {link.label}
                  </span>
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </aside>
    );
  }
