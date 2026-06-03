"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils/cn";
import type { GlobalConfig } from "@/lib/cms/global-config";

const PUBLIC_NAV = NAV_ITEMS.filter((item) => item.href !== "/admin");

export function Navbar({ config }: { config?: GlobalConfig }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="gnb-modern">
      <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-8 px-5 sm:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-3 transition-opacity duration-300 hover:opacity-80"
        >
          {config?.logoUrl ? (
            <img src={config.logoUrl} alt="Logo" className="h-11 w-11 object-cover rounded-2xl shadow-md" />
          ) : (
            <span
              className="flex h-11 w-11 items-center justify-center rounded-2xl bg-copper text-sm font-semibold text-white shadow-md shadow-copper/20"
              aria-hidden
            >
              CP
            </span>
          )}
          <div>
            <span className="block text-[15px] font-semibold tracking-tight text-text-primary">
              함께 만드는 스트리머 프로젝트
            </span>
            <span className="block text-xs font-light text-text-muted">
              Streamer Project
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="주요 메뉴">
          {PUBLIC_NAV.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out",
                  isActive
                    ? "bg-copper-muted text-copper"
                    : "text-text-secondary hover:bg-surface-warm hover:text-copper"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <button
          type="button"
          className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border text-text-primary transition-all duration-300 ease-in-out hover:border-copper/20 hover:bg-copper-muted hover:shadow-md lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-border bg-white/95 backdrop-blur-xl lg:hidden"
            aria-label="모바일 메뉴"
          >
            <ul className="flex flex-col gap-1 px-5 py-4">
              {PUBLIC_NAV.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-300",
                        isActive
                          ? "bg-copper-muted text-copper"
                          : "text-text-secondary hover:bg-surface-warm"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
