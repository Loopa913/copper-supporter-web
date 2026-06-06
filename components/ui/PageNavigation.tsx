import Link from "next/link";

export type PageNavItem = {
  title: string;
  href: string;
};

type PageNavigationProps = {
  prev?: PageNavItem | null;
  next?: PageNavItem | null;
};

export function PageNavigation({ prev, next }: PageNavigationProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-16 border-t border-border pt-8 md:pt-12 pb-8">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        {prev ? (
          <Link
            href={prev.href}
            className="group flex flex-1 flex-col items-start rounded-xl border border-border bg-white p-4 text-left transition-colors hover:border-copper/30 hover:bg-copper/[0.02] shadow-sm"
          >
            <span className="text-[11px] font-medium tracking-wide text-text-muted transition-colors group-hover:text-copper/70">
              이전 페이지
            </span>
            <span className="mt-1.5 line-clamp-2 text-sm font-semibold tracking-tight text-text-primary transition-colors group-hover:text-copper">
              {prev.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        
        {next ? (
          <Link
            href={next.href}
            className="group flex flex-1 flex-col items-end rounded-xl border border-border bg-white p-4 text-right transition-colors hover:border-copper/30 hover:bg-copper/[0.02] shadow-sm"
          >
            <span className="text-[11px] font-medium tracking-wide text-text-muted transition-colors group-hover:text-copper/70">
              다음 페이지
            </span>
            <span className="mt-1.5 line-clamp-2 text-sm font-semibold tracking-tight text-text-primary transition-colors group-hover:text-copper">
              {next.title}
            </span>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}
