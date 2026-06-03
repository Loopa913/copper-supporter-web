import Link from "next/link";
import { NAV_ITEMS } from "@/lib/constants/navigation";

export function Footer() {
  const mainNav = NAV_ITEMS.filter((item) => item.href !== "/admin");

  return (
    <footer className="site-footer">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div>
            <p className="text-lg font-semibold tracking-tight text-text-primary">
              함께 만드는 스트리머 프로젝트
            </p>
            <p className="mt-3 max-w-md text-sm font-light leading-loose text-text-secondary">
              공식 홈페이지
            </p>
          </div>
          <nav className="flex flex-wrap gap-x-8 gap-y-3" aria-label="푸터 링크">
            {mainNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-medium text-text-secondary transition-colors duration-300 hover:text-copper"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <p className="mt-12 text-center text-xs font-light text-text-muted sm:text-left">
          © {new Date().getFullYear()} Supporter Project
        </p>
      </div>
    </footer>
  );
}
