import { WIKI_CATEGORIES, WIKI_PAGES } from "@/lib/data/wiki";
import type { SiteContentRow } from "@/lib/cms/types";
import { createClientIfConfigured } from "@/lib/supabase/server";
import type { WikiCategory, WikiPage } from "@/lib/data/wiki";

export type WikiContent = {
  categories: WikiCategory[];
  pages: WikiPage[];
};

export function getDefaultWikiContent(): WikiContent {
  return {
    categories: WIKI_CATEGORIES,
    pages: WIKI_PAGES,
  };
}

function parseJsonValue<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return value as unknown as T;
    }
  }
  return value as T;
}

function mergeWikiRows(rows: SiteContentRow[]): WikiContent {
  const defaults = getDefaultWikiContent();
  const map = new Map(rows.map((r) => [`${r.section}:${r.key}`, r.value]));

  return {
    categories: parseJsonValue(map.get("wiki:categories"), defaults.categories),
    pages: parseJsonValue(map.get("wiki:pages"), defaults.pages),
  };
}

export async function getWikiContent(): Promise<WikiContent> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return getDefaultWikiContent();

  const { data, error } = await supabase
    .from("site_content")
    .select("section, key, value")
    .eq("section", "wiki");

  if (error || !data?.length) {
    return getDefaultWikiContent();
  }

  return mergeWikiRows(
    data.map((row) => ({
      section: row.section,
      key: row.key,
      value: row.value,
    }))
  );
}
