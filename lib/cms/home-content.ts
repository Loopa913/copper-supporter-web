import {
  HERO_SUMMARY,
  PROJECT_TAGLINE,
  ROADMAP_DESCRIPTION,
  ROADMAP_EVENTS,
  SUPPORTERS_DESCRIPTION,
  SEED_PLAYERS_DESCRIPTION,
  SUPPORTERS,
} from "@/lib/data/home";
import type { HomeContent, SiteContentRow } from "@/lib/cms/types";
import { createClientIfConfigured } from "@/lib/supabase/server";

const DEFAULT_VIDEO_ID = "dQw4w9WgXcQ";

export function getDefaultHomeContent(): HomeContent {
  return {
    tagline: PROJECT_TAGLINE,
    heroSummary: HERO_SUMMARY,
    videoId: DEFAULT_VIDEO_ID,
    roadmapDescription: ROADMAP_DESCRIPTION,
    roadmapEvents: ROADMAP_EVENTS,
    supporterDescription: SUPPORTERS_DESCRIPTION,
    seedPlayerDescription: SEED_PLAYERS_DESCRIPTION,
    supporters: SUPPORTERS,
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

function mergeRows(rows: SiteContentRow[]): HomeContent {
  const defaults = getDefaultHomeContent();
  const map = new Map(rows.map((r) => [`${r.section}:${r.key}`, r.value]));

  return {
    tagline: parseJsonValue(map.get("hero:tagline"), defaults.tagline),
    heroSummary: parseJsonValue(map.get("hero:summary"), defaults.heroSummary),
    videoId: parseJsonValue(map.get("hero:video_id"), defaults.videoId),
    roadmapDescription: parseJsonValue(map.get("roadmap:description"), defaults.roadmapDescription),
    roadmapEvents: parseJsonValue(
      map.get("roadmap:events"),
      defaults.roadmapEvents
    ),
    supporterDescription: parseJsonValue(map.get("supporters:supporterDescription"), defaults.supporterDescription),
    seedPlayerDescription: parseJsonValue(map.get("supporters:seedPlayerDescription"), defaults.seedPlayerDescription),
    supporters: parseJsonValue(map.get("supporters:list"), defaults.supporters),
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  const supabase = await createClientIfConfigured();
  if (!supabase) return getDefaultHomeContent();

  const { data, error } = await supabase.from("site_content").select("section, key, value");

  if (error || !data?.length) {
    return getDefaultHomeContent();
  }

  return mergeRows(
    data.map((row) => ({
      section: row.section,
      key: row.key,
      value: row.value,
    }))
  );
}
