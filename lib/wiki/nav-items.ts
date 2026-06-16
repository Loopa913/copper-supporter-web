import type { WikiCategory, WikiPage } from "@/lib/data/wiki";

export type WikiNavItem = {
  slug: string;
  title: string;
};

export function buildWikiNavItems(
  categories: WikiCategory[],
  pages: WikiPage[]
): WikiNavItem[] {
  const items: WikiNavItem[] = [];

  const addPages = (parentSlug: string | null, categorySlug: string) => {
    const childPages = pages.filter(
      (page) => page.categorySlug === categorySlug && (page.parentSlug || null) === parentSlug
    );

    for (const child of childPages) {
      items.push({ title: child.title, slug: child.slug });
      addPages(child.slug, categorySlug);
    }
  };

  for (const category of categories) {
    items.push({ title: category.title, slug: category.slug });
    addPages(null, category.slug);
  }

  return items;
}

export function isWikiInternalHref(href: string): boolean {
  return href.startsWith("wiki:") || (href.startsWith("#") && href.length > 1);
}

export function getWikiSlugFromHref(href: string): string | null {
  if (href.startsWith("wiki:")) {
    return href.slice(5) || null;
  }

  if (href.startsWith("#") && href.length > 1) {
    return href.slice(1);
  }

  return null;
}

export function toWikiHref(slug: string): string {
  return `wiki:${slug}`;
}

export function resolveWikiFooterNav(
  page: { footerPrev?: { targetSlug: string; caption?: string }; footerNext?: { targetSlug: string; caption?: string } },
  navItems: WikiNavItem[],
  fallbackPrev: WikiNavItem | null,
  fallbackNext: WikiNavItem | null
) {
  const titleOf = (slug: string) => navItems.find((item) => item.slug === slug)?.title || slug;

  const prev = page.footerPrev?.targetSlug
    ? {
        slug: page.footerPrev.targetSlug,
        title: titleOf(page.footerPrev.targetSlug),
        caption: page.footerPrev.caption,
      }
    : fallbackPrev
      ? { slug: fallbackPrev.slug, title: fallbackPrev.title, caption: "이전 문서" }
      : null;

  const next = page.footerNext?.targetSlug
    ? {
        slug: page.footerNext.targetSlug,
        title: titleOf(page.footerNext.targetSlug),
        caption: page.footerNext.caption,
      }
    : fallbackNext
      ? { slug: fallbackNext.slug, title: fallbackNext.title, caption: "다음 문서" }
      : null;

  return { prev, next };
}
