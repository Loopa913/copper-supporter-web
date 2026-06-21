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
    <div className="mt-8 border-t border-border px-5 py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-row items-stretch justify-between gap-4 px-12">
        {prev ? (
          <button
            type="button"
            onClick={() => onNavigate(prev.slug)}
            className="group flex w-full flex-1 items-center gap-4 rounded-full border border-border bg-white px-8 py-4 text-left transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-copper/30 hover:shadow-md"
          >
            <ArrowLeft className="h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-copper" />
            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium tracking-wide text-text-muted transition-colors group-hover:text-copper/70">
                {prev.caption || "이전 문서"}
              </span>
              <span className="mt-0.5 block truncate text-base font-semibold tracking-tight text-text-primary transition-colors group-hover:text-copper">
                {prev.title}
              </span>
            </div>
          </button>
        ) : (
          <div className="flex-1" />
        )}

        {next ? (
          <button
            type="button"
            onClick={() => onNavigate(next.slug)}
            className="group flex w-full flex-1 items-center justify-end gap-4 rounded-full border border-border bg-white px-8 py-4 text-right transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:border-copper/30 hover:shadow-md"
          >
            <div className="min-w-0 flex-1">
              <span className="block truncate text-xs font-medium tracking-wide text-text-muted transition-colors group-hover:text-copper/70">
                {next.caption || "다음 문서"}
              </span>
              <span className="mt-0.5 block truncate text-base font-semibold tracking-tight text-text-primary transition-colors group-hover:text-copper">
                {next.title}
              </span>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-text-muted transition-colors group-hover:text-copper" />
          </button>
        ) : (
          <div className="flex-1" />
        )}
      </div>
    </div>
  );
}

// Keep Link-based export out — wiki uses client-side navigation only.
