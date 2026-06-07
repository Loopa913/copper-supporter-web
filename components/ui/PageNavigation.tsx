import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";

export type PageNavItem = {
  title: string;
  href: string;
  caption?: string;
};

type PageNavigationProps = {
  prev?: PageNavItem | null;
  next?: PageNavItem | null;
};

export function PageNavigation({ prev, next }: PageNavigationProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-16 border-t border-border pt-8 md:pt-12 pb-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col sm:flex-row items-center justify-between gap-4">
        {prev ? (
          <Link
            href={prev.href}
            className="group flex w-full sm:flex-1 items-center gap-4 rounded-full border border-border bg-white px-6 py-4 sm:px-8 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-copper/30 hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-copper" />
            <div className="flex flex-col items-start min-w-0 flex-1">
              <span className="truncate w-full text-[11px] sm:text-xs font-medium tracking-wide text-text-muted transition-colors group-hover:text-copper/70">
                {prev.caption || "이전 페이지"}
              </span>
              <span className="truncate w-full mt-0.5 text-sm sm:text-base font-semibold tracking-tight text-text-primary transition-colors group-hover:text-copper">
                {prev.title}
              </span>
            </div>
          </Link>
        ) : (
          <div className="hidden sm:block flex-1" />
        )}
        
        {next ? (
          <Link
            href={next.href}
            className="group flex w-full sm:flex-1 items-center justify-end gap-4 rounded-full border border-border bg-white px-6 py-4 sm:px-8 transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-copper/30 hover:shadow-md"
          >
            <div className="flex flex-col items-end min-w-0 flex-1 text-right">
              <span className="truncate w-full text-[11px] sm:text-xs font-medium tracking-wide text-text-muted transition-colors group-hover:text-copper/70">
                {next.caption || "다음 페이지"}
              </span>
              <span className="truncate w-full mt-0.5 text-sm sm:text-base font-semibold tracking-tight text-text-primary transition-colors group-hover:text-copper">
                {next.title}
              </span>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-copper" />
          </Link>
        ) : (
          <div className="hidden sm:block flex-1" />
        )}
      </div>
    </div>
  );
}
