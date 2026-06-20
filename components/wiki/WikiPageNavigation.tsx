import { ArrowLeft, ArrowRight } from "lucide-react";

export type WikiPageNavItem = {
  title: string;
  slug: string;
  caption?: string;
};

type WikiPageNavigationProps = {
  prev?: WikiPageNavItem | null;
  next?: WikiPageNavItem | null;
  onNavigate: (slug: string) => void;
};

export function WikiPageNavigation({ prev, next, onNavigate }: WikiPageNavigationProps) {
  if (!prev && !next) return null;

  return (
    <div className="mt-8 border-t border-border bg-[#FBFBFA]/50 px-4 py-8 sm:px-5 md:bg-transparent md:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-stretch justify-between gap-3 sm:gap-4 sm:flex-row md:px-12">
        {prev ? (
          <button
            type="button"
            onClick={() => onNavigate(prev.slug)}
            className="group flex w-full flex-1 items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-left transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-copper/30 hover:shadow-md sm:gap-4 sm:rounded-full sm:px-8 sm:py-4"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-copper" />
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium tracking-wide text-text-muted transition-colors group-hover:text-copper/70 sm:text-xs">
                {prev.caption || "이전 문서"}
              </span>
              <span className="mt-0.5 block break-words text-sm font-semibold leading-snug tracking-tight text-text-primary transition-colors group-hover:text-copper sm:truncate sm:text-base">
                {prev.title}
              </span>
            </div>
          </button>
        ) : (
          <div className="hidden flex-1 sm:block" />
        )}

        {next ? (
          <button
            type="button"
            onClick={() => onNavigate(next.slug)}
            className="group flex w-full flex-1 items-center gap-3 rounded-xl border border-border bg-white px-4 py-3.5 text-left transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-copper/30 hover:shadow-md sm:justify-end sm:gap-4 sm:rounded-full sm:px-8 sm:py-4 sm:text-right"
          >
            <div className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium tracking-wide text-text-muted transition-colors group-hover:text-copper/70 sm:text-xs">
                {next.caption || "다음 문서"}
              </span>
              <span className="mt-0.5 block break-words text-sm font-semibold leading-snug tracking-tight text-text-primary transition-colors group-hover:text-copper sm:truncate sm:text-base">
                {next.title}
              </span>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-copper" />
          </button>
        ) : (
          <div className="hidden flex-1 sm:block" />
        )}
      </div>
    </div>
  );
}

// Keep Link-based export out — wiki uses client-side navigation only.
