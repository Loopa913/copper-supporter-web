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
